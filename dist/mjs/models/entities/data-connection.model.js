import { ConfigurationEntity } from './configuration-entity.model.js';
export var DataConnectionType;
(function (DataConnectionType) {
    DataConnectionType["S7"] = "S7";
    DataConnectionType["OpcUa"] = "OpcUa";
    DataConnectionType["Modbus"] = "Modbus";
    DataConnectionType["Universal"] = "Universal";
    DataConnectionType["Simulation"] = "Simulation";
    DataConnectionType["Knx"] = "Knx";
    DataConnectionType["Iot2000Module"] = "Iot2000Module";
    DataConnectionType["ModemInfo"] = "ModemInfo";
    DataConnectionType["MtmAdapter"] = "MtmAdapter";
    DataConnectionType["YDOCDataLogger"] = "YDOCDataLogger";
    DataConnectionType["OTTDataLogger"] = "OTTDataLogger";
    DataConnectionType["TeltonikaGPSTracker"] = "TeltonikaGPSTracker";
    DataConnectionType["LoRaWAN"] = "LoRaWAN";
    DataConnectionType["CsvImporter"] = "CsvImporter";
    DataConnectionType["IEC104"] = "IEC104";
    DataConnectionType["BACnet"] = "BACnet";
    DataConnectionType["EhWebserver"] = "EhWebserver";
    DataConnectionType["FtpParser"] = "FtpParser";
    DataConnectionType["Snmp"] = "Snmp";
})(DataConnectionType || (DataConnectionType = {}));
export class DataConnection extends ConfigurationEntity {
}
export class DataConnectionSettings {
    constructor(_t) {
        this._t = _t;
    }
}
export class DataConnectionS7Settings extends DataConnectionSettings {
    constructor() {
        super('DataConnectionS7Settings');
    }
}
export var DataConnectionOpcUaSecurityPolicy;
(function (DataConnectionOpcUaSecurityPolicy) {
    DataConnectionOpcUaSecurityPolicy["None"] = "None";
    DataConnectionOpcUaSecurityPolicy["Basic128Rsa15"] = "Basic128Rsa15";
    DataConnectionOpcUaSecurityPolicy["Basic256"] = "Basic256";
    DataConnectionOpcUaSecurityPolicy["Basic256Sha256"] = "Basic256Sha256";
})(DataConnectionOpcUaSecurityPolicy || (DataConnectionOpcUaSecurityPolicy = {}));
export var DataConnectionOpcUaSecurityMode;
(function (DataConnectionOpcUaSecurityMode) {
    DataConnectionOpcUaSecurityMode["None"] = "None";
    DataConnectionOpcUaSecurityMode["Sign"] = "Sign";
    DataConnectionOpcUaSecurityMode["SignAndEncrypt"] = "SignAndEncrypt";
})(DataConnectionOpcUaSecurityMode || (DataConnectionOpcUaSecurityMode = {}));
export var DataConnectionOpcUaSecurityAuthentication;
(function (DataConnectionOpcUaSecurityAuthentication) {
    DataConnectionOpcUaSecurityAuthentication["Anonymous"] = "Anonymous";
    DataConnectionOpcUaSecurityAuthentication["Credentials"] = "Credentials";
    DataConnectionOpcUaSecurityAuthentication["Certificate"] = "Certificate";
})(DataConnectionOpcUaSecurityAuthentication || (DataConnectionOpcUaSecurityAuthentication = {}));
export var DataConnectionOpcUaStringEncoding;
(function (DataConnectionOpcUaStringEncoding) {
    DataConnectionOpcUaStringEncoding["ASCII"] = "ASCII";
    DataConnectionOpcUaStringEncoding["UTF7"] = " UTF7";
    DataConnectionOpcUaStringEncoding["UTF8"] = "UTF8";
    DataConnectionOpcUaStringEncoding["Unicode"] = "Unicode";
    DataConnectionOpcUaStringEncoding["UTF32"] = "UTF32";
})(DataConnectionOpcUaStringEncoding || (DataConnectionOpcUaStringEncoding = {}));
export class DataConnectionOpcUaSettings extends DataConnectionSettings {
    constructor() {
        super('DataConnectionOpcUaSettings');
    }
}
