import { ConfigurationEntity } from './configuration-entity.model.js';
export declare class Storage extends ConfigurationEntity {
    EntityId: string;
    FileEntries: {
        [key: string]: StorageEntry<FileEntry>;
    };
    PrimitvEntries: {
        [key: string]: StorageEntry<string>;
    };
    constructor();
}
export declare class StorageEntry<T> {
    AccessId: string;
    Entry: T;
}
export declare class FileEntry {
    Id: string;
    Name: string;
    FileEnding: string;
    UploadDate: Date;
    Length: number;
    MetaData: {
        [key: string]: string;
    };
}
