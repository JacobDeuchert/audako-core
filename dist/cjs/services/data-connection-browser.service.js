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
exports.DataConnectionBrowserService = void 0;
const base_http_service_js_1 = require("./base-http.service.js");
class DataConnectionBrowserService extends base_http_service_js_1.BaseHttpService {
    constructor(httpConfigOrCtx, accessToken) {
        super(httpConfigOrCtx, accessToken);
    }
    /** `POST {driver}/command/conn/{id}/browse` with `{Path}`. Request identical on v4 and v5. */
    browseConnection(id, path) {
        return __awaiter(this, void 0, void 0, function* () {
            const endpoint = yield this.resolve({ name: 'driverBrowseConnection', dataConnectionId: id });
            const response = yield this.ctx.http.request({
                method: endpoint.method,
                url: endpoint.url,
                data: { Path: path },
            });
            return response.data;
        });
    }
}
exports.DataConnectionBrowserService = DataConnectionBrowserService;
