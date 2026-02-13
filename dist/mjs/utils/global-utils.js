var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function tryCatch(value) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return [null, yield Promise.resolve(value)];
        }
        catch (error) {
            return [error, null];
        }
    });
}
export function isNullOrUndefined(value) {
    return value === null || value === undefined;
}
export function isNullOrEmpty(value) {
    return isNullOrUndefined(value) || value.length === 0;
}
export function isNullOrWhitespace(value) {
    return isNullOrUndefined(value) || value.trim().length === 0;
}
