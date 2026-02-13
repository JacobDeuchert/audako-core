import { Awaitable } from './async-value-utils.js';

export async function tryCatch<T>(value: Awaitable<T>): Promise<[Error, null] | [null, T]> {
  try {
    return [null, await Promise.resolve(value)];
  } catch (error) {
    return [error as Error, null];
  }
}

export function isNullOrUndefined(value: any): value is null | undefined {
  return value === null || value === undefined;
}

export function isNullOrEmpty(value: string | any[] | null | undefined): boolean {
  return isNullOrUndefined(value) || value.length === 0;
}

export function isNullOrWhitespace(value: string | null | undefined): boolean {
  return isNullOrUndefined(value) || value.trim().length === 0;
}