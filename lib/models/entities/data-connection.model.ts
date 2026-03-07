import { ConfigurationEntity, Field } from './configuration-entity.model.js';

export enum DataConnectionType {
  S7 = 'S7',
  OpcUa = 'OpcUa',
  Modbus = 'Modbus',
  Universal = 'Universal',
  Simulation = 'Simulation',
  Knx = 'Knx',
  Iot2000Module = 'Iot2000Module',
  ModemInfo = 'ModemInfo',
  MtmAdapter = 'MtmAdapter',
  YDOCDataLogger = 'YDOCDataLogger',
  OTTDataLogger = 'OTTDataLogger',
  TeltonikaGPSTracker = 'TeltonikaGPSTracker',
  LoRaWAN = 'LoRaWAN',
  CsvImporter = 'CsvImporter',
  IEC104 = 'IEC104',
  BACnet = 'BACnet',
  EhWebserver = 'EhWebserver',
  FtpParser = 'FtpParser',
  Snmp = 'Snmp',
  Mqtt = 'Mqtt',
  OneWire = 'OneWire',
  MeterBus = 'MeterBus',
}

export enum DataConnectionSpecialDeviceProfile {
  None = 'None',
  JUMO = 'JUMO',
}

export class DataConnection extends ConfigurationEntity {
  public DataSourceId: Field<string>;
  public Type: Field<DataConnectionType>;
  public Settings: DataConnectionTypedSettings;
  public SpecialDeviceProfile: Field<DataConnectionSpecialDeviceProfile>;
  public PollingInterval: Field<number | null>;

  constructor() {
    super();

    this.DataSourceId = new Field<string>(null);
    this.Type = new Field<DataConnectionType>(null);
    this.Settings = null;
    this.SpecialDeviceProfile = new Field<DataConnectionSpecialDeviceProfile>(DataConnectionSpecialDeviceProfile.None);
    this.PollingInterval = new Field<number | null>(null);
  }
}

export abstract class DataConnectionTypedSettings {
  public _t: string;

  constructor(typeName?: string) {
    this._t = typeName ?? this.constructor.name;
  }
}

export class DataConnectionS7Settings extends DataConnectionTypedSettings {
  public Host: Field<string>;
  public Port: Field<number>;
  public Rack: Field<number>;
  public Slot: Field<number>;
  public Timeout: Field<number>;
  public LocalTSAP: Field<string>;
  public RemoteTSAP: Field<string>;

  constructor() {
    super('DataConnectionS7Settings');
    this.Host = new Field<string>(null);
    this.Port = new Field<number>(502);
    this.Rack = new Field<number>(0);
    this.Slot = new Field<number>(2);
    this.Timeout = new Field<number>(5000);
    this.LocalTSAP = new Field<string>(null);
    this.RemoteTSAP = new Field<string>(null);
  }
}

export enum DataConnectionOpcUaSecurityPolicy {
  None = 'None',
  Basic128Rsa15 = 'Basic128Rsa15',
  Basic256 = 'Basic256',
  Basic256Sha256 = 'Basic256Sha256',
}

export enum DataConnectionOpcUaSecurityMode {
  None = 'None',
  Sign = 'Sign',
  SignAndEncrypt = 'SignAndEncrypt',
}

export enum DataConnectionOpcUaSecurityAuthentication {
  Anonymous = 'Anonymous',
  Credentials = 'Credentials',
  Certificate = 'Certificate',
}

export enum DataConnectionOpcUaStringEncoding {
  ASCII = 'ASCII',
  UTF7 = 'UTF7',
  UTF8 = 'UTF8',
  Unicode = 'Unicode',
  UTF32 = 'UTF32',
}

export enum DataConnectionOpcUaTimestampSource {
  Connection = 'Connection',
  EdgeGateway = 'EdgeGateway',
}

