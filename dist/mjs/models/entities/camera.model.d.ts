import { ConfigurationEntity, Field } from './configuration-entity.model.js';
export declare enum CameraViewMode {
    LiveFirst = "LiveFirst",
    ArchiveFirst = "ArchiveFirst",
    ArchiveOnly = "ArchiveOnly"
}
export declare class Camera extends ConfigurationEntity {
    Address: Field<string>;
    Username: Field<string>;
    Password: Field<string>;
    MaxViewInterval: Field<number>;
    ViewMode: Field<CameraViewMode>;
    EventIds: Field<string[]>;
    constructor();
}
export declare enum CameraImageType {
    Scheduled = "Scheduled",
    Manual = "Manual",
    Event = "Event"
}
export declare class CameraImage {
    Id: string;
    CameraId: string;
    ImageFile: string;
    IncomingOn: Date;
    ReceiptedOn: Date;
    ReceiptedBy: string;
    ReceiptedByAlias: string;
    Note: string;
    TakenBy: string;
    Type: CameraImageType;
}
