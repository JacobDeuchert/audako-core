import axios from 'axios';
import { CompressionInterval, HistoricalValueMap, ValueObjectType } from '../models/historical-value.model.js';
import { HttpConfig } from '../models/http-config.model.js';
import { BaseHttpService } from './base-http.service.js';


export type HistoricalValueRequest = {
  ObjectType: ValueObjectType,
  ObjectId: string,

  IntervalType: CompressionInterval,
  MinMaxInterval?: CompressionInterval,

  From: Date | string,
  Till: Date | string,

  Timezone: string,
  ConvertBackToUtc: boolean,

  IntervalRound?: boolean,
  WithoutOffset?: boolean,
}

export interface ManualDataRequest {
  IntervalType: CompressionInterval;
  Note: string;
  ObjectId: string;
  ObjectType: ValueObjectType;
  Timestamp: Date;
  Timezone: string;
  Value: string;
}

export interface NthHistoricalRequest {
  Count: number;
  ObjectType: ValueObjectType;
  ObjectId: string;
  IntervalType: CompressionInterval;
  Timestamp: Date;
  Timezone: string;
}

export class HistoricalValue {
  IntervalStart: string;
  Value?: any;
  Manual?: any;
  Note?: string;

  [propName: string]: any;
}

export class CounterOffset {
  Date: string;
  Value: number;
}

export class HistoricalValueObject {
  ObjectType: ValueObjectType;
  ObjectId: string;
  IntervalType: CompressionInterval;
  Values: HistoricalValue[];
}



export class HistoricalValueService extends BaseHttpService {
  constructor(httpConfig: HttpConfig, accessToken: string | Promise<string>) {
    super(httpConfig, accessToken);
  }

  public async requestHistoricalValues(requests: HistoricalValueRequest[]): Promise<HistoricalValueMap[]> {   
    
    const url = `${this.httpConfig.Services.BaseUri}${this.httpConfig.Services.Historian}/value/manyflat`;
    const headers = await this.getAuthorizationHeader()

    const response = await axios.post<HistoricalValueMap[]>(url, requests, {
      headers: headers
    });

    if (response.status !== 200) {
      throw new Error(response.statusText);
    }

    return response.data;
  }

  public async getHistoricalValueObjects(historicalValueRequest: HistoricalValueRequest[]): Promise<HistoricalValueObject[]> {
    const url = this.getUrl();
    const authHeaders = await this.getAuthorizationHeader();
    return axios.post<HistoricalValueObject[]>(url + '/value/many', historicalValueRequest, {headers: authHeaders}).then(response => response.data);
  }

  public async getNearestValue(historicalValueRequest: HistoricalValueRequest): Promise<HistoricalValue & {Value: number}> {
    const url = this.getUrl();
    const authHeaders = await this.getAuthorizationHeader();
    return axios.post<HistoricalValue & {Value: number}>(url + '/value/nearest', historicalValueRequest, {headers: authHeaders}).then(response => response.data);
  }


  public async getNthHistoricalValue(request: NthHistoricalRequest): Promise<HistoricalValueObject> {
    const url = this.getUrl();
    const authHeaders = await this.getAuthorizationHeader();
    return axios.post<HistoricalValueObject>(url + '/value/nth', request, {
      headers: authHeaders
    }).then(response => response.data);
  }

  private getUrl(): string {
   return `${this.httpConfig.Services.BaseUri}${this.httpConfig.Services.Historian}`;
  }


}