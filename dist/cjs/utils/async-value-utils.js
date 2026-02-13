"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAsyncValueAsPromise = void 0;
const rxjs_1 = require("rxjs");
function getAsyncValueAsPromise(value) {
    if (typeof value === 'function') {
        return getAsyncValueAsPromise(value());
    }
    else if ((0, rxjs_1.isObservable)(value)) {
        return (0, rxjs_1.firstValueFrom)(value);
    }
    else {
        return Promise.resolve(value);
    }
}
exports.getAsyncValueAsPromise = getAsyncValueAsPromise;
