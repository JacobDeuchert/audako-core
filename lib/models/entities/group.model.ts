import { ConfigurationEntity } from './configuration-entity.model.js';

export class Group extends ConfigurationEntity {
  public IsEntryPoint: boolean;
  public Type: string;
}
