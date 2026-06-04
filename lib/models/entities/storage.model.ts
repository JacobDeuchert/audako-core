import { ConfigurationEntity } from './configuration-entity.model.js';

export class Storage extends ConfigurationEntity {
  public EntityId: string;
  public FileEntries: { [key: string]: StorageEntry<FileEntry> };
  public PrimitvEntries: { [key: string]: StorageEntry<string> };

  constructor() {
    super();
    this.FileEntries = {};
    this.PrimitvEntries = {};
  }
}

export class StorageEntry<T> {
  public AccessId: string;
  public Entry: T;
}

export class FileEntry {
  public Id: string;
  public Name: string;
  public FileEnding: string;
  public UploadDate: Date;
  public Length: number;
  public MetaData: { [key: string]: string };
}
