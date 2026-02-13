"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAsyncValueAsPromise = void 0;
const rxjs_1 = require("rxjs");
const promise_utils_js_1 = require("./promise-utils.js");
function getAsyncValueAsPromise(value) {
    if (typeof value === 'function') {
        return getAsyncValueAsPromise(value());
    }
    else if (promise_utils_js_1.PromiseUtils.isPromise(value)) {
        return Promise.resolve(value);
    }
    else if ((0, rxjs_1.isObservable)(value)) {
        return (0, rxjs_1.firstValueFrom)(value);
    }
    else {
        return Promise.resolve(value);
    }
}
exports.getAsyncValueAsPromise = getAsyncValueAsPromise;
