import axios from 'axios';
import {
  CompressionInterval,
  HistoricalValueMap,
  MeasurementValueSource,
  ValueObjectType,
} from '../models/historical-value.model.js';
import { HttpConfig } from '../models/http-config.model.js';
import { ValueEntityType } from '../models/widgets/shared.js';
import { AsyncValue, getAsyncValueAsPromise } from '../utils/async-value-utils.js';
import { BaseHttpService } from './base-http.service.js';


export type HistoricalValueRequest = {
  ObjectType: ValueObjectType | ValueEntityType | string,
  ObjectId: string,

  IntervalType: CompressionInterval | string,
  MinMaxInterval?: CompressionInterval,
  MinMaxIntervalType?: CompressionInterval | string,

  From: Date | string,
  Till: Date | string,

  Timezone: string,
  ConvertBackToUtc: boolean,

  IntervalRound?: boolean,
  WithoutOffset?: boolean,
}

export interface ManualDataRequest {
  IntervalType: CompressionInterval | string;
  Note: string;
  ObjectId: string;
  ObjectType: ValueObjectType | ValueEntityType | string;
  Timestamp: Date;
  Timezone: string;
  Value: string;
}

export interface NoteEntryRequest {
  IntervalType: CompressionInterval | string;
  Note: string;
  ObjectId: string;
  Timestamp: Date;
  Timezone: string;
}

export interface NthHistoricalRequest {
  Count: number;
  ObjectType: ValueObjectType | ValueEntityType;
  ObjectId: string;
  IntervalType: CompressionInterval;
  Timestamp: Date;
  Timezone: string;
}

export type NoteEntry = {
  Note: string;
  CreatedBy: string;
  Timestamp: string;
};

export type OperationStartedResponse = {
  OperationId: string;
};

export class HistoricalValue {
  IntervalStart: string;
  Value?: any;
  Manual?: any;
  Note?: string;
  CreatedBy?: string;
  Notes?: NoteEntry[];
  Source?: MeasurementValueSource;
  Status?: number;

  [propName: string]: any;

  static getSignalValues(historicalValuePackage: HistoricalValue): { id: string; value: any }[] {
    const signalValues = [];

    Object.keys(historicalValuePackage).forEach((key) => {
      if (key !== 'IntervalStart' && key !== 'Manual' && key !== 'Note' && key !== 'Value') {
        signalValues.push({ id: key, value: historicalValuePackage[key] });
      }
    });

    return signalValues;
  }
}

export enum OffsetSource {
  Manual = 'Manual',
  CounterReplacement = 'CounterReplacement',
  CounterReadingAlignment = 'CounterReadingAlignment',
}

export interface CustomOffsetView {
  Value: number;
  Source: OffsetSource;
  Author: string;
  Note: string | null;
  Created: string;
  Updated: string;
}

export interface OffsetView {
  Calculated: number | null;
  Custom: CustomOffsetView | null;
  Effective: number;
}

export interface SetCustomOffsetRequest {
  timestamp: string;
  value: number;
  note?: string | null;
  source: OffsetSource;
}

export class CounterOffset {
  Date: string;
  Value: number;
  Calculated: number | null;
  Custom: CustomOffsetView | null;
}

export class HistoricalValueObject {
  ObjectType: ValueObjectType | ValueEntityType | string;
  ObjectId: string;
  IntervalType: CompressionInterval;
  Values: HistoricalValue[];
}



export class HistoricalValueService extends BaseHttpService {
  constructor(httpConfig: AsyncValue<HttpConfig>, accessToken: AsyncValue<string>) {
    super(httpConfig, accessToken);
  }

  public async requestHistoricalValues(requests: HistoricalValueRequest[]): Promise<HistoricalValueMap[]> {   
    
    const url = await this.getHistorianUrl();
    ;
    const headers = await this.getAuthorizationHeader()

    const response = await axios.post<HistoricalValueMap[]>(`${url}/value/manyflat`, requests, {
      headers: headers
    });

    if (response.status !== 200) {
      throw new Error(response.statusText);
    }

    return response.data;
  }

  public async getHistoricalValues(historicalValueRequest: HistoricalValueRequest[]): Promise<HistoricalValue[]> {
    const url = await this.getHistorianUrl();
    const authHeaders = await this.getAuthorizationHeader();
    return axios.post<HistoricalValue[]>(url + '/value/manyflat', historicalValueRequest, {headers: authHeaders}).then(response => response.data);
  }

  public async getHistoricalValueObjects(historicalValueRequest: HistoricalValueRequest[]): Promise<HistoricalValueObject[]> {
    const url = await this.getHistorianUrl();
    const authHeaders = await this.getAuthorizationHeader();
    return axios.post<HistoricalValueObject[]>(url + '/value/many', historicalValueRequest, {headers: authHeaders}).then(response => response.data);
  }

