import { Observable } from 'rxjs';
import { HttpConfig } from '../models/http-config.model';
import { BaseHttpService } from './base-http.service';
export declare class DataSourceHttpService extends BaseHttpService {
    constructor(httpConfig: HttpConfig, accessToken: string | Observable<string>);
    sendDatSrcConfiguration(dataSourceId: string): Promise<void>;
    private _getDriverUrl;
}
