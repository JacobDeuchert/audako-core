"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileEntry = exports.StorageEntry = exports.Storage = void 0;
const configuration_entity_model_js_1 = require("./configuration-entity.model.js");
class Storage extends configuration_entity_model_js_1.ConfigurationEntity {
    constructor() {
        super();
        this.FileEntries = {};
        this.PrimitvEntries = {};
    }
}
exports.Storage = Storage;
class StorageEntry {
}
exports.StorageEntry = StorageEntry;
class FileEntry {
}
exports.FileEntry = FileEntry;
