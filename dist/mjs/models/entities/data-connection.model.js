import { ConfigurationEntity, Field } from './configuration-entity.model.js';
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
    DataConnectionType["Mqtt"] = "Mqtt";
    DataConnectionType["OneWire"] = "OneWire";
    DataConnectionType["MeterBus"] = "MeterBus";
})(DataConnectionType || (DataConnectionType = {}));
export var DataConnectionSpecialDeviceProfile;
(function (DataConnectionSpecialDeviceProfile) {
    DataConnectionSpecialDeviceProfile["None"] = "None";
    DataConnectionSpecialDeviceProfile["JUMO"] = "JUMO";
})(DataConnectionSpecialDeviceProfile || (DataConnectionSpecialDeviceProfile = {}));
export class DataConnection extends ConfigurationEntity {
    constructor() {
        super();
        this.DataSourceId = new Field(null);
        this.Type = new Field(null);
        this.Settings = null;
        this.SpecialDeviceProfile = new Field(DataConnectionSpecialDeviceProfile.None);
        this.PollingInterval = new Field(null);
    }
}
export class DataConnectionTypedSettings {
    constructor(typeName) {
        this._t = typeName !== null && typeName !== void 0 ? typeName : this.constructor.name;
    }
}
export class DataConnectionS7Settings extends DataConnectionTypedSettings {
    constructor() {
        super('DataConnectionS7Settings');
        this.Host = new Field(null);
        this.Port = new Field(502);
        this.Rack = new Field(0);
        this.Slot = new Field(2);
        this.Timeout = new Field(5000);
        this.LocalTSAP = new Field(null);
        this.RemoteTSAP = new Field(null);
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
    DataConnectionOpcUaStringEncoding["UTF7"] = "UTF7";
    DataConnectionOpcUaStringEncoding["UTF8"] = "UTF8";
    DataConnectionOpcUaStringEncoding["Unicode"] = "Unicode";
    DataConnectionOpcUaStringEncoding["UTF32"] = "UTF32";
})(DataConnectionOpcUaStringEncoding || (DataConnectionOpcUaStringEncoding = {}));
export var DataConnectionOpcUaTimestampSource;
(function (DataConnectionOpcUaTimestampSource) {
    DataConnectionOpcUaTimestampSource["Connection"] = "Connection";
    DataConnectionOpcUaTimestampSource["EdgeGateway"] = "EdgeGateway";
})(DataConnectionOpcUaTimestampSource || (DataConnectionOpcUaTimestampSource = {}));
export class DataConnectionOpcUaSettings extends DataConnectionTypedSettings {
    constructor() {
        super('DataConnectionOpcUaSettings');
        this.Url = new Field(null);
        this.SecurityPolicy = new Field(DataConnectionOpcUaSecurityPolicy.None);
        this.SecurityMode = new Field(DataConnectionOpcUaSecurityMode.None);
        this.SecurityAuthentication = new Field(DataConnectionOpcUaSecurityAuthentication.Anonymous);
        this.Username = new Field(null);
        this.Password = new Field(null);
        this.Certificate = new Field(null);
        this.PrivateKey = new Field(null);
        this.PublishingInterval = new Field(1000);
        this.SamplingInterval = new Field(1000);
        this.QueueSize = new Field(-1);
        this.Timeout = new Field(5000);
        this.StringEncoding = new Field(DataConnectionOpcUaStringEncoding.UTF8);
        this.TimestampSource = new Field(DataConnectionOpcUaTimestampSource.Connection);
    }
}
export class DataConnectionModbusSettings extends DataConnectionTypedSettings {
    constructor() {
        super('DataConnectionModbusSettings');
        this.Host = new Field(null);
        this.Port = new Field(502);
    }
}
export class DataConnectionIEC104Settings extends DataConnectionTypedSettings {
    constructor() {
        super('DataConnectionIEC104Settings');
        this.Host = new Field(null);
        this.Port = new Field(2404);
        this.OriginatorAddress = new Field(0);
        this.TimeSyncInterval = new Field(720);
        this.GeneralInterrogationInterval = new Field(60);
        this.CounterInterrogationInterval = new Field(60);
        this.CommonAddressFieldLength = new Field(2);
        this.CotFieldLength = new Field(2);
        this.IoaFieldLength = new Field(3);
        this.MaxIdleTime = new Field(20000);
        this.MaxTimeNoAckReceived = new Field(15000);
        this.MaxTimeNoAckSent = new Field(10000);
        this.MaxUnconfirmedIPdusReceived = new Field(8);
        this.MaxNumOfOutstandingIPdus = new Field(12);
        this.MessageFragmentTimeout = new Field(5000);
    }
}
export class DataConnectionBacnetSettings extends DataConnectionTypedSettings {
    constructor() {
        super('DataConnectionBacnetSettings');
        this.Port = new Field(47808);
        this.Interface = new Field(null);
        this.BroadcastAddress = new Field(null);
        this.ApduTimeout = new Field(6000);
    }
}
export class DataConnectionSimulationSettings extends DataConnectionTypedSettings {
    constructor() {
        super('DataConnectionSimulationSettings');
        this.ScriptPath = new Field(null);
        this.ScriptCycle = new Field(500);
    }
}
export class DataConnectionUniversalSettings extends DataConnectionTypedSettings {
    constructor() {
        super('DataConnectionUniversalSettings');
        this.DriverPath = new Field(null);
    }
}
export class DataConnectionKnxSettings extends DataConnectionTypedSettings {
    constructor() {
        super('DataConnectionKnxSettings');
        this.Host = new Field(null);
        this.Port = new Field(null);
        this.Interface = new Field(null);
        this.PhysicalAddress = new Field('15.15.15');
        this.ForceTunneling = new Field(false);
        this.MinimumDelay = new Field(null);
        this.SuppressAckLDataReq = new Field(false);
    }
}
export class DataConnectionIot2000ModuleSettings extends DataConnectionTypedSettings {
    constructor() {
        super('DataConnectionIot2000ModuleSettings');
        this.MLFB = new Field(null);
    }
}
export class DataConnectionEhWebserverSettings extends DataConnectionTypedSettings {
    constructor() {
        super('DataConnectionEhWebserverSettings');
        this.Host = new Field(null);
        this.AccessCode = new Field('0000');
    }
}
export class DataConnectionSnmpSettings extends DataConnectionTypedSettings {
    constructor() {
        super('DataConnectionSnmpSettings');
        this.Host = new Field(null);
        this.Port = new Field(161);
        this.Timeout = new Field(5000);
        this.Community = new Field(null);
    }
}
export class DataConnectionModemInfoSettings extends DataConnectionTypedSettings {
    constructor() {
        super('DataConnectionModemInfoSettings');
    }
}
export class DataConnectionMqttSettings extends DataConnectionTypedSettings {
    constructor() {
        super('DataConnectionMqttSettings');
        this.Url = new Field(null);
        this.Username = new Field(null);
        this.Password = new Field(null);
    }
}
export class DataConnectionOneWireSettings extends DataConnectionTypedSettings {
    constructor() {
        super('DataConnectionOneWireSettings');
        this.Host = new Field('localhost');
        this.Port = new Field(4304);
    }
}
export var MeterBusMode;
(function (MeterBusMode) {
    MeterBusMode["serial"] = "serial";
    MeterBusMode["tcp"] = "tcp";
})(MeterBusMode || (MeterBusMode = {}));
export class DataConnectionMeterBusSettings extends DataConnectionTypedSettings {
    constructor() {
        super('DataConnectionMeterBusSettings');
        this.Mode = new Field(MeterBusMode.tcp);
        this.HostOrSerialPort = new Field(null);
        this.Port = new Field(0);
        this.BaudRate = new Field(2400);
        this.Timeout = new Field(5000);
    }
}
export class DataConnectionMtmAdapterSettings extends DataConnectionTypedSettings {
    constructor() {
        super('DataConnectionMtmAdapterSettings');
        this.TimeoutTime = new Field(120);
        this.KeepAliveTime = new Field(null);
        this.Username = new Field(null);
        this.Password = new Field(null);
    }
}
export class DataConnectionYDOCDataLoggerSettings extends DataConnectionTypedSettings {
    constructor() {
        super('DataConnectionYDOCDataLoggerSettings');
        this.DeviceId = new Field(null);
        this.Username = new Field(null);
        this.Password = new Field(null);
    }
}
export class DataConnectionOTTDataLoggerSettings extends DataConnectionTypedSettings {
    constructor() {
        super('DataConnectionOTTDataLoggerSettings');
        this.Station = new Field(null);
        this.Password = new Field(null);
    }
}
export class DataConnectionTeltonikaGPSSettings extends DataConnectionTypedSettings {
    constructor() {
        super('DataConnectionTeltonikaGPSSettings');
        this.Address = new Field(null);
    }
}
export class DataConnectionLoRaWANSettings extends DataConnectionTypedSettings {
    constructor() {
        super('DataConnectionLoRaWANSettings');
        this.DeviceType = new Field(null);
        this.DeviceEUI = new Field(null);
        this.DeviceConfiguration = new Field(null);
    }
}
export class DataConnectionCsvImporterSettings extends DataConnectionTypedSettings {
    constructor() {
        super('DataConnectionCsvImporterSettings');
        this.Address = new Field(null);
    }
}
export class DataConnectionFtpParserSettings extends DataConnectionTypedSettings {
    constructor() {
        super('DataConnectionFtpParserSettings');
        this.ParserType = new Field(null);
        this.ConnectionType = new Field(null);
        this.Address = new Field(null);
        this.Port = new Field(21);
        this.Username = new Field(null);
        this.Password = new Field(null);
        this.ValidateCertificate = new Field(false);
        this.FileDirectory = new Field(null);
        this.EncryptionMode = new Field(null);
        this.RequestInterval = new Field(0);
        this.DeleteReadFiles = new Field(false);
    }
}
export { DataConnectionTypedSettings as DataConnectionSettings };