export class DataConnectionOpcUaSettings extends DataConnectionTypedSettings {
  public Url: Field<string>;
  public SecurityPolicy: Field<DataConnectionOpcUaSecurityPolicy>;
  public SecurityMode: Field<DataConnectionOpcUaSecurityMode>;
  public SecurityAuthentication: Field<DataConnectionOpcUaSecurityAuthentication>;
  public Username: Field<string>;
  public Password: Field<string>;
  public Certificate: Field<string>;
  public PrivateKey: Field<string>;
  public PublishingInterval: Field<number>;
  public SamplingInterval: Field<number>;
  public QueueSize: Field<number>;
  public Timeout: Field<number>;
  public StringEncoding: Field<DataConnectionOpcUaStringEncoding>;
  public TimestampSource: Field<DataConnectionOpcUaTimestampSource>;

  constructor() {
    super('DataConnectionOpcUaSettings');
    this.Url = new Field<string>(null);
    this.SecurityPolicy = new Field<DataConnectionOpcUaSecurityPolicy>(DataConnectionOpcUaSecurityPolicy.None);
    this.SecurityMode = new Field<DataConnectionOpcUaSecurityMode>(DataConnectionOpcUaSecurityMode.None);
    this.SecurityAuthentication = new Field<DataConnectionOpcUaSecurityAuthentication>(DataConnectionOpcUaSecurityAuthentication.Anonymous);
    this.Username = new Field<string>(null);
    this.Password = new Field<string>(null);
    this.Certificate = new Field<string>(null);
    this.PrivateKey = new Field<string>(null);
    this.PublishingInterval = new Field<number>(1000);
    this.SamplingInterval = new Field<number>(1000);
    this.QueueSize = new Field<number>(-1);
    this.Timeout = new Field<number>(5000);
    this.StringEncoding = new Field<DataConnectionOpcUaStringEncoding>(DataConnectionOpcUaStringEncoding.UTF8);
    this.TimestampSource = new Field<DataConnectionOpcUaTimestampSource>(DataConnectionOpcUaTimestampSource.Connection);
  }
}

export class DataConnectionModbusSettings extends DataConnectionTypedSettings {
  public Host: Field<string>;
  public Port: Field<number>;

  constructor() {
    super('DataConnectionModbusSettings');
    this.Host = new Field<string>(null);
    this.Port = new Field<number>(502);
  }
}

export class DataConnectionIEC104Settings extends DataConnectionTypedSettings {
  public Host: Field<string>;
  public Port: Field<number>;
  public OriginatorAddress: Field<number>;
  public TimeSyncInterval: Field<number>;
  public GeneralInterrogationInterval: Field<number>;
  public CounterInterrogationInterval: Field<number>;
  public CommonAddressFieldLength: Field<number>;
  public CotFieldLength: Field<number>;
  public IoaFieldLength: Field<number>;
  public MaxIdleTime: Field<number>;
  public MaxTimeNoAckReceived: Field<number>;
  public MaxTimeNoAckSent: Field<number>;
  public MaxUnconfirmedIPdusReceived: Field<number>;
  public MaxNumOfOutstandingIPdus: Field<number>;
  public MessageFragmentTimeout: Field<number>;

  constructor() {
    super('DataConnectionIEC104Settings');
    this.Host = new Field<string>(null);
    this.Port = new Field<number>(2404);
    this.OriginatorAddress = new Field<number>(0);
    this.TimeSyncInterval = new Field<number>(720);
    this.GeneralInterrogationInterval = new Field<number>(60);
    this.CounterInterrogationInterval = new Field<number>(60);
    this.CommonAddressFieldLength = new Field<number>(2);
    this.CotFieldLength = new Field<number>(2);
    this.IoaFieldLength = new Field<number>(3);
    this.MaxIdleTime = new Field<number>(20000);
    this.MaxTimeNoAckReceived = new Field<number>(15000);
    this.MaxTimeNoAckSent = new Field<number>(10000);
    this.MaxUnconfirmedIPdusReceived = new Field<number>(8);
    this.MaxNumOfOutstandingIPdus = new Field<number>(12);
    this.MessageFragmentTimeout = new Field<number>(5000);
  }
}

