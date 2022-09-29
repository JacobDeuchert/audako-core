import { firstValueFrom, isObservable } from 'rxjs';
import { PromiseUtils } from './promise-utils.js';
export function getAsyncValueAsPromise(value) {
    if (PromiseUtils.isPromise(value)) {
        return value;
    }
    else if (isObservable(value)) {
        return firstValueFrom(value);
    }
    else {
        return Promise.resolve(value);
    }
}