  public async getNearestValue(historicalValueRequest: HistoricalValueRequest): Promise<HistoricalValue & {Value: number}> {
    const url = await this.getHistorianUrl();
    const authHeaders = await this.getAuthorizationHeader();
    return axios.post<HistoricalValue & {Value: number}>(url + '/value/nearest', historicalValueRequest, {headers: authHeaders}).then(response => response.data);
  }

  public async getNearesValue(historicalValueRequest: HistoricalValueRequest): Promise<HistoricalValue & {Value: number}> {
    return this.getNearestValue(historicalValueRequest);
  }


  public async getNthHistoricalValue(request: NthHistoricalRequest): Promise<HistoricalValueObject> {
    const url = await this.getHistorianUrl();
    const authHeaders = await this.getAuthorizationHeader();
    return axios.post<HistoricalValueObject>(url + '/value/nth', request, {
      headers: authHeaders
    }).then(response => response.data);
  }

  public async postManualData(manualDataRequests: ManualDataRequest[]): Promise<void> {
    const url = await this.getHistorianUrl();
    const authHeaders = await this.getAuthorizationHeader();
    return axios.post<void>(url + '/value/manual', manualDataRequests, {headers: authHeaders}).then();
  }

  public async postNoteEntries(noteEntryRequests: NoteEntryRequest[]): Promise<void> {
    const url = await this.getHistorianUrl();
    const authHeaders = await this.getAuthorizationHeader();
    return axios.post<void>(url + '/value/note', noteEntryRequests, {headers: authHeaders}).then();
  }

  public async getCounterOffsets(id: string, from?: Date, till?: Date): Promise<CounterOffset[]> {
    let url = `${await this.getHistorianUrl()}/value/counter/${id}/offsets?`;

    if (from) {
      url += `&$from=${from.toISOString()}`;
    }

    if (till) {
      url += `&$till=${till.toISOString()}`;
    }

    const authHeaders = await this.getAuthorizationHeader();
    return axios.get<{ [date: string]: OffsetView }>(url, {headers: authHeaders}).then(response =>
      Object.keys(response.data).map((key) => ({
        Date: key,
        Value: response.data[key].Effective,
        Calculated: response.data[key].Calculated,
        Custom: response.data[key].Custom,
      }))
    );
  }

  public async setCustomOffset(id: string, request: SetCustomOffsetRequest): Promise<void> {
    const url = `${await this.getHistorianUrl()}/value/counter/${id}/offsets/custom`;
    const authHeaders = await this.getAuthorizationHeader();
    return axios.post<void>(url, request, {headers: authHeaders}).then();
  }

  public async deleteCounterOffsets(id: string, timestamps: string[]): Promise<void> {
    const url = `${await this.getHistorianUrl()}/value/counter/${id}/offsets/remove`;
    const authHeaders = await this.getAuthorizationHeader();
    return axios.post<void>(url, timestamps, {headers: authHeaders}).then();
  }

  public async deleteCustomOffsets(id: string, timestamps: string[]): Promise<boolean> {
    const url = `${await this.getHistorianUrl()}/value/counter/${id}/offsets/custom/remove`;
    const authHeaders = await this.getAuthorizationHeader();
    return axios.post<boolean>(url, timestamps, {headers: authHeaders}).then(response => response.data);
  }

  public async resetCalculatedValuesAndStatistic(
    signalId: string,
    resetOffsets: boolean,
    from: Date | null = null,
    till: Date | null = null,
    resetCustomOffsets: boolean = false
  ): Promise<OperationStartedResponse> {
    const url = `${await this.getHistorianUrl()}/value/statistics/${signalId}/reset`;
    const authHeaders = await this.getAuthorizationHeader();
    return axios.post<OperationStartedResponse>(url, {
      From: from ? from.toISOString() : null,
      Till: till ? till.toISOString() : null,
      ResetOffsets: resetOffsets,
      ResetCustomOffsets: resetCustomOffsets,
    }, {headers: authHeaders}).then(response => response.data);
  }

  public async importHistoricalValues(importData: Record<string, any>[]): Promise<OperationStartedResponse> {
    const url = `${await this.getHistorianUrl()}/historicalvalueimport/import`;
    const authHeaders = await this.getAuthorizationHeader();
    return axios.post<OperationStartedResponse>(url, { Values: importData }, {headers: authHeaders}).then(response => response.data);
  }

  private async getHistorianUrl(): Promise<string> {

    const httpConfig = await getAsyncValueAsPromise(this.httpConfig)
   return `${httpConfig.Services.BaseUri}${httpConfig.Services.Historian}`;
  }


}
