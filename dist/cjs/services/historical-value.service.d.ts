import { Observable } from 'rxjs';
import { EntityType } from '../models/entities/configuration-entity.model';
import { CompressionInterval, HistoricalValueMap } from '../models/historical-value.model';
import { HttpConfig } from '../models/http-config.model';
import { BaseHttpService } from './base-http.service';
export declare type HistoricalValueRequest = {
    ObjectType: EntityType.Signal | EntityType.Formula;
    ObjectId: string;
    IntervalType: CompressionInterval;
    MinMaxInterval?: CompressionInterval;
    From: Date | string;
    Till: Date | string;
    Timezone: string;
    ConvertBackToUtc: boolean;
    IntervalRound?: boolean;
    WithoutOffset?: boolean;
};
export declare class HistoricalValueService extends BaseHttpService {
    constructor(httpConfig: HttpConfig, accessToken: string | Observable<string>);
    requestHistoricalValues(requests: HistoricalValueRequest[]): Promise<HistoricalValueMap[]>;
}
