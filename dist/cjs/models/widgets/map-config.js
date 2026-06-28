"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventBadge = exports.SignalBadge = exports.Badge = exports.MapGroup = exports.MapMarkerConfig = exports.PopupSignalConfig = exports.MapRequestTypes = exports.LiveRequestType = exports.MapConfig = exports.LeafletLatLng = exports.MapConfigVersion = void 0;
const shared_js_1 = require("./shared.js");
const historical_value_model_js_1 = require("../historical-value.model.js");
exports.MapConfigVersion = '8';
class LeafletLatLng {
    constructor(lat = 0, lng = 0) {
        this.lng = lng;
        this.lat = lat;
    }
}
exports.LeafletLatLng = LeafletLatLng;
class MapConfig extends shared_js_1.BaseWidgetConfig {
    constructor() {
        super();
        this.Marker = [];
        this.mapGroups = [];
        this.version = exports.MapConfigVersion;
        this.headerExpanded = false;
        this.autoZoom = true;
        this.defaultZoom = 20;
    }
}
exports.MapConfig = MapConfig;
var LiveRequestType;
(function (LiveRequestType) {
    LiveRequestType["Live"] = "Live";
})(LiveRequestType || (exports.LiveRequestType = LiveRequestType = {}));
exports.MapRequestTypes = Object.assign(Object.assign({}, LiveRequestType), historical_value_model_js_1.CompressionInterval);
class PopupSignalConfig {
    constructor() {
        this.intervalType = LiveRequestType.Live;
    }
}
exports.PopupSignalConfig = PopupSignalConfig;
class MapMarkerConfig {
}
exports.MapMarkerConfig = MapMarkerConfig;
class MapGroup {
}
exports.MapGroup = MapGroup;
class Badge {
    constructor() { }
}
exports.Badge = Badge;
class SignalBadge extends Badge {
}
exports.SignalBadge = SignalBadge;
class EventBadge extends Badge {
    constructor() {
        super();
        this.filterId = null;
        this.eventFilter = 'Group';
    }
    static isEventBadge(badge) {
        return badge.eventFilter !== undefined;
    }
}
exports.EventBadge = EventBadge;
