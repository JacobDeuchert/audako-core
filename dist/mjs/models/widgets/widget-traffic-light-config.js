import { BaseWidgetConfig } from './shared.js';
export var TrafficLights;
(function (TrafficLights) {
    TrafficLights["Red"] = "Red";
    TrafficLights["Yellow"] = "Yellow";
    TrafficLights["Green"] = "Green";
    TrafficLights["Off"] = "Off";
})(TrafficLights || (TrafficLights = {}));
export class WidgetTrafficLightConfig extends BaseWidgetConfig {
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
export var TrafficLightModes;
(function (TrafficLightModes) {
    TrafficLightModes["TrafficLight"] = "TrafficLight";
    TrafficLightModes["PedestrianLight"] = "PedestrianLight";
    TrafficLightModes["SignalLight"] = "SignalLight";
})(TrafficLightModes || (TrafficLightModes = {}));
export const TrafficLightModeTranslations = {
    [TrafficLightModes.TrafficLight]: 'TRAFFIC_LIGHT',
    [TrafficLightModes.PedestrianLight]: 'PEDESTRIAN_LIGHT',
    [TrafficLightModes.SignalLight]: 'SIGNAL_LIGHT',
};
export const TrafficLightColorTranslations = {
    [TrafficLights.Red]: 'RED',
    [TrafficLights.Yellow]: 'YELLOW',
    [TrafficLights.Green]: 'GREEN',
    [TrafficLights.Off]: 'OFF',
};
