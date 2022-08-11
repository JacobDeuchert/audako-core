"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveValueService = exports.SubscriptionPrefix = exports.LiveHubEvent = exports.LiveHubMethod = void 0;
const rxjs_1 = require("rxjs");
const signalR = __importStar(require("@microsoft/signalr"));
var LiveHubMethod;
(function (LiveHubMethod) {
    LiveHubMethod["ChangeModeAsync"] = "ChangeModeAsync";
    LiveHubMethod["ChangeIntervalAsync"] = "ChangeIntervalAsync";
    LiveHubMethod["SubscribeMany"] = "SubscribeMany";
})(LiveHubMethod = exports.LiveHubMethod || (exports.LiveHubMethod = {}));
var LiveHubEvent;
(function (LiveHubEvent) {
    LiveHubEvent["Send"] = "Send";
})(LiveHubEvent = exports.LiveHubEvent || (exports.LiveHubEvent = {}));
var SubscriptionPrefix;
(function (SubscriptionPrefix) {
    SubscriptionPrefix["S"] = "S";
    SubscriptionPrefix["SO"] = "SO";
    SubscriptionPrefix["T"] = "T";
    SubscriptionPrefix["TC"] = "TC";
})(SubscriptionPrefix = exports.SubscriptionPrefix || (exports.SubscriptionPrefix = {}));
class LiveValueService {
    constructor(httpConfig, accessToken) {
        this.httpConfig = httpConfig;
        this.accessToken = accessToken;
        this._unsub = new rxjs_1.Subject();
        this._connectionEstablished = new rxjs_1.BehaviorSubject(false);
        this._valueCache = {};
        this._subscribedIds = [];
        this._queuedIds = [];
        this._livePackageObserver = new rxjs_1.Subject();
        this._subscribeRequested = new rxjs_1.Subject();
        this._handleSubscriptionQueue();
    }
    connect() {
        return this.connectWithUrl(`${this.httpConfig.Services.BaseUri}${this.httpConfig.Services.Live}/hub`);
    }
    connectWithUrl(hubUrl) {
        if (!this.hubConnection) {
            this.hubConnection = this._buildHubConnection(hubUrl);
            this._establishConnectionAndHandleEvents(this.hubConnection);
        }
        return this._connectionEstablished.pipe((0, rxjs_1.filter)((x) => x), (0, rxjs_1.mapTo)(null));
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
        const livePackages$ = this._livePackageObserver.pipe((0, rxjs_1.map)((values) => values.filter((liveValue) => packageIds.includes(liveValue.identifier))), (0, rxjs_1.filter)((values) => values.length > 0));
        if (cachedPackages.length > 0) {
            return (0, rxjs_1.concat)((0, rxjs_1.of)(cachedPackages), livePackages$);
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
        this._subscribeRequested.pipe((0, rxjs_1.takeUntil)(this._unsub), (0, rxjs_1.auditTime)(50)).subscribe(() => {
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
        return new signalR.HubConnectionBuilder().withUrl(hubUrl, {
            accessTokenFactory: () => (0, rxjs_1.isObservable)(this.accessToken) ? (0, rxjs_1.firstValueFrom)(this.accessToken) : this.accessToken,
        }).build();
    }
}
exports.LiveValueService = LiveValueService;
