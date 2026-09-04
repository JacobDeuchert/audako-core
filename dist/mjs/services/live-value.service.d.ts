import { Observable } from 'rxjs';
import { ApiContext } from '../api/api-context.js';
import { ApiVersionInfo } from '../api/api-version.js';
import { HttpConfig } from '../models/http-config.model.js';
import { Disposable } from '../interfaces/disposable.js';
import { AsyncValue } from '../utils/async-value-utils.js';
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
export declare enum OperationStatus {
    Running = "Running",
    Success = "Success",
    Failed = "Failed"
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
export declare enum LiveHubMethod {
    ChangeModeAsync = "ChangeModeAsync",
    ChangeIntervalAsync = "ChangeIntervalAsync",
    SubscribeMany = "SubscribeMany"
}
/** Interval the service asks the hub for after connecting. */
export declare const DEFAULT_LIVE_INTERVAL_MS = 500;
/**
 * Smallest interval v5 honours: `ChangeIntervalAsync` is clamped to 250 ms server-side, so
 * anything below is silently raised. v4 had no lower bound, so values are passed through there.
 */
export declare const MIN_LIVE_INTERVAL_MS_V5 = 250;
/** Clamps a requested live interval to what the target version accepts. */
export declare function clampLiveInterval(intervalMs: number, versionInfo?: ApiVersionInfo): number;
export declare enum LiveHubEvent {
    Send = "Send"
}
export declare enum SubscriptionPrefix {
    S = "S",
    SO = "SO",
    T = "T",
    TC = "TC",
    OP = "OP"
}
export declare class LiveValueService implements Disposable {
    private hubConnection;
    private _valueCache;
    private _subscribedIds;
    private _livePackageObserver;
    private _queuedIds;
    private _subscribeRequested;
    private _connectionEstablished;
    private _unsub;
    protected ctx: ApiContext;
    private _versionInfo?;
    /**
     * @param ctx Context of the target system.
     */
    constructor(ctx: ApiContext);
    /**
     * @deprecated Pass an `ApiContext` instead. This form cannot carry version information and
     * will be removed in a future major.
     */
    constructor(httpConfig: AsyncValue<HttpConfig>, accessToken: AsyncValue<string>);
    /**
     * URL of the live hub for the detected platform version: `{live}/hub` on v4, `{live}/values`
     * on v5. `Services.Live` still carries no `/v1` in the v5 config, so the service path is
     * always read from the config (docs/analysis/v4-to-v5-endpoints.md section 5).
     */
    getHubUrl(): Promise<string>;
    connect(): Promise<void>;
    /**
     * Asks the hub for a different update interval. On v5 the value is clamped to
     * {@link MIN_LIVE_INTERVAL_MS_V5}, which the server enforces anyway.
     */
    changeInterval(intervalMs: number): void;
    connectWithUrl(hubUrl: string): Promise<void>;
    dispose(): void;
    subscribeToSignalValues(signalIds: string[]): Observable<SignalLiveValue[]>;
    subscribeToSignalOffsets(signalIds: string[]): Observable<SignalLiveValue[]>;
    subscribeToTimestamp(ids: string[]): Observable<TimestampPackage[]>;
    subscribeToOperations(operationIds: string[]): Observable<OperationMessage[]>;
    getOperationStatus(operationId: string): Observable<OperationMessage>;
    subscribeLiveValuePackages(packageIds: string[]): Observable<LivePackage[]>;
    private _unsubscribeIds;
    private _enqueueIdsToSubscribe;
    private _handleSubscriptionQueue;
    private _getCachedValuePackages;
    private _sendMessage;
    private _handleHubMessage;
    private _establishConnectionAndHandleEvents;
    private _buildHubConnection;
    protected getAccessToken(): Promise<string>;
}
