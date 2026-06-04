import { ConfigurationEntity, Field } from './configuration-entity.model.js';
export declare enum UserRegistrationStates {
    None = "None",
    Pending = "Pending",
    Failed = "Failed",
    Denied = "Denied",
    Successful = "Successful"
}
export declare class User extends ConfigurationEntity {
    UserId: Field<string>;
    FirstName: Field<string>;
    LastName: Field<string>;
    Email: Field<string>;
    RegistrationState: Field<UserRegistrationStates>;
    RegistrationDate: Field<Date>;
    RegistrationCredentials: Field<[string, string]>;
    RegistrationToken: string;
    constructor();
}
