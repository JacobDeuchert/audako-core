"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.UserRegistrationStates = void 0;
const configuration_entity_model_js_1 = require("./configuration-entity.model.js");
var UserRegistrationStates;
(function (UserRegistrationStates) {
    UserRegistrationStates["None"] = "None";
    UserRegistrationStates["Pending"] = "Pending";
    UserRegistrationStates["Failed"] = "Failed";
    UserRegistrationStates["Denied"] = "Denied";
    UserRegistrationStates["Successful"] = "Successful";
})(UserRegistrationStates || (exports.UserRegistrationStates = UserRegistrationStates = {}));
class User extends configuration_entity_model_js_1.ConfigurationEntity {
    constructor() {
        super();
        this.FirstName = new configuration_entity_model_js_1.Field();
        this.LastName = new configuration_entity_model_js_1.Field();
        this.UserId = new configuration_entity_model_js_1.Field();
        this.Email = new configuration_entity_model_js_1.Field();
        this.RegistrationState = new configuration_entity_model_js_1.Field(UserRegistrationStates.None);
        this.RegistrationCredentials = new configuration_entity_model_js_1.Field();
        this.RegistrationDate = new configuration_entity_model_js_1.Field();
    }
}
exports.User = User;
