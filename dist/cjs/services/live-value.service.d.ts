import { Observable } from 'rxjs';
import { HttpConfig } from '../models/http-config.model';
import { Disposable } from '../interfaces/disposable';
export declare type LivePackage = {
    identifier: string;
    timestamp: Date;
};
export declare type SignalLiveValue = {
    value: any;
} & LivePackage;
export declare type SignalOffsetValue = {
    value: any;
} & LivePackage;
export declare type TimestampPackage = LivePackage;
export declare enum LiveHubMethod {
    ChangeModeAsync = "ChangeModeAsync",
    ChangeIntervalAsync = "ChangeIntervalAsync",
    SubscribeMany = "SubscribeMany"
}
export declare enum LiveHubEvent {
    Send = "Send"
}
export declare enum SubscriptionPrefix {
    S = "S",
    SO = "SO",
    T = "T",
    TC = "TC"
}
export declare class LiveValueService implements Disposable {
    private httpConfig;
    private accessToken;
    private hubConnection;
    private _valueCache;
    private _subscribedIds;
    private _livePackageObserver;
    private _queuedIds;
    private _subscribeRequested;
    private _connectionEstablished;
    private _unsub;
    constructor(httpConfig: HttpConfig, accessToken: string | Observable<string>);
    connect(): Observable<void>;
    connectWithUrl(hubUrl: string): Observable<void>;
    dispose(): void;
    subscribeToSignalValues(signalIds: string[]): Observable<SignalLiveValue[]>;
    subscribeToSignalOffsets(signalIds: string[]): Observable<SignalLiveValue[]>;
    subscribeToTimestamp(ids: string[]): Observable<TimestampPackage[]>;
    subscribeLiveValuePackages(packageIds: string[]): Observable<LivePackage[]>;
    private _enqueueIdsToSubscribe;
    private _handleSubscriptionQueue;
    private _getCachedValuePackages;
    private _sendMessage;
    private _handleHubMessage;
    private _establishConnectionAndHandleEvents;
    private _buildHubConnection;
}