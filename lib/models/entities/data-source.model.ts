import { ConfigurationEntity, Field } from './configuration-entity.model.js';

export enum DataSourceType {
  EdgeGateway = 'EdgeGateway',
  DataAdapter = 'DataAdapter',
}

export class DataSource extends ConfigurationEntity {
  public Address: Field<string>;
  public Password: Field<string>;
  public Type: Field<DataSourceType>;
}