export class DataConnectionBacnetSettings extends DataConnectionTypedSettings {
  public Port: Field<number>;
  public Interface: Field<string>;
  public BroadcastAddress: Field<string>;
  public ApduTimeout: Field<number>;

  constructor() {
    super('DataConnectionBacnetSettings');
    this.Port = new Field<number>(47808);
    this.Interface = new Field<string>(null);
    this.BroadcastAddress = new Field<string>(null);
    this.ApduTimeout = new Field<number>(6000);
  }
}

export class DataConnectionSimulationSettings extends DataConnectionTypedSettings {
  public ScriptPath: Field<string>;
  public ScriptCycle: Field<number>;

  constructor() {
    super('DataConnectionSimulationSettings');
    this.ScriptPath = new Field<string>(null);
    this.ScriptCycle = new Field<number>(500);
  }
}

export class DataConnectionUniversalSettings extends DataConnectionTypedSettings {
  public DriverPath: Field<string>;

  constructor() {
    super('DataConnectionUniversalSettings');
    this.DriverPath = new Field<string>(null);
  }
}

export class DataConnectionKnxSettings extends DataConnectionTypedSettings {
  public Host: Field<string>;
  public Port: Field<number | null>;
  public Interface: Field<string>;
  public PhysicalAddress: Field<string>;
  public ForceTunneling: Field<boolean>;
  public MinimumDelay: Field<number | null>;
  public SuppressAckLDataReq: Field<boolean>;

  constructor() {
    super('DataConnectionKnxSettings');
    this.Host = new Field<string>(null);
    this.Port = new Field<number | null>(null);
    this.Interface = new Field<string>(null);
    this.PhysicalAddress = new Field<string>('15.15.15');
    this.ForceTunneling = new Field<boolean>(false);
    this.MinimumDelay = new Field<number | null>(null);
    this.SuppressAckLDataReq = new Field<boolean>(false);
  }
}

export class DataConnectionIot2000ModuleSettings extends DataConnectionTypedSettings {
  public MLFB: Field<string>;

  constructor() {
    super('DataConnectionIot2000ModuleSettings');
    this.MLFB = new Field<string>(null);
  }
}

export class DataConnectionEhWebserverSettings extends DataConnectionTypedSettings {
  public Host: Field<string>;
  public AccessCode: Field<string>;

  constructor() {
    super('DataConnectionEhWebserverSettings');
    this.Host = new Field<string>(null);
    this.AccessCode = new Field<string>('0000');
  }
}

export class DataConnectionSnmpSettings extends DataConnectionTypedSettings {
  public Host: Field<string>;
  public Port: Field<number>;
  public Timeout: Field<number>;
  public Community: Field<string>;

  constructor() {
    super('DataConnectionSnmpSettings');
    this.Host = new Field<string>(null);
    this.Port = new Field<number>(161);
    this.Timeout = new Field<number>(5000);
    this.Community = new Field<string>(null);
  }
}

export class DataConnectionModemInfoSettings extends DataConnectionTypedSettings {
  constructor() {
    super('DataConnectionModemInfoSettings');
  }
}

export class DataConnectionMqttSettings extends DataConnectionTypedSettings {
  public Url: Field<string>;
  public Username: Field<string>;
  public Password: Field<string>;

  constructor() {
    super('DataConnectionMqttSettings');
    this.Url = new Field<string>(null);
    this.Username = new Field<string>(null);
    this.Password = new Field<string>(null);
  }
}

export class DataConnectionOneWireSettings extends DataConnectionTypedSettings {
  public Host: Field<string>;
  public Port: Field<number>;

  constructor() {
    super('DataConnectionOneWireSettings');
    this.Host = new Field<string>('localhost');
    this.Port = new Field<number>(4304);
  }
}

export enum MeterBusMode {
  serial = 'serial',
  tcp = 'tcp',
}

