import { BaseWidgetConfig } from './shared.js';
import { CompressionInterval } from '../historical-value.model.js';
export declare const MapConfigVersion = "8";
export declare class LeafletLatLng {
    lat: number;
    lng: number;
    constructor(lat?: number, lng?: number);
}
export declare class MapConfig extends BaseWidgetConfig {
    Marker: MapMarkerConfig[];
    mapGroups: MapGroup[];
    autoZoom: boolean;
    defaultZoom: number;
    constructor();
}
export declare enum LiveRequestType {
    'Live' = "Live"
}
export declare const MapRequestTypes: {
    ProcessInterval: CompressionInterval.ProcessInterval;
    SubInterval: CompressionInterval.SubInterval;
    HourInterval: CompressionInterval.HourInterval;
    TwoHourInterval: CompressionInterval.TwoHourInterval;
    DayInterval: CompressionInterval.DayInterval;
    WeekInterval: CompressionInterval.WeekInterval;
    MonthInterval: CompressionInterval.MonthInterval;
    QuarterInterval: CompressionInterval.QuarterInterval;
    YearInterval: CompressionInterval.YearInterval;
    Live: LiveRequestType.Live;
};
export declare class PopupSignalConfig {
    signalId: string;
    intervalType: LiveRequestType | CompressionInterval;
    constructor();
}
export declare class MapMarkerConfig {
    Coordinates: LeafletLatLng;
    DashboardUri: string;
    Icon: string;
    ShapeClass: string;
}
export declare class MapGroup {
    groupId: string;
    name: string;
    displayImg: boolean;
    displayInfo: boolean;
    popupSignals: PopupSignalConfig[];
    dashboardId: string;
    badge: Badge;
    custom: boolean;
    position: LeafletLatLng;
    icon: string;
    dynamicPosition?: boolean;
    PositionMonitoring?: boolean;
    PositionMonitoringId?: string;
    dynamicLatSignal?: string;
    dynamicLongSignal?: string;
}
export declare class Badge {
    disabled: boolean;
    constructor();
}
export declare class SignalBadge extends Badge {
    signalId: string;
}
export declare class EventBadge extends Badge {
    eventFilter: 'Group' | 'Category' | 'Event';
    filterId: string | string[];
    constructor();
    static isEventBadge(badge: Badge): badge is EventBadge;
}
