import { firstValueFrom, isObservable } from 'rxjs';
export function getAsyncValueAsPromise(value) {
    if (typeof value === 'function') {
        return getAsyncValueAsPromise(value());
    }
    else if (isObservable(value)) {
        return firstValueFrom(value);
    }
    else {
        return Promise.resolve(value);
    }
}
