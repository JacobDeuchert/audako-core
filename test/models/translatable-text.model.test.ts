import { describe, expect, it } from 'vitest';
import { TranslatableText } from '../../lib/models/translatable-text.model.js';

describe('TranslatableText', () => {
  const text = new TranslatableText('Anlage', { 'en-GB': 'Plant', 'fr-FR': '' });

  it('resolves the translation of the language', () => {
    expect(TranslatableText.resolve(text, 'en-GB')).toBe('Plant');
  });

  it('falls back to Value for a missing or empty translation', () => {
    expect(TranslatableText.resolve(text, 'es-ES')).toBe('Anlage');
    expect(TranslatableText.resolve(text, 'fr-FR')).toBe('Anlage');
    expect(TranslatableText.resolve(text)).toBe('Anlage');
  });

  it('tolerates plain strings and null', () => {
    expect(TranslatableText.resolve('Plant', 'de-DE')).toBe('Plant');
    expect(TranslatableText.resolve(null, 'de-DE')).toBe('');
  });

  it('normalizes partial objects', () => {
    expect(TranslatableText.from({ Value: 'x' } as any)).toEqual({ Value: 'x', Translations: {} });
    expect(TranslatableText.from({ Translations: { 'en-GB': 'y' } } as any)).toEqual({
      Value: '',
      Translations: { 'en-GB': 'y' },
    });
  });
});
