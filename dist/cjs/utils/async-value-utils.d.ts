import { Observable } from 'rxjs';
export type Awaitable<T> = T | PromiseLike<T>;
export type Streamable<T> = Observable<T>;
export type Lazy<T> = () => T;
export type AsyncValue<T> = Awaitable<T> | Streamable<T> | Lazy<Awaitable<T> | Streamable<T>>;
export declare function getAsyncValueAsPromise<T>(value: AsyncValue<T>): Promise<T>;
