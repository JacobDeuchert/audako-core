import {
  auditTime,
  BehaviorSubject,
  concat,
  filter,
  firstValueFrom,
  isObservable,
  map,
  mapTo,
  Observable,
  of,
  Subject,
  takeUntil,
} from 'rxjs';

import * as signalR from '@microsoft/signalr';
import { HttpConfig } from '../models/http-config.model.js';
import { Disposable } from '../interfaces/disposable.js';
import { PromiseUtils } from '../utils/promise-utils.js';
import { AsyncValue, getAsyncValueAsPromise } from '../utils/async-value-utils.js';
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

export type TimestampPackage = LivePackage;

export enum LiveHubMethod {
  ChangeModeAsync = 'ChangeModeAsync',
  ChangeIntervalAsync = 'ChangeIntervalAsync',
  SubscribeMany = 'SubscribeMany',
}

export enum LiveHubEvent {
  Send = 'Send',
}

export enum SubscriptionPrefix {
  S = 'S',
  SO = 'SO',
  T = 'T',
  TC = 'TC',
}

export class LiveValueService implements Disposable {
  private hubConnection: signalR.HubConnection;

  private _valueCache: { [key: string]: SignalLiveValue };

  private _subscribedIds: string[];

  private _livePackageObserver: Subject<SignalLiveValue[]>;

  private _queuedIds: string[];
  private _subscribeRequested: Subject<void>;

  private _connectionEstablished: BehaviorSubject<boolean>;

  private _unsub: Subject<void>;

  public constructor(
    private httpConfig: AsyncValue<HttpConfig>,
    private accessToken: AsyncValue<string>,
  ) {
    this._unsub = new Subject<void>();

    this._connectionEstablished = new BehaviorSubject<boolean>(false);

    this._valueCache = {};
    this._subscribedIds = [];
    this._queuedIds = [];
    this._livePackageObserver = new Subject<SignalLiveValue[]>();
    this._subscribeRequested = new Subject<void>();
    this._handleSubscriptionQueue();
  }

  public async connect(): Promise<void> {
    const httpConfig = await getAsyncValueAsPromise(this.httpConfig);
    return this.connectWithUrl(`${httpConfig.Services.BaseUri}${httpConfig.Services.Live}/hub`);
  }

  public connectWithUrl(hubUrl: string): Promise<void> {
    if (!this.hubConnection) {
      this.hubConnection = this._buildHubConnection(hubUrl);
      this._establishConnectionAndHandleEvents(this.hubConnection);
    }

    return firstValueFrom(
      this._connectionEstablished.pipe(
        filter((x) => x),
        mapTo(null),
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

  private _enqueueIdsToSubscribe(ids: string[]): void {
    const newIds = ids.filter((id) => !this._queuedIds.includes(id));
    if (newIds.length > 0) {
      this._queuedIds.push(...newIds);
      this._subscribeRequested.next(null);
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
        this._sendMessage(LiveHubMethod.ChangeIntervalAsync, 500);

        this.hubConnection.on('Send', (message: any) => this._handleHubMessage(message));
        console.log('Connected to SignalR');
        this._connectionEstablished.next(true);
      })
      .catch((e) => {
        this.hubConnection = null;
        this._connectionEstablished.error(e);
        console.log('Failed to start connection: ' + e.message);
      });

    this.hubConnection.onclose(() => {
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
    return getAsyncValueAsPromise(this.accessToken);
  }
}
