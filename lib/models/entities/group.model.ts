import { ConfigurationEntity } from './configuration-entity.model';

export class Group extends ConfigurationEntity {
  public IsEntryPoint: boolean;
  public Type: string;
}
