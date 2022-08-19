"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromiseUtils = void 0;
class PromiseUtils {
    static isPromise(value) {
        return value && typeof value.then === 'function';
    }
}
exports.PromiseUtils = PromiseUtils;
