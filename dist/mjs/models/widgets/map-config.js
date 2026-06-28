import { BaseWidgetConfig } from './shared.js';
import { CompressionInterval } from '../historical-value.model.js';
export const MapConfigVersion = '8';
export class LeafletLatLng {
    constructor(lat = 0, lng = 0) {
        this.lng = lng;
        this.lat = lat;
    }
}
export class MapConfig extends BaseWidgetConfig {
    constructor() {
        super();
        this.Marker = [];
        this.mapGroups = [];
        this.version = MapConfigVersion;
        this.headerExpanded = false;
        this.autoZoom = true;
        this.defaultZoom = 20;
    }
}
export var LiveRequestType;
(function (LiveRequestType) {
    LiveRequestType["Live"] = "Live";
})(LiveRequestType || (LiveRequestType = {}));
export const MapRequestTypes = Object.assign(Object.assign({}, LiveRequestType), CompressionInterval);
export class PopupSignalConfig {
    constructor() {
        this.intervalType = LiveRequestType.Live;
    }
}
export class MapMarkerConfig {
}
export class MapGroup {
}
export class Badge {
    constructor() { }
}
export class SignalBadge extends Badge {
}
export class EventBadge extends Badge {
    constructor() {
        super();
        this.filterId = null;
        this.eventFilter = 'Group';
    }
    static isEventBadge(badge) {
        return badge.eventFilter !== undefined;
    }
}
