import { ConfigurationEntity, Field } from './configuration-entity.model.js';

export enum DataSourceType {
  EdgeGateway = 'EdgeGateway',
  DataAdapter = 'DataAdapter',
  SmartDevice = 'SmartDevice',
}

export class DataSource extends ConfigurationEntity {
  public Address: Field<string>;
  public Password: Field<string>;
  public Type: Field<DataSourceType>;
  public PermaLiveModeSettings: PermaLiveModeSettings;
  public Settings: { [key: string]: Field<string> };

  constructor() {
    super();

    this.Address = new Field<string>(null);
    this.Password = new Field<string>(null);
    this.Type = new Field<DataSourceType>(DataSourceType.EdgeGateway);
    this.PermaLiveModeSettings = new PermaLiveModeSettings();
    this.Settings = {};
  }
}

export class PermaLiveModeSettings {
  public Enabled: Field<boolean>;
  public BlockingTime: Field<number>;

  constructor() {
    this.Enabled = new Field<boolean>(false);
    this.BlockingTime = new Field<number>(10);
  }
}
