import { ApiContext } from '../api/api-context.js';
import { HttpConfig } from '../models/http-config.model.js';
import { AsyncValue } from '../utils/async-value-utils.js';
import { BaseHttpService } from './base-http.service.js';
/**
 * One node of a data connection browse result. v5 types the response explicitly with lowercased
 * JSON names; v4 answered with the same shape but was declared `any`.
 */
export interface ConnectionBrowseItem {
    description?: string;
    address?: string;
    expandable?: boolean;
    selectable?: boolean;
}
export declare class DataConnectionBrowserService extends BaseHttpService {
    /**
     * @param ctx Context of the target system.
     */
    constructor(ctx: ApiContext);
    /**
     * @deprecated Pass an `ApiContext` instead.
     */
    constructor(httpConfig: AsyncValue<HttpConfig>, accessToken: AsyncValue<string>);
    /** `POST {driver}/command/conn/{id}/browse` with `{Path}`. Request identical on v4 and v5. */
    browseConnection(id: string, path: string): Promise<ConnectionBrowseItem[]>;
}
