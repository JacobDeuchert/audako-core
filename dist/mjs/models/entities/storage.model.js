import { ConfigurationEntity } from './configuration-entity.model.js';
export class Storage extends ConfigurationEntity {
    constructor() {
        super();
        this.FileEntries = {};
        this.PrimitvEntries = {};
    }
}
export class StorageEntry {
}
export class FileEntry {
}
