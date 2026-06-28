import { BaseWidgetConfig } from './shared.js';

export enum TrafficLights {
  Red = 'Red',
  Yellow = 'Yellow',
  Green = 'Green',
  Off = 'Off',
}

export class WidgetTrafficLightConfig extends BaseWidgetConfig {
  mode: TrafficLightModes;
  settings: TrafficLightSetting[];
  housingColor: string;

  constructor() {
    super();

    this.version = '1';
    this.title = '';
    this.headerExpanded = false;
    this.mode = TrafficLightModes.TrafficLight;
    this.settings = [];
    this.housingColor = null;
  }
}

export interface TrafficLightSetting {
  light: TrafficLightSettingMode;
  conditionId: string;
  conditionType: 'EventCondition' | 'EventDefinition';
}

export interface TrafficLightSettingMode {
  color: TrafficLights;
  blink: boolean;
}

export enum TrafficLightModes {
  TrafficLight = 'TrafficLight',
  PedestrianLight = 'PedestrianLight',
  SignalLight = 'SignalLight',
}

export const TrafficLightModeTranslations: { [key: string]: string } = {
  [TrafficLightModes.TrafficLight]: 'TRAFFIC_LIGHT',
  [TrafficLightModes.PedestrianLight]: 'PEDESTRIAN_LIGHT',
  [TrafficLightModes.SignalLight]: 'SIGNAL_LIGHT',
};

export const TrafficLightColorTranslations: { [key: string]: string } = {
  [TrafficLights.Red]: 'RED',
  [TrafficLights.Yellow]: 'YELLOW',
  [TrafficLights.Green]: 'GREEN',
  [TrafficLights.Off]: 'OFF',
};
