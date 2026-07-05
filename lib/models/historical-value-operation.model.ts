export enum HistoricalValueOperationStatus {
  Pending = 'Pending',
  Processing = 'Processing',
  Completed = 'Completed',
  Failed = 'Failed',
  Undone = 'Undone',
}

export interface HistoricalValueOperation {
  Id: string;
  SignalId: string;
  From: Date | string;
  Till: Date | string;
  Timezone: string;
  OperationScript: string;
  OperationDescription: string;
  Status: HistoricalValueOperationStatus;
  CreatedOn?: Date | string;
  CreatedBy?: string;
  ChangedOn?: Date | string;
  ChangedBy?: string;
}
