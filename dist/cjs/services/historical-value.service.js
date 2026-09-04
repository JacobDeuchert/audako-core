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
exports.HistoricalValueService = exports.HistoricalValueObject = exports.CounterOffset = exports.OffsetSource = exports.HistoricalValue = void 0;
const historical_value_adapter_v4_js_1 = require("../compat/adapters/historical-value.adapter.v4.js");
const base_http_service_js_1 = require("./base-http.service.js");
class HistoricalValue {
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
exports.HistoricalValue = HistoricalValue;
var OffsetSource;
(function (OffsetSource) {
    OffsetSource["Manual"] = "Manual";
    OffsetSource["CounterReplacement"] = "CounterReplacement";
    OffsetSource["CounterReadingAlignment"] = "CounterReadingAlignment";
})(OffsetSource || (exports.OffsetSource = OffsetSource = {}));
class CounterOffset {
}
exports.CounterOffset = CounterOffset;
class HistoricalValueObject {
}
exports.HistoricalValueObject = HistoricalValueObject;
class HistoricalValueService extends base_http_service_js_1.BaseHttpService {
    /**
     * Flat-row value query. v4: `POST {historian}/value/manyflat`,
     * v5: `POST {historian}/historical-values/query-many-flat`.
     */
    requestHistoricalValues(requests) {
        return __awaiter(this, void 0, void 0, function* () {
            const endpoint = yield this.resolve({ name: 'historicalValuesQueryManyFlat' });
            const response = yield this.ctx.http.post(endpoint.url, requests);
            if (response.status !== 200) {
                throw new Error(response.statusText);
            }
            return response.data;
        });
    }
    /**
     * Packaged value query. v4: `POST {historian}/value/many`,
     * v5: `POST {historian}/historical-values/query-many`.
     */
    getHistoricalValueObjects(historicalValueRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const [endpoint, versionInfo] = yield Promise.all([
                this.resolve({ name: 'historicalValuesQueryMany' }),
                this.getVersionInfo(),
            ]);
            const response = yield this.ctx.http.post(endpoint.url, historicalValueRequest);
            const packages = Array.isArray(response.data) ? response.data : [];
            return packages.map((valuePackage) => (0, historical_value_adapter_v4_js_1.measuredValuePackageFromWire)(valuePackage, versionInfo));
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
            const response = yield this.ctx.http.post(endpoint.url, historicalValueRequest);
            return (0, historical_value_adapter_v4_js_1.measuredValueFromWire)(response.data, versionInfo);
        });
    }
    getNthHistoricalValue(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const [endpoint, versionInfo] = yield Promise.all([
                this.resolve({ name: 'historicalValuesNth' }),
                this.getVersionInfo(),
            ]);
            const response = yield this.ctx.http.post(endpoint.url, request);
            return (0, historical_value_adapter_v4_js_1.measuredValuePackageFromWire)(response.data, versionInfo);
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
     * The body casing differs: v4 read camelCase, v5 PascalCase. Pass the canonical PascalCase
     * {@link SetCounterCustomOffsetRequest}; the v4 adapter re-cases it for the v4 wire.
     */
    setCustomOffset(id, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const [endpoint, versionInfo] = yield Promise.all([
                this.resolve({ name: 'counterOffsetsCustom', signalId: id }),
                this.getVersionInfo(),
            ]);
            yield this.ctx.http.post(endpoint.url, (0, historical_value_adapter_v4_js_1.customOffsetBodyToWire)(request, versionInfo));
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
}
exports.HistoricalValueService = HistoricalValueService;
