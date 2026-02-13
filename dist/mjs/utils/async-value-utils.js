import { firstValueFrom, isObservable } from 'rxjs';
import { PromiseUtils } from './promise-utils.js';
export function getAsyncValueAsPromise(value) {
    if (typeof value === 'function') {
        return getAsyncValueAsPromise(value());
    }
    else if (PromiseUtils.isPromise(value)) {
        return Promise.resolve(value);
    }
    else if (isObservable(value)) {
        return firstValueFrom(value);
    }
    else {
        return Promise.resolve(value);
    }
}
