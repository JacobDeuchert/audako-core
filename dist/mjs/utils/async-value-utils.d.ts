import { Observable } from 'rxjs';
type Awaitable<T> = T | PromiseLike<T>;
type Streamable<T> = Observable<T>;
type Lazy<T> = () => T;
export type AsyncValue<T> = Awaitable<T> | Streamable<T> | Lazy<Awaitable<T> | Streamable<T>>;
export declare function getAsyncValueAsPromise<T>(value: AsyncValue<T>): Promise<T>;
export {};
