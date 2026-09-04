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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveValueService = exports.SubscriptionPrefix = exports.LiveHubEvent = exports.clampLiveInterval = exports.MIN_LIVE_INTERVAL_MS_V5 = exports.DEFAULT_LIVE_INTERVAL_MS = exports.LiveHubMethod = exports.OperationStatus = void 0;
const rxjs_1 = require("rxjs");
const signalR = __importStar(require("@microsoft/signalr"));
var OperationStatus;
(function (OperationStatus) {
    OperationStatus["Running"] = "Running";
    OperationStatus["Success"] = "Success";
    OperationStatus["Failed"] = "Failed";
})(OperationStatus || (exports.OperationStatus = OperationStatus = {}));
var LiveHubMethod;
(function (LiveHubMethod) {
    LiveHubMethod["ChangeModeAsync"] = "ChangeModeAsync";
    LiveHubMethod["ChangeIntervalAsync"] = "ChangeIntervalAsync";
    LiveHubMethod["SubscribeMany"] = "SubscribeMany";
})(LiveHubMethod || (exports.LiveHubMethod = LiveHubMethod = {}));
/** Interval the service asks the hub for after connecting. */
exports.DEFAULT_LIVE_INTERVAL_MS = 500;
/**
 * Smallest interval v5 honours: `ChangeIntervalAsync` is clamped to 250 ms server-side, so
 * anything below is silently raised. v4 had no lower bound, so values are passed through there.
 */
exports.MIN_LIVE_INTERVAL_MS_V5 = 250;
/** Clamps a requested live interval to what the target version accepts. */
function clampLiveInterval(intervalMs, versionInfo) {
    if (versionInfo === null || versionInfo === void 0 ? void 0 : versionInfo.isV5) {
        return Math.max(intervalMs, exports.MIN_LIVE_INTERVAL_MS_V5);
    }
    return intervalMs;
}
exports.clampLiveInterval = clampLiveInterval;
var LiveHubEvent;
(function (LiveHubEvent) {
    LiveHubEvent["Send"] = "Send";
})(LiveHubEvent || (exports.LiveHubEvent = LiveHubEvent = {}));
var SubscriptionPrefix;
(function (SubscriptionPrefix) {
    SubscriptionPrefix["S"] = "S";
    SubscriptionPrefix["SO"] = "SO";
    SubscriptionPrefix["T"] = "T";
    SubscriptionPrefix["TC"] = "TC";
    SubscriptionPrefix["OP"] = "OP";
})(SubscriptionPrefix || (exports.SubscriptionPrefix = SubscriptionPrefix = {}));
class LiveValueService {
    /**
     * @param ctx Context of the target system.
     */
    constructor(ctx) {
        this.ctx = ctx;
        this._unsub = new rxjs_1.Subject();
        this._connectionEstablished = new rxjs_1.BehaviorSubject(false);
        this._valueCache = {};
        this._subscribedIds = [];
        this._queuedIds = [];
        this._livePackageObserver = new rxjs_1.Subject();
        this._subscribeRequested = new rxjs_1.Subject();
        this._handleSubscriptionQueue();
    }
    /**
     * URL of the live hub for the detected platform version: `{live}/hub` on v4, `{live}/values`
     * on v5. `Services.Live` still carries no `/v1` in the v5 config, so the service path is
     * always read from the config (docs/analysis/v4-to-v5-endpoints.md section 5).
     */
    getHubUrl() {
        return __awaiter(this, void 0, void 0, function* () {
            const endpoint = yield this.ctx.resolve({ name: 'liveHub' });
            return endpoint.url;
        });
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            this._versionInfo = yield this.ctx.getVersionInfo();
            return this.connectWithUrl(yield this.getHubUrl());
        });
    }
    /**
     * Asks the hub for a different update interval. On v5 the value is clamped to
     * {@link MIN_LIVE_INTERVAL_MS_V5}, which the server enforces anyway.
     */
    changeInterval(intervalMs) {
        this._sendMessage(LiveHubMethod.ChangeIntervalAsync, clampLiveInterval(intervalMs, this._versionInfo));
    }
    connectWithUrl(hubUrl) {
        if (!this.hubConnection) {
            this.hubConnection = this._buildHubConnection(hubUrl);
            this._establishConnectionAndHandleEvents(this.hubConnection);
        }
        return (0, rxjs_1.firstValueFrom)(this._connectionEstablished.pipe((0, rxjs_1.filter)((x) => x), (0, rxjs_1.mapTo)(null)));
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
    subscribeToOperations(operationIds) {
        const prefixedIds = operationIds.map((x) => `${SubscriptionPrefix.OP}:${x}`);
        return this.subscribeLiveValuePackages(prefixedIds);
    }
    getOperationStatus(operationId) {
        const prefixedId = `${SubscriptionPrefix.OP}:${operationId}`;
        return this.subscribeToOperations([operationId]).pipe((0, rxjs_1.map)((messages) => messages.find((x) => x.id === operationId)), (0, rxjs_1.filter)((m) => m != null), (0, rxjs_1.takeWhile)((m) => m.status !== OperationStatus.Success && m.status !== OperationStatus.Failed, true), (0, rxjs_1.finalize)(() => this._unsubscribeIds([prefixedId])));
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
    _unsubscribeIds(ids) {
        this._subscribedIds = this._subscribedIds.filter((id) => !ids.includes(id));
        ids.forEach((id) => delete this._valueCache[id]);
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
            this._sendMessage(LiveHubMethod.ChangeIntervalAsync, clampLiveInterval(exports.DEFAULT_LIVE_INTERVAL_MS, this._versionInfo));
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
        return this.ctx.getAccessToken();
    }
}
exports.LiveValueService = LiveValueService;