export class DataConnectionMeterBusSettings extends DataConnectionTypedSettings {
  public Mode: Field<MeterBusMode>;
  public HostOrSerialPort: Field<string>;
  public Port: Field<number>;
  public BaudRate: Field<number>;
  public Timeout: Field<number>;

  constructor() {
    super('DataConnectionMeterBusSettings');
    this.Mode = new Field<MeterBusMode>(MeterBusMode.tcp);
    this.HostOrSerialPort = new Field<string>(null);
    this.Port = new Field<number>(0);
    this.BaudRate = new Field<number>(2400);
    this.Timeout = new Field<number>(5000);
  }
}

export class DataConnectionMtmAdapterSettings extends DataConnectionTypedSettings {
  public TimeoutTime: Field<number>;
  public KeepAliveTime: Field<number>;
  public Username: Field<string>;
  public Password: Field<string>;

  constructor() {
    super('DataConnectionMtmAdapterSettings');
    this.TimeoutTime = new Field<number>(120);
    this.KeepAliveTime = new Field<number>(null);
    this.Username = new Field<string>(null);
    this.Password = new Field<string>(null);
  }
}

export class DataConnectionYDOCDataLoggerSettings extends DataConnectionTypedSettings {
  public DeviceId: Field<string>;
  public Username: Field<string>;
  public Password: Field<string>;

  constructor() {
    super('DataConnectionYDOCDataLoggerSettings');
    this.DeviceId = new Field<string>(null);
    this.Username = new Field<string>(null);
    this.Password = new Field<string>(null);
  }
}

export class DataConnectionOTTDataLoggerSettings extends DataConnectionTypedSettings {
  public Station: Field<string>;
  public Password: Field<string>;

  constructor() {
    super('DataConnectionOTTDataLoggerSettings');
    this.Station = new Field<string>(null);
    this.Password = new Field<string>(null);
  }
}

export class DataConnectionTeltonikaGPSSettings extends DataConnectionTypedSettings {
  public Address: Field<string>;

  constructor() {
    super('DataConnectionTeltonikaGPSSettings');
    this.Address = new Field<string>(null);
  }
}

export class DataConnectionLoRaWANSettings extends DataConnectionTypedSettings {
  public DeviceType: Field<string>;
  public DeviceEUI: Field<string>;
  public DeviceConfiguration: Field<string>;

  constructor() {
    super('DataConnectionLoRaWANSettings');
    this.DeviceType = new Field<string>(null);
    this.DeviceEUI = new Field<string>(null);
    this.DeviceConfiguration = new Field<string>(null);
  }
}

export class DataConnectionCsvImporterSettings extends DataConnectionTypedSettings {
  public Address: Field<string>;

  constructor() {
    super('DataConnectionCsvImporterSettings');
    this.Address = new Field<string>(null);
  }
}

export class DataConnectionFtpParserSettings extends DataConnectionTypedSettings {
  public ParserType: Field<string>;
  public ConnectionType: Field<string>;
  public Address: Field<string>;
  public Port: Field<number>;
  public Username: Field<string>;
  public Password: Field<string>;
  public ValidateCertificate: Field<boolean>;
  public FileDirectory: Field<string>;
  public EncryptionMode: Field<string>;
  public RequestInterval: Field<number>;
  public DeleteReadFiles: Field<boolean>;

  constructor() {
    super('DataConnectionFtpParserSettings');
    this.ParserType = new Field<string>(null);
    this.ConnectionType = new Field<string>(null);
    this.Address = new Field<string>(null);
    this.Port = new Field<number>(21);
    this.Username = new Field<string>(null);
    this.Password = new Field<string>(null);
    this.ValidateCertificate = new Field<boolean>(false);
    this.FileDirectory = new Field<string>(null);
    this.EncryptionMode = new Field<string>(null);
    this.RequestInterval = new Field<number>(0);
    this.DeleteReadFiles = new Field<boolean>(false);
  }
}

export { DataConnectionTypedSettings as DataConnectionSettings };
