"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var audako_core_1 = require("audako-core");
var signal = new audako_core_1.Signal();
var signalProperties = audako_core_1.EntityUtils.getEntityPropertiesByType(audako_core_1.EntityType.Signal, true);
console.log(JSON.stringify(signalProperties));
// EntityUtils.setPropertyValue(signal, 'Name', 'abc');
