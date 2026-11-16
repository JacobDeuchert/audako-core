/**
 * Translatable text of a model that is not a `ConfigurationEntity` (currently the tenant's
 * `Name`/`Description`): a plain `{ Value, Translations }` pair, without the `OOAttributes` of
 * {@link TranslatableField}. `Value` is the author's own text, `Translations` maps a BCP-47
 * language (`de-DE`, `en-GB`, ...) to its translation.
 *
 * v4 and older v5 builds send these texts as plain strings; {@link TranslatableText.from} wraps them.
 */
export class TranslatableText {
  public Value: string;
  public Translations: { [language: string]: string };

  constructor(value = '', translations: { [language: string]: string } = {}) {
    this.Value = value;
    this.Translations = translations;
  }

  /**
   * Normalizes a wire value: a plain string (v4, pre-translation v5) becomes a text without
   * translations, `null`/`undefined` an empty text, an object is copied with missing parts filled.
   */
  public static from(value: TranslatableText | string | null | undefined): TranslatableText {
    if (value === null || value === undefined) {
      return new TranslatableText();
    }
    if (typeof value === 'string') {
      return new TranslatableText(value);
    }
    return new TranslatableText(value.Value ?? '', { ...value.Translations });
  }

  /**
   * Display text for `language`: its non-empty translation, else `Value`. Same rule the audako UI
   * uses for tenant texts (no fallback to another language). Tolerates plain strings.
   */
  public static resolve(text: TranslatableText | string | null | undefined, language?: string | null): string {
    if (text === null || text === undefined) {
      return '';
    }
    if (typeof text === 'string') {
      return text;
    }
    const translation = language ? text.Translations?.[language] : undefined;
    return translation || text.Value || '';
  }
}
