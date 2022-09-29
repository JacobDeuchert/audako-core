import { HttpConfig } from '../models/http-config.model';
import { AsyncValue } from '../utils/async-value-utils.js';
import { BaseHttpService } from './base-http.service';
export declare class DataSourceHttpService extends BaseHttpService {
    constructor(httpConfig: AsyncValue<HttpConfig>, accessToken: AsyncValue<string>);
    sendDatSrcConfiguration(dataSourceId: string): Promise<void>;
    private _getDriverUrl;
}
