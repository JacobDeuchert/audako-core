"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectUtils = void 0;
class ObjectUtils {
    static isValidMongoId(id) {
        const mongoRegex = /^[0-9a-fA-F]{24}$/;
        return mongoRegex.test(id);
    }
}
exports.ObjectUtils = ObjectUtils;
