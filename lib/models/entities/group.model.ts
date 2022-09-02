import { ConfigurationEntity } from './configuration-entity.model.js';

export class Group extends ConfigurationEntity {

  constructor() {
    super();
  }
  public IsEntryPoint: boolean;
  public Type: string;
}
