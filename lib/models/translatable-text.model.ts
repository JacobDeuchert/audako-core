/**
 * Platform language tag per bare language: the four languages entity and tenant texts are
 * translated into (the audako UI's AvailableEntityFieldLanguages).
 */
const PLATFORM_LANGUAGES: { [language: string]: string } = {
  de: 'de-DE',
  en: 'en-GB',
  fr: 'fr-FR',
  es: 'es-ES',
};

/**
 * Translation key for a locale. Translations are keyed by full tags (`de-DE`), while apps often
 * only know a bare language (`de`, from `<html lang>` or their own i18n): a full tag is returned as
 * is, a bare language is mapped onto its platform tag.
 */
export function toPlatformLanguage(locale: string | null | undefined): string {
  if (!locale) {
    return '';
  }
  const tag = locale.replace(/_/g, '-');
  return tag.includes('-') ? tag : (PLATFORM_LANGUAGES[tag.toLowerCase()] ?? tag);
}

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
   * uses for tenant texts (no fallback to another language). `language` may be a full tag
   * (`de-DE`) or a bare language (`de`, see {@link toPlatformLanguage}). Tolerates plain strings.
   */
  public static resolve(text: TranslatableText | string | null | undefined, language?: string | null): string {
    if (text === null || text === undefined) {
      return '';
    }
    if (typeof text === 'string') {
      return text;
    }
    const key = toPlatformLanguage(language);
    const translation = key ? text.Translations?.[key] : undefined;
    return translation || text.Value || '';
  }
}
