var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { customOffsetBodyToWire, measuredValueFromWire, measuredValuePackageFromWire, valueQueriesToWire, } from '../compat/adapters/historical-value.adapter.v4.js';
import { BaseHttpService } from './base-http.service.js';
export class HistoricalValue {
    static getSignalValues(historicalValuePackage) {
        const signalValues = [];
        Object.keys(historicalValuePackage).forEach((key) => {
            if (key !== 'IntervalStart' && key !== 'Manual' && key !== 'Note' && key !== 'Value') {
                signalValues.push({ id: key, value: historicalValuePackage[key] });
            }
        });
        return signalValues;
    }
}
export var OffsetSource;
(function (OffsetSource) {
    OffsetSource["Manual"] = "Manual";
    OffsetSource["CounterReplacement"] = "CounterReplacement";
    OffsetSource["CounterReadingAlignment"] = "CounterReadingAlignment";
})(OffsetSource || (OffsetSource = {}));
export class CounterOffset {
}
export class HistoricalValueObject {
}
/** True for the deprecated camelCase offset body. */
function isLegacyCustomOffsetRequest(request) {
    return (request === null || request === void 0 ? void 0 : request.timestamp) !== undefined;
}
export class HistoricalValueService extends BaseHttpService {
    constructor(httpConfigOrCtx, accessToken) {
        super(httpConfigOrCtx, accessToken);
    }
    /**
     * Flat-row value query. v4: `POST {historian}/value/manyflat`,
     * v5: `POST {historian}/historical-values/query-many-flat`.
     */
    requestHistoricalValues(requests) {
        return __awaiter(this, void 0, void 0, function* () {
            const [endpoint, body] = yield Promise.all([
                this.resolve({ name: 'historicalValuesQueryManyFlat' }),
                this.toValueQueries(requests),
            ]);
            const response = yield this.ctx.http.post(endpoint.url, body);
            if (response.status !== 200) {
                throw new Error(response.statusText);
            }
            return response.data;
        });
    }
    /**
     * @deprecated Duplicate of {@link requestHistoricalValues} - same endpoint, only the declared
     * return type differs. Use `requestHistoricalValues`.
     */
    getHistoricalValues(historicalValueRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const rows = yield this.requestHistoricalValues(historicalValueRequest);
            return rows;
        });
    }
    /**
     * Packaged value query. v4: `POST {historian}/value/many`,
     * v5: `POST {historian}/historical-values/query-many`.
     */
    getHistoricalValueObjects(historicalValueRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const [endpoint, body, versionInfo] = yield Promise.all([
                this.resolve({ name: 'historicalValuesQueryMany' }),
                this.toValueQueries(historicalValueRequest),
                this.getVersionInfo(),
            ]);
            const response = yield this.ctx.http.post(endpoint.url, body);
            const packages = Array.isArray(response.data) ? response.data : [];
            return packages.map((valuePackage) => measuredValuePackageFromWire(valuePackage, versionInfo));
        });
    }
    /**
     * Value closest to the requested timestamp.
     *
     * v5 answers with a full `MeasuredValue` (free-form `Value`, `Min*`/`Max*`, `Notes`), v4 with
     * the flat historical value. Both are normalized to {@link MeasuredValue}, so the declared
     * `Value: number` of the v4 signature is gone - check the type yourself if you need a number.
     */
    getNearestValue(historicalValueRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const [endpoint, versionInfo] = yield Promise.all([
                this.resolve({ name: 'historicalValuesNearest' }),
                this.getVersionInfo(),
            ]);
            const response = yield this.ctx.http.post(endpoint.url, valueQueriesToWire([historicalValueRequest], versionInfo)[0]);
            return measuredValueFromWire(response.data, versionInfo);
        });
    }
    /**
     * @deprecated Typo alias of {@link getNearestValue}.
     */
    getNearesValue(historicalValueRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getNearestValue(historicalValueRequest);
        });
    }
    getNthHistoricalValue(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const [endpoint, versionInfo] = yield Promise.all([
                this.resolve({ name: 'historicalValuesNth' }),
                this.getVersionInfo(),
            ]);
            const response = yield this.ctx.http.post(endpoint.url, request);
            return measuredValuePackageFromWire(response.data, versionInfo);
        });
    }
    postManualData(manualDataRequests) {
        return __awaiter(this, void 0, void 0, function* () {
            const endpoint = yield this.resolve({ name: 'historicalValuesManual' });
            yield this.ctx.http.post(endpoint.url, manualDataRequests);
        });
    }
    /** v4: `POST {historian}/value/note`, v5: `POST {historian}/historical-values/notes`. */
    postNoteEntries(noteEntryRequests) {
        return __awaiter(this, void 0, void 0, function* () {
            const endpoint = yield this.resolve({ name: 'historicalValuesNotes' });
            yield this.ctx.http.post(endpoint.url, noteEntryRequests);
        });
    }
    getCounterOffsets(id, from, till) {
        return __awaiter(this, void 0, void 0, function* () {
            const endpoint = yield this.resolve({ name: 'counterOffsets', signalId: id });
            const params = [];
            if (from) {
                params.push(`$from=${from.toISOString()}`);
            }
            if (till) {
                params.push(`$till=${till.toISOString()}`);
            }
            const url = params.length > 0 ? `${endpoint.url}?${params.join('&')}` : endpoint.url;
            const response = yield this.ctx.http.get(url);
            const offsets = response.data || {};
            return Object.keys(offsets).map((key) => ({
                Date: key,
                Value: offsets[key].Effective,
                Calculated: offsets[key].Calculated,
                Custom: offsets[key].Custom,
            }));
        });
    }
    /**
     * Sets the custom offset of a counter signal.
     *
     * The body casing differs: v4 read camelCase, v5 PascalCase. Pass the canonical
     * {@link SetCounterCustomOffsetRequest}; the deprecated camelCase
     * {@link SetCustomOffsetRequest} is still accepted and converted.
     */
    setCustomOffset(id, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const [endpoint, versionInfo] = yield Promise.all([
                this.resolve({ name: 'counterOffsetsCustom', signalId: id }),
                this.getVersionInfo(),
            ]);
            const canonical = isLegacyCustomOffsetRequest(request)
                ? {
                    Timestamp: request.timestamp,
                    Value: request.value,
                    Note: request.note,
                    Source: request.source,
                }
                : request;
            yield this.ctx.http.post(endpoint.url, customOffsetBodyToWire(canonical, versionInfo));
        });
    }
    deleteCounterOffsets(id, timestamps) {
        return __awaiter(this, void 0, void 0, function* () {
            const endpoint = yield this.resolve({ name: 'counterOffsetsRemove', signalId: id });
            yield this.ctx.http.post(endpoint.url, timestamps);
        });
    }
    deleteCustomOffsets(id, timestamps) {
        return __awaiter(this, void 0, void 0, function* () {
            const endpoint = yield this.resolve({ name: 'counterOffsetsCustomRemove', signalId: id });
            const response = yield this.ctx.http.post(endpoint.url, timestamps);
            return response.data;
        });
    }
    resetCalculatedValuesAndStatistic(signalId, resetOffsets, from = null, till = null, resetCustomOffsets = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const endpoint = yield this.resolve({ name: 'statisticsReset', signalId: signalId });
            const response = yield this.ctx.http.post(endpoint.url, {
                From: from ? from.toISOString() : null,
                Till: till ? till.toISOString() : null,
                ResetOffsets: resetOffsets,
                ResetCustomOffsets: resetCustomOffsets,
            });
            return response.data;
        });
    }
    /**
     * v4: `POST {historian}/historicalvalueimport/import`,
     * v5: `POST {historian}/historical-value-imports`.
     */
    importHistoricalValues(importData) {
        return __awaiter(this, void 0, void 0, function* () {
            const endpoint = yield this.resolve({ name: 'historicalValueImport' });
            const response = yield this.ctx.http.post(endpoint.url, { Values: importData });
            return response.data;
        });
    }
    /** Applies the per-version value query mapping (drops `MinMaxInterval` on v5). */
    toValueQueries(requests) {
        return __awaiter(this, void 0, void 0, function* () {
            const versionInfo = yield this.getVersionInfo();
            return valueQueriesToWire(requests, versionInfo);
        });
    }
}
