import { firstValueFrom, isObservable, Observable } from 'rxjs';
import { PromiseUtils } from './promise-utils.js';

export type AsyncValue<T> = T | Promise<T> | Observable<T>;

export function getAsyncValueAsPromise<T>(value: AsyncValue<T>): Promise<T> {
  if (PromiseUtils.isPromise<T>(value)) {
    return value;
  } else if (isObservable(value)) {
    return firstValueFrom<T>(value as Observable<T>);
  } else {
    return Promise.resolve(value);
  }
}