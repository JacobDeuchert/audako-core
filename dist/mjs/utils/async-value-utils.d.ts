import { Observable } from 'rxjs';
export type AsyncValue<T> = T | Promise<T> | Observable<T>;
export declare function getAsyncValueAsPromise<T>(value: AsyncValue<T>): Promise<T>;
