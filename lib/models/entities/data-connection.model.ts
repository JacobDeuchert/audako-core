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
}

export class DataConnection extends ConfigurationEntity {
  public DataSourceId: Field<string>;
  public Type: Field<DataConnectionType>;
  public Settings: DataConnectionSettings;
}

export class DataConnectionSettings {
  constructor(public _t: string) {

  }
}


export class DataConnectionS7Settings extends DataConnectionSettings {

  public Host: Field<string>;
  public Port: Field<number>;
  public Rack: Field<number>;
  public Slot: Field<number>;
  public Timeout: Field<number>;
  public LocalTSAP: Field<string>;
  public RemoteTSAP: Field<string>;

  constructor() {
    super('DataConnectionS7Settings');
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
  UTF7 = ' UTF7',
  UTF8 = 'UTF8',
  Unicode = 'Unicode',
  UTF32 = 'UTF32',
}


export class DataConnectionOpcUaSettings extends DataConnectionSettings {
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

  constructor() {
    super('DataConnectionOpcUaSettings');
  }
}
