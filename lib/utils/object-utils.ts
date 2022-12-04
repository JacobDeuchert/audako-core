export class ObjectUtils {

  public static isValidMongoId(id: string): boolean {
    const mongoRegex = /^[0-9a-fA-F]{24}$/;
    return mongoRegex.test(id);
  }
}