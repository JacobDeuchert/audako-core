"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataConnectionSettings = exports.DataConnection = exports.DataConnectionType = void 0;
const configuration_entity_model_js_1 = require("./configuration-entity.model.js");
var DataConnectionType;
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
})(DataConnectionType || (exports.DataConnectionType = DataConnectionType = {}));
class DataConnection extends configuration_entity_model_js_1.ConfigurationEntity {
}
exports.DataConnection = DataConnection;
class DataConnectionSettings {
}
exports.DataConnectionSettings = DataConnectionSettings;
