import { firstValueFrom, isObservable, Observable } from 'rxjs';
import { PromiseUtils } from './promise-utils.js';

type Awaitable<T> = T | PromiseLike<T>;
type Streamable<T> = Observable<T>;
type Lazy<T> = () => T;
export type AsyncValue<T> = Awaitable<T> | Streamable<T> | Lazy<Awaitable<T> | Streamable<T>>;

export function getAsyncValueAsPromise<T>(value: AsyncValue<T>): Promise<T> {
  if (typeof value === 'function') {
    return getAsyncValueAsPromise((value as () => T | Promise<T> | Observable<T>)());
  } else if (PromiseUtils.isPromise<T>(value)) {
    return Promise.resolve(value);
  } else if (isObservable(value)) {
    return firstValueFrom<T>(value as Observable<T>);
  } else {
    return Promise.resolve(value);
  }
}
