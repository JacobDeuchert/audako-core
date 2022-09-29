import { Observable } from 'rxjs';
export declare type AsyncValue<T> = T | Promise<T> | Observable<T>;
export declare function getAsyncValueAsPromise<T>(value: AsyncValue<T>): Promise<T>;
