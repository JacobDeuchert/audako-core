"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrafficLightColorTranslations = exports.TrafficLightModeTranslations = exports.TrafficLightModes = exports.WidgetTrafficLightConfig = exports.TrafficLights = void 0;
const shared_js_1 = require("./shared.js");
var TrafficLights;
(function (TrafficLights) {
    TrafficLights["Red"] = "Red";
    TrafficLights["Yellow"] = "Yellow";
    TrafficLights["Green"] = "Green";
    TrafficLights["Off"] = "Off";
})(TrafficLights || (exports.TrafficLights = TrafficLights = {}));
class WidgetTrafficLightConfig extends shared_js_1.BaseWidgetConfig {
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
exports.WidgetTrafficLightConfig = WidgetTrafficLightConfig;
var TrafficLightModes;
(function (TrafficLightModes) {
    TrafficLightModes["TrafficLight"] = "TrafficLight";
    TrafficLightModes["PedestrianLight"] = "PedestrianLight";
    TrafficLightModes["SignalLight"] = "SignalLight";
})(TrafficLightModes || (exports.TrafficLightModes = TrafficLightModes = {}));
exports.TrafficLightModeTranslations = {
    [TrafficLightModes.TrafficLight]: 'TRAFFIC_LIGHT',
    [TrafficLightModes.PedestrianLight]: 'PEDESTRIAN_LIGHT',
    [TrafficLightModes.SignalLight]: 'SIGNAL_LIGHT',
};
exports.TrafficLightColorTranslations = {
    [TrafficLights.Red]: 'RED',
    [TrafficLights.Yellow]: 'YELLOW',
    [TrafficLights.Green]: 'GREEN',
    [TrafficLights.Off]: 'OFF',
};
