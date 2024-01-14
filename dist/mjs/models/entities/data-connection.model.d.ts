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
    constructor(_t: string);
}
export declare class DataConnectionS7Settings extends DataConnectionSettings {
    Host: Field<string>;
    Port: Field<number>;
    Rack: Field<number>;
    Slot: Field<number>;
    Timeout: Field<number>;
    LocalTSAP: Field<string>;
    RemoteTSAP: Field<string>;
    constructor();
}
export declare enum DataConnectionOpcUaSecurityPolicy {
    None = "None",
    Basic128Rsa15 = "Basic128Rsa15",
    Basic256 = "Basic256",
    Basic256Sha256 = "Basic256Sha256"
}
export declare enum DataConnectionOpcUaSecurityMode {
    None = "None",
    Sign = "Sign",
    SignAndEncrypt = "SignAndEncrypt"
}
export declare enum DataConnectionOpcUaSecurityAuthentication {
    Anonymous = "Anonymous",
    Credentials = "Credentials",
    Certificate = "Certificate"
}
export declare enum DataConnectionOpcUaStringEncoding {
    ASCII = "ASCII",
    UTF7 = " UTF7",
    UTF8 = "UTF8",
    Unicode = "Unicode",
    UTF32 = "UTF32"
}
export declare class DataConnectionOpcUaSettings extends DataConnectionSettings {
    Url: Field<string>;
    SecurityPolicy: Field<DataConnectionOpcUaSecurityPolicy>;
    SecurityMode: Field<DataConnectionOpcUaSecurityMode>;
    SecurityAuthentication: Field<DataConnectionOpcUaSecurityAuthentication>;
    Username: Field<string>;
    Password: Field<string>;
    Certificate: Field<string>;
    PrivateKey: Field<string>;
    PublishingInterval: Field<number>;
    SamplingInterval: Field<number>;
    QueueSize: Field<number>;
    Timeout: Field<number>;
    StringEncoding: Field<DataConnectionOpcUaStringEncoding>;
    constructor();
}
