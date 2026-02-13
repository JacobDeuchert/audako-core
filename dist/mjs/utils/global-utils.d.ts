import { Awaitable } from './async-value-utils.js';
export declare function tryCatch<T>(value: Awaitable<T>): Promise<[Error, null] | [null, T]>;
