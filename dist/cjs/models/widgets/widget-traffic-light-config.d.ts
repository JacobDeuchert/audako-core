import { BaseWidgetConfig } from './shared.js';
export declare enum TrafficLights {
    Red = "Red",
    Yellow = "Yellow",
    Green = "Green",
    Off = "Off"
}
export declare class WidgetTrafficLightConfig extends BaseWidgetConfig {
    mode: TrafficLightModes;
    settings: TrafficLightSetting[];
    housingColor: string;
    constructor();
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
export declare enum TrafficLightModes {
    TrafficLight = "TrafficLight",
    PedestrianLight = "PedestrianLight",
    SignalLight = "SignalLight"
}
export declare const TrafficLightModeTranslations: {
    [key: string]: string;
};
export declare const TrafficLightColorTranslations: {
    [key: string]: string;
};
