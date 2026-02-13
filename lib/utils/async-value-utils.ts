import { firstValueFrom, isObservable, Observable } from 'rxjs';

export type Awaitable<T> = T | PromiseLike<T>;
export type Streamable<T> = Observable<T>;
export type Lazy<T> = () => T;
export type AsyncValue<T> = Awaitable<T> | Streamable<T> | Lazy<Awaitable<T> | Streamable<T>>;

export function getAsyncValueAsPromise<T>(value: AsyncValue<T>): Promise<T> {
  if (typeof value === 'function') {
    return getAsyncValueAsPromise((value as () => T | PromiseLike<T> | Observable<T>)());
  } else if (isObservable(value)) {
    return firstValueFrom<T>(value as Observable<T>);
  } else {
    return Promise.resolve(value);
  }
}
