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
}
