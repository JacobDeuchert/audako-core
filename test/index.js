"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var audako_core_1 = require("audako-core");
var group = new audako_core_1.Group();
audako_core_1.EntityUtils.setPropertyValue(group, 'AdditionalFields.Order', 8, false, false);
console.log(JSON.stringify(group.AdditionalFields));
// EntityUtils.setPropertyValue(signal, 'Name', 'abc');
