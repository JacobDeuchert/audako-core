import { ConfigurationEntity, Field } from './configuration-entity.model.js';
export var CameraViewMode;
(function (CameraViewMode) {
    CameraViewMode["LiveFirst"] = "LiveFirst";
    CameraViewMode["ArchiveFirst"] = "ArchiveFirst";
    CameraViewMode["ArchiveOnly"] = "ArchiveOnly";
})(CameraViewMode || (CameraViewMode = {}));
export class Camera extends ConfigurationEntity {
    constructor() {
        super();
        this.Address = new Field();
        this.Username = new Field();
        this.Password = new Field();
        this.MaxViewInterval = new Field(10000);
        this.ViewMode = new Field();
        this.EventIds = new Field();
    }
}
export var CameraImageType;
(function (CameraImageType) {
    CameraImageType["Scheduled"] = "Scheduled";
    CameraImageType["Manual"] = "Manual";
    CameraImageType["Event"] = "Event";
})(CameraImageType || (CameraImageType = {}));
export class CameraImage {
}
