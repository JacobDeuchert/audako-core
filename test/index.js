"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var audako_core_1 = require("audako-core");
var signal = new audako_core_1.Signal();
var signalProperties = audako_core_1.EntityUtils.getEntityPropertiesByType(audako_core_1.EntityType.Signal, true);
console.log(signal.RecordingSettings);
audako_core_1.EntityUtils.setPropertyValue(signal, 'RecordingSettings.Interval.Value', 400);
console.log(signal.RecordingSettings);
