"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationEntity = exports.Field = exports.EntityHttpEndpoints = exports.EntityIcons = exports.EntityType = void 0;
var EntityType;
(function (EntityType) {
    EntityType["Group"] = "Group";
    EntityType["Signal"] = "Signal";
    EntityType["Formula"] = "Formula";
    EntityType["Dashboard"] = "Dashboard";
    EntityType["DashboardTab"] = "DashboardTab";
    EntityType["DataConnection"] = "DataConnection";
    EntityType["DataSource"] = "DataSource";
    EntityType["EventCondition"] = "EventCondition";
    EntityType["EventDefinition"] = "EventDefinition";
    EntityType["EventCategory"] = "EventCategory";
    EntityType["ProcessImage"] = "ProcessImage";
})(EntityType = exports.EntityType || (exports.EntityType = {}));
exports.EntityIcons = {
    [EntityType.Group]: 'fas fa-folder',
    [EntityType.Dashboard]: 'adk adk-dashboard',
    [EntityType.Signal]: 'fas fa-code',
    [EntityType.DataConnection]: 'fas fa-circle-notch',
    [EntityType.DataSource]: 'fas fa-server',
};
exports.EntityHttpEndpoints = {
    Group: '/base/Group',
    Signal: '/daq/Signal',
    Formula: '/daq/Formula',
    Dashboard: '/base/Dashboard',
    DashboardTab: '/base/DashboardTab',
    DataConnection: '/daq/DataConnection',
    DataSource: '/daq/DataSource',
    EventCondition: '/base/condition',
    ProcessImage: '/scada/ProcessImage',
    EventCategory: '/base/EventCategory',
    EventDefinition: '/base/EventDefinition',
};
class Field {
    constructor(value = null, ooAttributes = []) {
        this.Value = value;
        this.OOAttributes = ooAttributes;
    }
    static isField(value) {
        return value && value.Value !== undefined;
    }
}
exports.Field = Field;
class ConfigurationEntity {
    constructor(options) {
        this.Name = new Field();
        this.Description = new Field();
        this.AdditionalFields = {};
        this.Id = null;
        this.Path = [];
        this.GroupId = null;
        this.CreatedBy = null;
        this.CreatedOn = new Date();
        this.ChangedBy = null;
        this.ChangedOn = null;
        this.IsInstanceOf = null;
        this.IsTemplate = false;
        Object.assign(this, options);
    }
}
exports.ConfigurationEntity = ConfigurationEntity;
