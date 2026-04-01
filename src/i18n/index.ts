import { en } from './langs/en';
import { es } from './langs/es';

export type Language = 'en' | 'es';

export const translations = {
  en,
  es
} as const;

export function t(key: string, lang: Language = 'en', variables: Record<string, string | number> = {}): string {
  const langTranslations = translations[lang] as Record<string, string>;
  const enTranslations = translations['en'] as Record<string, string>;
  
  let text = langTranslations[key] || enTranslations[key] || key;
  
  Object.entries(variables).forEach(([k, v]) => {
    text = text.replace(`{${k}}`, String(v));
  });
  
  return text;
}
