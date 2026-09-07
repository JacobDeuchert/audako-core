import {
  auditTime,
  BehaviorSubject,
  concat,
  filter,
  finalize,
  firstValueFrom,
  isObservable,
  map,
  Observable,
  of,
  Subject,
  takeUntil,
  takeWhile,
} from 'rxjs';

import * as signalR from '@microsoft/signalr';
import { ApiContext } from '../api/api-context.js';
import { ApiVersionInfo } from '../api/api-version.js';
import { Disposable } from '../interfaces/disposable.js';
import { PromiseUtils } from '../utils/promise-utils.js';
export type LivePackage = {
  identifier: string;
  timestamp: Date;
};

export type SignalLiveValue = {
  value: any;
} & LivePackage;

export type SignalOffsetValue = {
  value: any;
} & LivePackage;

export enum OperationStatus {
  Running = 'Running',
  Success = 'Success',
  Failed = 'Failed',
}

export type OperationMessage = {
  id: string;
  name: string;
  status: OperationStatus;

  statusMessage?: string;
  createdOn: Date;

  updatedOn?: Date;
  error: string;
} & LivePackage;

export type TimestampPackage = LivePackage;

export enum LiveHubMethod {
  ChangeModeAsync = 'ChangeModeAsync',
  ChangeIntervalAsync = 'ChangeIntervalAsync',
  SubscribeMany = 'SubscribeMany',
}

/** Interval the service asks the hub for after connecting. */
export const DEFAULT_LIVE_INTERVAL_MS = 500;

/**
 * Smallest interval v5 honours: `ChangeIntervalAsync` is clamped to 250 ms server-side, so
 * anything below is silently raised. v4 had no lower bound, so values are passed through there.
 */
export const MIN_LIVE_INTERVAL_MS_V5 = 250;

/** Clamps a requested live interval to what the target version accepts. */
export function clampLiveInterval(intervalMs: number, versionInfo?: ApiVersionInfo): number {
  if (versionInfo?.isV5) {
    return Math.max(intervalMs, MIN_LIVE_INTERVAL_MS_V5);
  }
  return intervalMs;
}

export enum LiveHubEvent {
  Send = 'Send',
}

export enum SubscriptionPrefix {
  S = 'S',
  SO = 'SO',
  T = 'T',
  TC = 'TC',
  OP = 'OP',
}

export class LiveValueService implements Disposable {
  private hubConnection: signalR.HubConnection | null;

  private _valueCache: { [key: string]: SignalLiveValue };

  private _subscribedIds: string[];

  private _livePackageObserver: Subject<SignalLiveValue[]>;

  private _queuedIds: string[];
  private _subscribeRequested: Subject<void>;

  private _connectionEstablished: BehaviorSubject<boolean>;

  private _unsub: Subject<void>;

  protected ctx: ApiContext;

  private _versionInfo?: ApiVersionInfo;

  /**
   * @param ctx Context of the target system.
   */
  public constructor(ctx: ApiContext) {
    this.ctx = ctx;

    this._unsub = new Subject<void>();

    this._connectionEstablished = new BehaviorSubject<boolean>(false);

    this._valueCache = {};
    this._subscribedIds = [];
    this._queuedIds = [];
    this._livePackageObserver = new Subject<SignalLiveValue[]>();
    this._subscribeRequested = new Subject<void>();
    this._handleSubscriptionQueue();
  }

  /**
   * URL of the live hub for the detected platform version: `{live}/hub` on v4, `{live}/values`
   * on v5. `Services.Live` still carries no `/v1` in the v5 config, so the service path is
   * always read from the config (docs/analysis/v4-to-v5-endpoints.md section 5).
   */
  public async getHubUrl(): Promise<string> {
    const endpoint = await this.ctx.resolve({ name: 'liveHub' });
    return endpoint.url;
  }

  public async connect(): Promise<void> {
    this._versionInfo = await this.ctx.getVersionInfo();
    return this.connectWithUrl(await this.getHubUrl());
  }

  /**
   * Asks the hub for a different update interval. On v5 the value is clamped to
   * {@link MIN_LIVE_INTERVAL_MS_V5}, which the server enforces anyway.
   */
  public changeInterval(intervalMs: number): void {
    this._sendMessage(LiveHubMethod.ChangeIntervalAsync, clampLiveInterval(intervalMs, this._versionInfo));
  }

  public connectWithUrl(hubUrl: string): Promise<void> {
    if (!this.hubConnection) {
      this.hubConnection = this._buildHubConnection(hubUrl);
      this._establishConnectionAndHandleEvents(this.hubConnection);
    }

    return firstValueFrom(
      this._connectionEstablished.pipe(
        filter((x) => x),
        map(() => undefined),
      ),
    );
  }

  public dispose(): void {
    this.hubConnection?.stop();
    this.hubConnection = null;
    this._unsub.next();
    this._unsub.complete();
  }

