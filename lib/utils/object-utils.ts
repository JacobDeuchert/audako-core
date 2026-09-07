export class ObjectUtils {

  public static isValidMongoId(id: string): boolean {
    const mongoRegex = /^[0-9a-fA-F]{24}$/;
    return mongoRegex.test(id);
  }

  public static tryParseJson<T>(json: string, defaultValue: T | null = null): T | null {
    try {
      return JSON.parse(json);
    } catch (error) {
      return defaultValue;  
    }
  }
}