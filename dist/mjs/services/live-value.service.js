var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { auditTime, BehaviorSubject, concat, filter, firstValueFrom, map, mapTo, of, Subject, takeUntil, } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { getAsyncValueAsPromise } from '../utils/async-value-utils.js';
export var LiveHubMethod;
(function (LiveHubMethod) {
    LiveHubMethod["ChangeModeAsync"] = "ChangeModeAsync";
    LiveHubMethod["ChangeIntervalAsync"] = "ChangeIntervalAsync";
    LiveHubMethod["SubscribeMany"] = "SubscribeMany";
})(LiveHubMethod || (LiveHubMethod = {}));
export var LiveHubEvent;
(function (LiveHubEvent) {
    LiveHubEvent["Send"] = "Send";
})(LiveHubEvent || (LiveHubEvent = {}));
export var SubscriptionPrefix;
(function (SubscriptionPrefix) {
    SubscriptionPrefix["S"] = "S";
    SubscriptionPrefix["SO"] = "SO";
    SubscriptionPrefix["T"] = "T";
    SubscriptionPrefix["TC"] = "TC";
})(SubscriptionPrefix || (SubscriptionPrefix = {}));
export class LiveValueService {
    constructor(httpConfig, accessToken) {
        this.httpConfig = httpConfig;
        this.accessToken = accessToken;
        this._unsub = new Subject();
        this._connectionEstablished = new BehaviorSubject(false);
        this._valueCache = {};
        this._subscribedIds = [];
        this._queuedIds = [];
        this._livePackageObserver = new Subject();
        this._subscribeRequested = new Subject();
        this._handleSubscriptionQueue();
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            const httpConfig = yield getAsyncValueAsPromise(this.httpConfig);
            return this.connectWithUrl(`${httpConfig.Services.BaseUri}${httpConfig.Services.Live}/hub`);
        });
    }
    connectWithUrl(hubUrl) {
        if (!this.hubConnection) {
            this.hubConnection = this._buildHubConnection(hubUrl);
            this._establishConnectionAndHandleEvents(this.hubConnection);
        }
        return firstValueFrom(this._connectionEstablished.pipe(filter((x) => x), mapTo(null)));
    }
    dispose() {
        var _a;
        (_a = this.hubConnection) === null || _a === void 0 ? void 0 : _a.stop();
        this.hubConnection = null;
        this._unsub.next();
        this._unsub.complete();
    }
    subscribeToSignalValues(signalIds) {
        const prefixedIds = signalIds.map((x) => `S:${x}`);
        return this.subscribeLiveValuePackages(prefixedIds);
    }
    subscribeToSignalOffsets(signalIds) {
        const prefixedIds = signalIds.map((x) => `SO:${x}`);
        return this.subscribeLiveValuePackages(prefixedIds);
    }
    subscribeToTimestamp(ids) {
        return this.subscribeLiveValuePackages(ids);
    }
    subscribeLiveValuePackages(packageIds) {
        const notSubscribedIds = packageIds.filter((id) => !this._subscribedIds.includes(id));
        if (this.hubConnection && notSubscribedIds.length > 0) {
            this._enqueueIdsToSubscribe(notSubscribedIds);
        }
        const cachedPackages = this._getCachedValuePackages(packageIds);
        const livePackages$ = this._livePackageObserver.pipe(map((values) => values.filter((liveValue) => packageIds.includes(liveValue.identifier))), filter((values) => values.length > 0));
        if (cachedPackages.length > 0) {
            return concat(of(cachedPackages), livePackages$);
        }
        return livePackages$;
    }
    _enqueueIdsToSubscribe(ids) {
        const newIds = ids.filter((id) => !this._queuedIds.includes(id));
        if (newIds.length > 0) {
            this._queuedIds.push(...newIds);
            this._subscribeRequested.next(null);
        }
    }
    _handleSubscriptionQueue() {
        this._subscribeRequested.pipe(takeUntil(this._unsub), auditTime(50)).subscribe(() => {
            const queuedIds = this._queuedIds;
            this._queuedIds = [];
            this._sendMessage(LiveHubMethod.SubscribeMany, queuedIds);
            this._subscribedIds.push(...queuedIds);
        });
    }
    _getCachedValuePackages(packageIds) {
        return packageIds.map((id) => this._valueCache[id]).filter((value) => value !== undefined);
    }
    _sendMessage(method, ...args) {
        if (this.hubConnection) {
            this.hubConnection.send(method, ...args);
        }
    }
    _handleHubMessage(message) {
        if (Array.isArray(message)) {
            message.forEach((value) => {
                this._valueCache[value.identifier] = value;
            });
            this._livePackageObserver.next(message);
        }
        else {
            console.info('Unknown message: ', message);
        }
    }
    _establishConnectionAndHandleEvents(connection) {
        connection
            .start()
            .then(() => {
            this._sendMessage(LiveHubMethod.ChangeModeAsync, true);
            this._sendMessage(LiveHubMethod.ChangeIntervalAsync, 500);
            this.hubConnection.on('Send', (message) => this._handleHubMessage(message));
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
    _buildHubConnection(hubUrl) {
        return new signalR.HubConnectionBuilder()
            .withUrl(hubUrl, {
            accessTokenFactory: () => this.getAccessToken(),
        })
            .build();
    }
    getAccessToken() {
        return getAsyncValueAsPromise(this.accessToken);
    }
}
