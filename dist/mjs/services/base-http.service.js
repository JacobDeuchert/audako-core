import axios from 'axios';
import { Observable } from 'rxjs';
export class BaseHttpService {
    constructor(httpConfig, accessToken) {
        this.httpConfig = httpConfig;
        if (accessToken instanceof Observable) {
            accessToken.subscribe((token) => (this.accessToken = token));
        }
        else {
            this.accessToken = accessToken;
        }
    }
    getAuthorizationHeader() {
        return {
            Authorization: `Bearer ${this.accessToken}`,
        };
    }
    getStructureUrl() {
        return `${this.httpConfig.Services.BaseUri}${this.httpConfig.Services.Structure}`;
    }
    static requestHttpConfig(systemUrl) {
        return axios
            .get(`${systemUrl}/assets/conf/application.config`)
            .then((response) => response.data);
    }
}
