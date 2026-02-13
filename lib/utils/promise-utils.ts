export class PromiseUtils {
  public static isPromise<T>(value: any): value is PromiseLike<T> {
    return value && typeof value.then === 'function';
  }
}