"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var audako_core_1 = require("audako-core");
var entity = new audako_core_1.ConfigurationEntity();
entity.Name = new audako_core_1.Field('test');
audako_core_1.BaseHttpService.requestHttpConfig('https://water.audako.net').then(function (config) {
    console.log(config);
});
