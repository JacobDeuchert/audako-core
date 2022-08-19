import axios from 'axios';
import { Observable } from 'rxjs';
import { EntityType } from '../models/entities/configuration-entity.model';
import { CompressionInterval, HistoricalValueMap } from '../models/historical-value.model';
import { HttpConfig } from '../models/http-config.model';
import { BaseHttpService } from './base-http.service';

export type HistoricalValueRequest = {
  ObjectType: EntityType.Signal | EntityType.Formula,
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

export class HistoricalValueService extends BaseHttpService {
  constructor(httpConfig: HttpConfig, accessToken: string | Promise<string>) {
    super(httpConfig, accessToken);
  }

  public async requestHistoricalValues(requests: HistoricalValueRequest[]): Promise<HistoricalValueMap[]> {   
    
    const url = `${this.httpConfig.Services.BaseUri}${this.httpConfig.Services.Historian}/value/manyflat`;

    const response = await axios.post<HistoricalValueMap[]>(url, requests, {
      headers: this.getAuthorizationHeader()
    });

    if (response.status !== 200) {
      throw new Error(response.statusText);
    }

    return response.data;
  }
}