"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CameraImage = exports.CameraImageType = exports.Camera = exports.CameraViewMode = void 0;
const configuration_entity_model_js_1 = require("./configuration-entity.model.js");
var CameraViewMode;
(function (CameraViewMode) {
    CameraViewMode["LiveFirst"] = "LiveFirst";
    CameraViewMode["ArchiveFirst"] = "ArchiveFirst";
    CameraViewMode["ArchiveOnly"] = "ArchiveOnly";
})(CameraViewMode || (exports.CameraViewMode = CameraViewMode = {}));
class Camera extends configuration_entity_model_js_1.ConfigurationEntity {
    constructor() {
        super();
        this.Address = new configuration_entity_model_js_1.Field();
        this.Username = new configuration_entity_model_js_1.Field();
        this.Password = new configuration_entity_model_js_1.Field();
        this.MaxViewInterval = new configuration_entity_model_js_1.Field(10000);
        this.ViewMode = new configuration_entity_model_js_1.Field();
        this.EventIds = new configuration_entity_model_js_1.Field();
    }
}
exports.Camera = Camera;
var CameraImageType;
(function (CameraImageType) {
    CameraImageType["Scheduled"] = "Scheduled";
    CameraImageType["Manual"] = "Manual";
    CameraImageType["Event"] = "Event";
})(CameraImageType || (exports.CameraImageType = CameraImageType = {}));
class CameraImage {
}
exports.CameraImage = CameraImage;
