import { ConfigurationEntity, Field } from './configuration-entity.model.js';

export enum UserRegistrationStates {
  None = 'None',
  Pending = 'Pending',
  Failed = 'Failed',
  Denied = 'Denied',
  Successful = 'Successful',
}

export class User extends ConfigurationEntity {
  public UserId: Field<string>;
  public FirstName: Field<string>;
  public LastName: Field<string>;
  public Email: Field<string>;
  public RegistrationState: Field<UserRegistrationStates>;
  public RegistrationDate: Field<Date>;
  public RegistrationCredentials: Field<[string, string]>;
  public RegistrationToken: string;

  constructor() {
    super();
    this.FirstName = new Field<string>();
    this.LastName = new Field<string>();
    this.UserId = new Field<string>();
    this.Email = new Field<string>();
    this.RegistrationState = new Field<UserRegistrationStates>(UserRegistrationStates.None);
    this.RegistrationCredentials = new Field<[string, string]>();
    this.RegistrationDate = new Field<Date>();
  }
}
