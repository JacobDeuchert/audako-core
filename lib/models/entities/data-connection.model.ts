import { ConfigurationEntity, Field } from './configuration-entity.model';

export enum DataSourceType {
  S7 = 'S7',
  ModBus = 'ModBus',
}

export class DataConnection extends ConfigurationEntity {
  public DataSourceId: Field<string>;
  public Type: Field<DataSourceType>;
  public Settings: DataConnectionSettings;
}

export class DataConnectionSettings {
  public _t: string;
}
