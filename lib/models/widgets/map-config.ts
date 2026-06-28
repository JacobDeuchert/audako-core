import { BaseWidgetConfig } from './shared.js';
import { CompressionInterval } from '../historical-value.model.js';

export const MapConfigVersion = '8';

export class LeafletLatLng {
  lat: number;
  lng: number;

  constructor(lat: number = 0, lng: number = 0) {
    this.lng = lng;
    this.lat = lat;
  }
}

export class MapConfig extends BaseWidgetConfig {
  Marker: MapMarkerConfig[];
  mapGroups: MapGroup[];
  autoZoom: boolean;
  defaultZoom: number;

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

export enum LiveRequestType {
  'Live' = 'Live',
}

export const MapRequestTypes = {
  ...LiveRequestType,
  ...CompressionInterval,
};

export class PopupSignalConfig {
  signalId: string;
  intervalType: LiveRequestType | CompressionInterval;

  constructor() {
    this.intervalType = LiveRequestType.Live;
  }
}

export class MapMarkerConfig {
  Coordinates: LeafletLatLng;
  DashboardUri: string;
  Icon: string;
  ShapeClass: string;
}

export class MapGroup {
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

export class Badge {
  disabled: boolean;

  constructor() {}
}

export class SignalBadge extends Badge {
  signalId: string;
}

export class EventBadge extends Badge {
  eventFilter: 'Group' | 'Category' | 'Event';
  filterId: string | string[];

  constructor() {
    super();
    this.filterId = null;
    this.eventFilter = 'Group';
  }

  static isEventBadge(badge: Badge): badge is EventBadge {
    return (badge as EventBadge).eventFilter !== undefined;
  }
}
