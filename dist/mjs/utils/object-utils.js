export class ObjectUtils {
    static isValidMongoId(id) {
        const mongoRegex = /^[0-9a-fA-F]{24}$/;
        return mongoRegex.test(id);
    }
}
