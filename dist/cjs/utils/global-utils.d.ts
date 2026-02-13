import { Awaitable } from './async-value-utils.js';
export declare function tryCatch<T>(value: Awaitable<T>): Promise<[Error, null] | [null, T]>;
export declare function isNullOrUndefined(value: any): value is null | undefined;
export declare function isNullOrEmpty(value: string | any[] | null | undefined): boolean;
export declare function isNullOrWhitespace(value: string | null | undefined): boolean;
