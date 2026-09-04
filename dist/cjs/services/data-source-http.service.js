"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataSourceHttpService = void 0;
const base_http_service_js_1 = require("./base-http.service.js");
class DataSourceHttpService extends base_http_service_js_1.BaseHttpService {
    /**
     * Tells the driver to (re-)configure a data source.
     *
     * Returns the started driver job on v5 and `null` on v4, which answers with an empty body.
     * (Until this change the driver URL was awaited nowhere, so the request went to
     * `[object Promise]/command/...` and could never work.)
     */
    sendDatSrcConfiguration(dataSourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const endpoint = yield this.resolve({ name: 'driverConfigureDataSource', dataSourceId: dataSourceId });
            const response = yield this.ctx.http.get(endpoint.url);
            const data = response.data;
            if (!data || typeof data !== 'object' || !data.JobId) {
                return null;
            }
            return { JobId: data.JobId, Timestamp: data.Timestamp };
        });
    }
}
exports.DataSourceHttpService = DataSourceHttpService;
