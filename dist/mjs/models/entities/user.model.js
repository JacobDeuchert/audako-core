import { ConfigurationEntity, Field } from './configuration-entity.model.js';
export var UserRegistrationStates;
(function (UserRegistrationStates) {
    UserRegistrationStates["None"] = "None";
    UserRegistrationStates["Pending"] = "Pending";
    UserRegistrationStates["Failed"] = "Failed";
    UserRegistrationStates["Denied"] = "Denied";
    UserRegistrationStates["Successful"] = "Successful";
})(UserRegistrationStates || (UserRegistrationStates = {}));
export class User extends ConfigurationEntity {
    constructor() {
        super();
        this.FirstName = new Field();
        this.LastName = new Field();
        this.UserId = new Field();
        this.Email = new Field();
        this.RegistrationState = new Field(UserRegistrationStates.None);
        this.RegistrationCredentials = new Field();
        this.RegistrationDate = new Field();
    }
}
