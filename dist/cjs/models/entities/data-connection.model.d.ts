import { ConfigurationEntity, Field } from './configuration-entity.model.js';
export declare enum DataConnectionType {
    S7 = "S7",
    OpcUa = "OpcUa",
    Modbus = "Modbus",
    Universal = "Universal",
    Simulation = "Simulation",
    Knx = "Knx",
    Iot2000Module = "Iot2000Module",
    ModemInfo = "ModemInfo",
    MtmAdapter = "MtmAdapter",
    YDOCDataLogger = "YDOCDataLogger",
    OTTDataLogger = "OTTDataLogger",
    TeltonikaGPSTracker = "TeltonikaGPSTracker",
    LoRaWAN = "LoRaWAN",
    CsvImporter = "CsvImporter",
    IEC104 = "IEC104",
    BACnet = "BACnet",
    EhWebserver = "EhWebserver",
    FtpParser = "FtpParser",
    Snmp = "Snmp"
}
export declare class DataConnection extends ConfigurationEntity {
    DataSourceId: Field<string>;
    Type: Field<DataConnectionType>;
    Settings: DataConnectionSettings;
}
export declare class DataConnectionSettings {
    _t: string;
}
