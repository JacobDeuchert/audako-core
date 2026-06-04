import { ConfigurationEntity, Field } from './configuration-entity.model.js';

export enum CameraViewMode {
  LiveFirst = 'LiveFirst',
  ArchiveFirst = 'ArchiveFirst',
  ArchiveOnly = 'ArchiveOnly',
}

export class Camera extends ConfigurationEntity {
  public Address: Field<string>;
  public Username: Field<string>;
  public Password: Field<string>;
  public MaxViewInterval: Field<number>;
  public ViewMode: Field<CameraViewMode>;
  public EventIds: Field<string[]>;

  constructor() {
    super();
    this.Address = new Field<string>();
    this.Username = new Field<string>();
    this.Password = new Field<string>();
    this.MaxViewInterval = new Field<number>(10000);
    this.ViewMode = new Field<CameraViewMode>();
    this.EventIds = new Field<string[]>();
  }
}

export enum CameraImageType {
  Scheduled = 'Scheduled',
  Manual = 'Manual',
  Event = 'Event',
}

export class CameraImage {
  public Id: string;
  public CameraId: string;
  public ImageFile: string;
  public IncomingOn: Date;
  public ReceiptedOn: Date;
  public ReceiptedBy: string;
  public ReceiptedByAlias: string;
  public Note: string;
  public TakenBy: string;
  public Type: CameraImageType;
}
