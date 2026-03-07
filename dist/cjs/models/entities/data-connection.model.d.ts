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
    Snmp = "Snmp",
    Mqtt = "Mqtt",
    OneWire = "OneWire",
    MeterBus = "MeterBus"
}
export declare enum DataConnectionSpecialDeviceProfile {
    None = "None",
    JUMO = "JUMO"
}
export declare class DataConnection extends ConfigurationEntity {
    DataSourceId: Field<string>;
    Type: Field<DataConnectionType>;
    Settings: DataConnectionTypedSettings;
    SpecialDeviceProfile: Field<DataConnectionSpecialDeviceProfile>;
    PollingInterval: Field<number | null>;
    constructor();
}
export declare abstract class DataConnectionTypedSettings {
    _t: string;
    constructor(typeName?: string);
}
export declare class DataConnectionS7Settings extends DataConnectionTypedSettings {
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
    UTF7 = "UTF7",
    UTF8 = "UTF8",
    Unicode = "Unicode",
    UTF32 = "UTF32"
}
export declare enum DataConnectionOpcUaTimestampSource {
    Connection = "Connection",
    EdgeGateway = "EdgeGateway"
}
export declare class DataConnectionOpcUaSettings extends DataConnectionTypedSettings {
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
    TimestampSource: Field<DataConnectionOpcUaTimestampSource>;
    constructor();
}
export declare class DataConnectionModbusSettings extends DataConnectionTypedSettings {
    Host: Field<string>;
    Port: Field<number>;
    constructor();
}
export declare class DataConnectionIEC104Settings extends DataConnectionTypedSettings {
    Host: Field<string>;
    Port: Field<number>;
    OriginatorAddress: Field<number>;
    TimeSyncInterval: Field<number>;
    GeneralInterrogationInterval: Field<number>;
    CounterInterrogationInterval: Field<number>;
    CommonAddressFieldLength: Field<number>;
    CotFieldLength: Field<number>;
    IoaFieldLength: Field<number>;
    MaxIdleTime: Field<number>;
    MaxTimeNoAckReceived: Field<number>;
    MaxTimeNoAckSent: Field<number>;
    MaxUnconfirmedIPdusReceived: Field<number>;
    MaxNumOfOutstandingIPdus: Field<number>;
    MessageFragmentTimeout: Field<number>;
    constructor();
}
export declare class DataConnectionBacnetSettings extends DataConnectionTypedSettings {
    Port: Field<number>;
    Interface: Field<string>;
    BroadcastAddress: Field<string>;
    ApduTimeout: Field<number>;
    constructor();
}
export declare class DataConnectionSimulationSettings extends DataConnectionTypedSettings {
    ScriptPath: Field<string>;
    ScriptCycle: Field<number>;
    constructor();
}
export declare class DataConnectionUniversalSettings extends DataConnectionTypedSettings {
    DriverPath: Field<string>;
    constructor();
}
export declare class DataConnectionKnxSettings extends DataConnectionTypedSettings {
    Host: Field<string>;
    Port: Field<number | null>;
    Interface: Field<string>;
    PhysicalAddress: Field<string>;
    ForceTunneling: Field<boolean>;
    MinimumDelay: Field<number | null>;
    SuppressAckLDataReq: Field<boolean>;
    constructor();
}
export declare class DataConnectionIot2000ModuleSettings extends DataConnectionTypedSettings {
    MLFB: Field<string>;
    constructor();
}
export declare class DataConnectionEhWebserverSettings extends DataConnectionTypedSettings {
    Host: Field<string>;
    AccessCode: Field<string>;
    constructor();
}
export declare class DataConnectionSnmpSettings extends DataConnectionTypedSettings {
    Host: Field<string>;
    Port: Field<number>;
    Timeout: Field<number>;
    Community: Field<string>;
    constructor();
}
export declare class DataConnectionModemInfoSettings extends DataConnectionTypedSettings {
    constructor();
}
export declare class DataConnectionMqttSettings extends DataConnectionTypedSettings {
    Url: Field<string>;
    Username: Field<string>;
    Password: Field<string>;
    constructor();
}
export declare class DataConnectionOneWireSettings extends DataConnectionTypedSettings {
    Host: Field<string>;
    Port: Field<number>;
    constructor();
}
export declare enum MeterBusMode {
    serial = "serial",
    tcp = "tcp"
}
export declare class DataConnectionMeterBusSettings extends DataConnectionTypedSettings {
    Mode: Field<MeterBusMode>;
    HostOrSerialPort: Field<string>;
    Port: Field<number>;
    BaudRate: Field<number>;
    Timeout: Field<number>;
    constructor();
}
export declare class DataConnectionMtmAdapterSettings extends DataConnectionTypedSettings {
    TimeoutTime: Field<number>;
    KeepAliveTime: Field<number>;
    Username: Field<string>;
    Password: Field<string>;
    constructor();
}
export declare class DataConnectionYDOCDataLoggerSettings extends DataConnectionTypedSettings {
    DeviceId: Field<string>;
    Username: Field<string>;
    Password: Field<string>;
    constructor();
}
export declare class DataConnectionOTTDataLoggerSettings extends DataConnectionTypedSettings {
    Station: Field<string>;
    Password: Field<string>;
    constructor();
}
export declare class DataConnectionTeltonikaGPSSettings extends DataConnectionTypedSettings {
    Address: Field<string>;
    constructor();
}
export declare class DataConnectionLoRaWANSettings extends DataConnectionTypedSettings {
    DeviceType: Field<string>;
    DeviceEUI: Field<string>;
    DeviceConfiguration: Field<string>;
    constructor();
}
export declare class DataConnectionCsvImporterSettings extends DataConnectionTypedSettings {
    Address: Field<string>;
    constructor();
}
export declare class DataConnectionFtpParserSettings extends DataConnectionTypedSettings {
    ParserType: Field<string>;
    ConnectionType: Field<string>;
    Address: Field<string>;
    Port: Field<number>;
    Username: Field<string>;
    Password: Field<string>;
    ValidateCertificate: Field<boolean>;
    FileDirectory: Field<string>;
    EncryptionMode: Field<string>;
    RequestInterval: Field<number>;
    DeleteReadFiles: Field<boolean>;
    constructor();
}
export { DataConnectionTypedSettings as DataConnectionSettings };
