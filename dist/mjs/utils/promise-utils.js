export class PromiseUtils {
    static isPromise(value) {
        return value && typeof value.then === 'function';
    }
}
