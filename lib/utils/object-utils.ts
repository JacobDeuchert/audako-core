export class ObjectUtils {

  public static isValidMongoId(id: string): boolean {
    const mongoRegex = /^[0-9a-fA-F]{24}$/;
    return mongoRegex.test(id);
  }

  public static tryParseJson<T>(json: string, defaultValue = null): T {
    try {
      return JSON.parse(json);
    } catch (error) {
      return defaultValue;  
    }
  }
}