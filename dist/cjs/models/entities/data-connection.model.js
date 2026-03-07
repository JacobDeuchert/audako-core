"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataConnectionSettings = exports.DataConnectionFtpParserSettings = exports.DataConnectionCsvImporterSettings = exports.DataConnectionLoRaWANSettings = exports.DataConnectionTeltonikaGPSSettings = exports.DataConnectionOTTDataLoggerSettings = exports.DataConnectionYDOCDataLoggerSettings = exports.DataConnectionMtmAdapterSettings = exports.DataConnectionMeterBusSettings = exports.MeterBusMode = exports.DataConnectionOneWireSettings = exports.DataConnectionMqttSettings = exports.DataConnectionModemInfoSettings = exports.DataConnectionSnmpSettings = exports.DataConnectionEhWebserverSettings = exports.DataConnectionIot2000ModuleSettings = exports.DataConnectionKnxSettings = exports.DataConnectionUniversalSettings = exports.DataConnectionSimulationSettings = exports.DataConnectionBacnetSettings = exports.DataConnectionIEC104Settings = exports.DataConnectionModbusSettings = exports.DataConnectionOpcUaSettings = exports.DataConnectionOpcUaTimestampSource = exports.DataConnectionOpcUaStringEncoding = exports.DataConnectionOpcUaSecurityAuthentication = exports.DataConnectionOpcUaSecurityMode = exports.DataConnectionOpcUaSecurityPolicy = exports.DataConnectionS7Settings = exports.DataConnectionTypedSettings = exports.DataConnection = exports.DataConnectionSpecialDeviceProfile = exports.DataConnectionType = void 0;
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
    DataConnectionType["Mqtt"] = "Mqtt";
    DataConnectionType["OneWire"] = "OneWire";
    DataConnectionType["MeterBus"] = "MeterBus";
})(DataConnectionType || (exports.DataConnectionType = DataConnectionType = {}));
var DataConnectionSpecialDeviceProfile;
(function (DataConnectionSpecialDeviceProfile) {
    DataConnectionSpecialDeviceProfile["None"] = "None";
    DataConnectionSpecialDeviceProfile["JUMO"] = "JUMO";
})(DataConnectionSpecialDeviceProfile || (exports.DataConnectionSpecialDeviceProfile = DataConnectionSpecialDeviceProfile = {}));
class DataConnection extends configuration_entity_model_js_1.ConfigurationEntity {
    constructor() {
        super();
        this.DataSourceId = new configuration_entity_model_js_1.Field(null);
        this.Type = new configuration_entity_model_js_1.Field(null);
        this.Settings = null;
        this.SpecialDeviceProfile = new configuration_entity_model_js_1.Field(DataConnectionSpecialDeviceProfile.None);
        this.PollingInterval = new configuration_entity_model_js_1.Field(null);
    }
}
exports.DataConnection = DataConnection;
class DataConnectionTypedSettings {
    constructor(typeName) {
        this._t = typeName !== null && typeName !== void 0 ? typeName : this.constructor.name;
    }
}
exports.DataConnectionTypedSettings = DataConnectionTypedSettings;
exports.DataConnectionSettings = DataConnectionTypedSettings;
class DataConnectionS7Settings extends DataConnectionTypedSettings {
    constructor() {
        super('DataConnectionS7Settings');
        this.Host = new configuration_entity_model_js_1.Field(null);
        this.Port = new configuration_entity_model_js_1.Field(502);
        this.Rack = new configuration_entity_model_js_1.Field(0);
        this.Slot = new configuration_entity_model_js_1.Field(2);
        this.Timeout = new configuration_entity_model_js_1.Field(5000);
        this.LocalTSAP = new configuration_entity_model_js_1.Field(null);
        this.RemoteTSAP = new configuration_entity_model_js_1.Field(null);
    }
}
exports.DataConnectionS7Settings = DataConnectionS7Settings;
var DataConnectionOpcUaSecurityPolicy;
(function (DataConnectionOpcUaSecurityPolicy) {
    DataConnectionOpcUaSecurityPolicy["None"] = "None";
    DataConnectionOpcUaSecurityPolicy["Basic128Rsa15"] = "Basic128Rsa15";
    DataConnectionOpcUaSecurityPolicy["Basic256"] = "Basic256";
    DataConnectionOpcUaSecurityPolicy["Basic256Sha256"] = "Basic256Sha256";
})(DataConnectionOpcUaSecurityPolicy || (exports.DataConnectionOpcUaSecurityPolicy = DataConnectionOpcUaSecurityPolicy = {}));
var DataConnectionOpcUaSecurityMode;
(function (DataConnectionOpcUaSecurityMode) {
    DataConnectionOpcUaSecurityMode["None"] = "None";
    DataConnectionOpcUaSecurityMode["Sign"] = "Sign";
    DataConnectionOpcUaSecurityMode["SignAndEncrypt"] = "SignAndEncrypt";
})(DataConnectionOpcUaSecurityMode || (exports.DataConnectionOpcUaSecurityMode = DataConnectionOpcUaSecurityMode = {}));
var DataConnectionOpcUaSecurityAuthentication;
(function (DataConnectionOpcUaSecurityAuthentication) {
    DataConnectionOpcUaSecurityAuthentication["Anonymous"] = "Anonymous";
    DataConnectionOpcUaSecurityAuthentication["Credentials"] = "Credentials";
    DataConnectionOpcUaSecurityAuthentication["Certificate"] = "Certificate";
})(DataConnectionOpcUaSecurityAuthentication || (exports.DataConnectionOpcUaSecurityAuthentication = DataConnectionOpcUaSecurityAuthentication = {}));
var DataConnectionOpcUaStringEncoding;
(function (DataConnectionOpcUaStringEncoding) {
    DataConnectionOpcUaStringEncoding["ASCII"] = "ASCII";
    DataConnectionOpcUaStringEncoding["UTF7"] = "UTF7";
    DataConnectionOpcUaStringEncoding["UTF8"] = "UTF8";
    DataConnectionOpcUaStringEncoding["Unicode"] = "Unicode";
    DataConnectionOpcUaStringEncoding["UTF32"] = "UTF32";
})(DataConnectionOpcUaStringEncoding || (exports.DataConnectionOpcUaStringEncoding = DataConnectionOpcUaStringEncoding = {}));
var DataConnectionOpcUaTimestampSource;
(function (DataConnectionOpcUaTimestampSource) {
    DataConnectionOpcUaTimestampSource["Connection"] = "Connection";
    DataConnectionOpcUaTimestampSource["EdgeGateway"] = "EdgeGateway";
})(DataConnectionOpcUaTimestampSource || (exports.DataConnectionOpcUaTimestampSource = DataConnectionOpcUaTimestampSource = {}));
class DataConnectionOpcUaSettings extends DataConnectionTypedSettings {
    constructor() {
        super('DataConnectionOpcUaSettings');
        this.Url = new configuration_entity_model_js_1.Field(null);
        this.SecurityPolicy = new configuration_entity_model_js_1.Field(DataConnectionOpcUaSecurityPolicy.None);
        this.SecurityMode = new configuration_entity_model_js_1.Field(DataConnectionOpcUaSecurityMode.None);
        this.SecurityAuthentication = new configuration_entity_model_js_1.Field(DataConnectionOpcUaSecurityAuthentication.Anonymous);
        this.Username = new configuration_entity_model_js_1.Field(null);
        this.Password = new configuration_entity_model_js_1.Field(null);
        this.Certificate = new configuration_entity_model_js_1.Field(null);
        this.PrivateKey = new configuration_entity_model_js_1.Field(null);
        this.PublishingInterval = new configuration_entity_model_js_1.Field(1000);
        this.SamplingInterval = new configuration_entity_model_js_1.Field(1000);
        this.QueueSize = new configuration_entity_model_js_1.Field(-1);
        this.Timeout = new configuration_entity_model_js_1.Field(5000);
        this.StringEncoding = new configuration_entity_model_js_1.Field(DataConnectionOpcUaStringEncoding.UTF8);
        this.TimestampSource = new configuration_entity_model_js_1.Field(DataConnectionOpcUaTimestampSource.Connection);
    }
}
exports.DataConnectionOpcUaSettings = DataConnectionOpcUaSettings;
class DataConnectionModbusSettings extends DataConnectionTypedSettings {
    constructor() {
        super('DataConnectionModbusSettings');
        this.Host = new configuration_entity_model_js_1.Field(null);
        this.Port = new configuration_entity_model_js_1.Field(502);
    }
}
exports.DataConnectionModbusSettings = DataConnectionModbusSettings;
class DataConnectionIEC104Settings extends DataConnectionTypedSettings {
    constructor() {
        super('DataConnectionIEC104Settings');
        this.Host = new configuration_entity_model_js_1.Field(null);
        this.Port = new configuration_entity_model_js_1.Field(2404);
        this.OriginatorAddress = new configuration_entity_model_js_1.Field(0);
        this.TimeSyncInterval = new configuration_entity_model_js_1.Field(720);
        this.GeneralInterrogationInterval = new configuration_entity_model_js_1.Field(60);
        this.CounterInterrogationInterval = new configuration_entity_model_js_1.Field(60);
        this.CommonAddressFieldLength = new configuration_entity_model_js_1.Field(2);
        this.CotFieldLength = new configuration_entity_model_js_1.Field(2);
        this.IoaFieldLength = new configuration_entity_model_js_1.Field(3);
        this.MaxIdleTime = new configuration_entity_model_js_1.Field(20000);
        this.MaxTimeNoAckReceived = new configuration_entity_model_js_1.Field(15000);
        this.MaxTimeNoAckSent = new configuration_entity_model_js_1.Field(10000);
        this.MaxUnconfirmedIPdusReceived = new configuration_entity_model_js_1.Field(8);
        this.MaxNumOfOutstandingIPdus = new configuration_entity_model_js_1.Field(12);
        this.MessageFragmentTimeout = new configuration_entity_model_js_1.Field(5000);
    }
}
exports.DataConnectionIEC104Settings = DataConnectionIEC104Settings;
class DataConnectionBacnetSettings extends DataConnectionTypedSettings {
    constructor() {
        super('DataConnectionBacnetSettings');
        this.Port = new configuration_entity_model_js_1.Field(47808);
        this.Interface = new configuration_entity_model_js_1.Field(null);
        this.BroadcastAddress = new configuration_entity_model_js_1.Field(null);
        this.ApduTimeout = new configuration_entity_model_js_1.Field(6000);
    }
}
exports.DataConnectionBacnetSettings = DataConnectionBacnetSettings;
class DataConnectionSimulationSettings extends DataConnectionTypedSettings {
    constructor() {
        super('DataConnectionSimulationSettings');
        this.ScriptPath = new configuration_entity_model_js_1.Field(null);
        this.ScriptCycle = new configuration_entity_model_js_1.Field(500);
    }
}
exports.DataConnectionSimulationSettings = DataConnectionSimulationSettings;
class DataConnectionUniversalSettings extends DataConnectionTypedSettings {
    constructor() {
        super('DataConnectionUniversalSettings');
        this.DriverPath = new configuration_entity_model_js_1.Field(null);
    }
}
exports.DataConnectionUniversalSettings = DataConnectionUniversalSettings;
class DataConnectionKnxSettings extends DataConnectionTypedSettings {
    constructor() {
        super('DataConnectionKnxSettings');
        this.Host = new configuration_entity_model_js_1.Field(null);
        this.Port = new configuration_entity_model_js_1.Field(null);
        this.Interface = new configuration_entity_model_js_1.Field(null);
        this.PhysicalAddress = new configuration_entity_model_js_1.Field('15.15.15');
        this.ForceTunneling = new configuration_entity_model_js_1.Field(false);
        this.MinimumDelay = new configuration_entity_model_js_1.Field(null);
        this.SuppressAckLDataReq = new configuration_entity_model_js_1.Field(false);
    }
}
exports.DataConnectionKnxSettings = DataConnectionKnxSettings;
class DataConnectionIot2000ModuleSettings extends DataConnectionTypedSettings {
    constructor() {
        super('DataConnectionIot2000ModuleSettings');
        this.MLFB = new configuration_entity_model_js_1.Field(null);
    }
}
exports.DataConnectionIot2000ModuleSettings = DataConnectionIot2000ModuleSettings;
class DataConnectionEhWebserverSettings extends DataConnectionTypedSettings {
    constructor() {
        super('DataConnectionEhWebserverSettings');
        this.Host = new configuration_entity_model_js_1.Field(null);
        this.AccessCode = new configuration_entity_model_js_1.Field('0000');
    }
}
exports.DataConnectionEhWebserverSettings = DataConnectionEhWebserverSettings;
class DataConnectionSnmpSettings extends DataConnectionTypedSettings {
    constructor() {
        super('DataConnectionSnmpSettings');
        this.Host = new configuration_entity_model_js_1.Field(null);
        this.Port = new configuration_entity_model_js_1.Field(161);
        this.Timeout = new configuration_entity_model_js_1.Field(5000);
        this.Community = new configuration_entity_model_js_1.Field(null);
    }
}
exports.DataConnectionSnmpSettings = DataConnectionSnmpSettings;
class DataConnectionModemInfoSettings extends DataConnectionTypedSettings {
    constructor() {
        super('DataConnectionModemInfoSettings');
    }
}
exports.DataConnectionModemInfoSettings = DataConnectionModemInfoSettings;
class DataConnectionMqttSettings extends DataConnectionTypedSettings {
    constructor() {
        super('DataConnectionMqttSettings');
        this.Url = new configuration_entity_model_js_1.Field(null);
        this.Username = new configuration_entity_model_js_1.Field(null);
        this.Password = new configuration_entity_model_js_1.Field(null);
    }
}
exports.DataConnectionMqttSettings = DataConnectionMqttSettings;
class DataConnectionOneWireSettings extends DataConnectionTypedSettings {
    constructor() {
        super('DataConnectionOneWireSettings');
        this.Host = new configuration_entity_model_js_1.Field('localhost');
        this.Port = new configuration_entity_model_js_1.Field(4304);
    }
}
exports.DataConnectionOneWireSettings = DataConnectionOneWireSettings;
var MeterBusMode;
(function (MeterBusMode) {
    MeterBusMode["serial"] = "serial";
    MeterBusMode["tcp"] = "tcp";
})(MeterBusMode || (exports.MeterBusMode = MeterBusMode = {}));
class DataConnectionMeterBusSettings extends DataConnectionTypedSettings {
    constructor() {
        super('DataConnectionMeterBusSettings');
        this.Mode = new configuration_entity_model_js_1.Field(MeterBusMode.tcp);
        this.HostOrSerialPort = new configuration_entity_model_js_1.Field(null);
        this.Port = new configuration_entity_model_js_1.Field(0);
        this.BaudRate = new configuration_entity_model_js_1.Field(2400);
        this.Timeout = new configuration_entity_model_js_1.Field(5000);
    }
}
exports.DataConnectionMeterBusSettings = DataConnectionMeterBusSettings;
class DataConnectionMtmAdapterSettings extends DataConnectionTypedSettings {
    constructor() {
        super('DataConnectionMtmAdapterSettings');
        this.TimeoutTime = new configuration_entity_model_js_1.Field(120);
        this.KeepAliveTime = new configuration_entity_model_js_1.Field(null);
        this.Username = new configuration_entity_model_js_1.Field(null);
        this.Password = new configuration_entity_model_js_1.Field(null);
    }
}
exports.DataConnectionMtmAdapterSettings = DataConnectionMtmAdapterSettings;
class DataConnectionYDOCDataLoggerSettings extends DataConnectionTypedSettings {
    constructor() {
        super('DataConnectionYDOCDataLoggerSettings');
        this.DeviceId = new configuration_entity_model_js_1.Field(null);
        this.Username = new configuration_entity_model_js_1.Field(null);
        this.Password = new configuration_entity_model_js_1.Field(null);
    }
}
exports.DataConnectionYDOCDataLoggerSettings = DataConnectionYDOCDataLoggerSettings;
class DataConnectionOTTDataLoggerSettings extends DataConnectionTypedSettings {
    constructor() {
        super('DataConnectionOTTDataLoggerSettings');
        this.Station = new configuration_entity_model_js_1.Field(null);
        this.Password = new configuration_entity_model_js_1.Field(null);
    }
}
exports.DataConnectionOTTDataLoggerSettings = DataConnectionOTTDataLoggerSettings;
class DataConnectionTeltonikaGPSSettings extends DataConnectionTypedSettings {
    constructor() {
        super('DataConnectionTeltonikaGPSSettings');
        this.Address = new configuration_entity_model_js_1.Field(null);
    }
}
exports.DataConnectionTeltonikaGPSSettings = DataConnectionTeltonikaGPSSettings;
class DataConnectionLoRaWANSettings extends DataConnectionTypedSettings {
    constructor() {
        super('DataConnectionLoRaWANSettings');
        this.DeviceType = new configuration_entity_model_js_1.Field(null);
        this.DeviceEUI = new configuration_entity_model_js_1.Field(null);
        this.DeviceConfiguration = new configuration_entity_model_js_1.Field(null);
    }
}
exports.DataConnectionLoRaWANSettings = DataConnectionLoRaWANSettings;
class DataConnectionCsvImporterSettings extends DataConnectionTypedSettings {
    constructor() {
        super('DataConnectionCsvImporterSettings');
        this.Address = new configuration_entity_model_js_1.Field(null);
    }
}
exports.DataConnectionCsvImporterSettings = DataConnectionCsvImporterSettings;
class DataConnectionFtpParserSettings extends DataConnectionTypedSettings {
    constructor() {
        super('DataConnectionFtpParserSettings');
        this.ParserType = new configuration_entity_model_js_1.Field(null);
        this.ConnectionType = new configuration_entity_model_js_1.Field(null);
        this.Address = new configuration_entity_model_js_1.Field(null);
        this.Port = new configuration_entity_model_js_1.Field(21);
        this.Username = new configuration_entity_model_js_1.Field(null);
        this.Password = new configuration_entity_model_js_1.Field(null);
        this.ValidateCertificate = new configuration_entity_model_js_1.Field(false);
        this.FileDirectory = new configuration_entity_model_js_1.Field(null);
        this.EncryptionMode = new configuration_entity_model_js_1.Field(null);
        this.RequestInterval = new configuration_entity_model_js_1.Field(0);
        this.DeleteReadFiles = new configuration_entity_model_js_1.Field(false);
    }
}
exports.DataConnectionFtpParserSettings = DataConnectionFtpParserSettings;