  public subscribeToSignalValues(signalIds: string[]): Observable<SignalLiveValue[]> {
    const prefixedIds = signalIds.map((x) => `S:${x}`);
    return this.subscribeLiveValuePackages(prefixedIds) as Observable<SignalLiveValue[]>;
  }

  public subscribeToSignalOffsets(signalIds: string[]): Observable<SignalLiveValue[]> {
    const prefixedIds = signalIds.map((x) => `SO:${x}`);
    return this.subscribeLiveValuePackages(prefixedIds) as Observable<SignalLiveValue[]>;
  }

  public subscribeToTimestamp(ids: string[]): Observable<TimestampPackage[]> {
    return this.subscribeLiveValuePackages(ids) as Observable<TimestampPackage[]>;
  }

  public subscribeToOperations(operationIds: string[]): Observable<OperationMessage[]> {
    const prefixedIds = operationIds.map((x) => `${SubscriptionPrefix.OP}:${x}`);
    return this.subscribeLiveValuePackages(prefixedIds) as Observable<OperationMessage[]>;
  }

  public getOperationStatus(operationId: string): Observable<OperationMessage> {
    const prefixedId = `${SubscriptionPrefix.OP}:${operationId}`;
    return this.subscribeToOperations([operationId]).pipe(
      map((messages) => messages.find((x) => x.id === operationId)),
      filter((m): m is OperationMessage => m != null),
      takeWhile((m) => m.status !== OperationStatus.Success && m.status !== OperationStatus.Failed, true),
      finalize(() => this._unsubscribeIds([prefixedId])),
    );
  }

  public subscribeLiveValuePackages(packageIds: string[]): Observable<LivePackage[]> {
    const notSubscribedIds = packageIds.filter((id) => !this._subscribedIds.includes(id));

    if (this.hubConnection && notSubscribedIds.length > 0) {
      this._enqueueIdsToSubscribe(notSubscribedIds);
    }

    const cachedPackages = this._getCachedValuePackages(packageIds);

    const livePackages$ = this._livePackageObserver.pipe(
      map((values: SignalLiveValue[]) => values.filter((liveValue) => packageIds.includes(liveValue.identifier))),
      filter((values: SignalLiveValue[]) => values.length > 0),
    );

    if (cachedPackages.length > 0) {
      return concat(of(cachedPackages), livePackages$);
    }
    return livePackages$;
  }

  private _unsubscribeIds(ids: string[]): void {
    this._subscribedIds = this._subscribedIds.filter((id) => !ids.includes(id));
    ids.forEach((id) => delete this._valueCache[id]);
  }

  private _enqueueIdsToSubscribe(ids: string[]): void {
    const newIds = ids.filter((id) => !this._queuedIds.includes(id));
    if (newIds.length > 0) {
      this._queuedIds.push(...newIds);
      this._subscribeRequested.next();
    }
  }

  private _handleSubscriptionQueue(): void {
    this._subscribeRequested.pipe(takeUntil(this._unsub), auditTime(50)).subscribe(() => {
      const queuedIds = this._queuedIds;
      this._queuedIds = [];
      this._sendMessage(LiveHubMethod.SubscribeMany, queuedIds);
      this._subscribedIds.push(...queuedIds);
    });
  }

  private _getCachedValuePackages(packageIds: string[]): SignalLiveValue[] {
    return packageIds.map((id) => this._valueCache[id]).filter((value) => value !== undefined);
  }

  private _sendMessage(method: LiveHubMethod, ...args: any[]): void {
    if (this.hubConnection) {
      this.hubConnection.send(method, ...args);
    }
  }

  private _handleHubMessage(message: any) {
    if (Array.isArray(message)) {
      message.forEach((value: SignalLiveValue) => {
        this._valueCache[value.identifier] = value;
      });

      this._livePackageObserver.next(message);
    } else {
      console.info('Unknown message: ', message);
    }
  }
  private _establishConnectionAndHandleEvents(connection: signalR.HubConnection): void {
    connection
      .start()
      .then(() => {
        this._sendMessage(LiveHubMethod.ChangeModeAsync, true);
        this._sendMessage(
          LiveHubMethod.ChangeIntervalAsync,
          clampLiveInterval(DEFAULT_LIVE_INTERVAL_MS, this._versionInfo),
        );

        connection.on('Send', (message: any) => this._handleHubMessage(message));
        console.log('Connected to SignalR');
        this._connectionEstablished.next(true);
      })
      .catch((e) => {
        this.hubConnection = null;
        this._connectionEstablished.error(e);
        console.log('Failed to start connection: ' + e.message);
      });

    connection.onclose(() => {
      console.log('Hub connection closed');
      this.hubConnection = null;
    });
  }

  private _buildHubConnection(hubUrl: string): signalR.HubConnection {
    return new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => this.getAccessToken(),
      })
      .build();
  }

  protected getAccessToken(): Promise<string> {
    return this.ctx.getAccessToken();
  }
}
