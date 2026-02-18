/**
 * Supported languages for LLM output (9 languages including bilingual)
 */
export type Language = 'en' | 'zh' | 'ja' | 'ko' | 'es' | 'fr' | 'de' | 'pt' | 'bilingual';

/**
 * UI language - only for interface translations (en/zh only)
 */
export type UILanguage = 'en' | 'zh';

export interface LanguageInfo {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

// All languages supported for LLM output
export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
  { code: 'bilingual', name: 'Bilingual', nativeName: 'English + 中文', flag: '🌐' },
];

export const DEFAULT_LANGUAGE: Language = 'en';
export const DEFAULT_UI_LANGUAGE: UILanguage = 'en';

/**
 * Get UI language from localStorage or browser settings (only en/zh for UI)
 */
export function getInitialUILanguage(): UILanguage {
  if (typeof window === 'undefined') return DEFAULT_UI_LANGUAGE;

  // 1. Check localStorage
  const saved = localStorage.getItem('infographix_ui_language') as UILanguage;
  if (saved === 'en' || saved === 'zh') {
    return saved;
  }

  // 2. Check browser language
  const browserLang = navigator.language.split('-')[0] as UILanguage;
  if (browserLang === 'en' || browserLang === 'zh') {
    return browserLang;
  }

  return DEFAULT_UI_LANGUAGE;
}

/**
 * Save UI language to localStorage
 */
export function saveUILanguage(language: UILanguage): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('infographix_ui_language', language);
  }
}

/**
 * Get output language from localStorage or browser settings (all 8 languages for LLM)
 */
export function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;

  // 1. Check localStorage
  const saved = localStorage.getItem('infographix_language') as Language;
  if (saved && SUPPORTED_LANGUAGES.some(l => l.code === saved)) {
    return saved;
  }

  // 2. Check browser language
  const browserLang = navigator.language.split('-')[0] as Language;
  if (SUPPORTED_LANGUAGES.some(l => l.code === browserLang)) {
    return browserLang;
  }

  return DEFAULT_LANGUAGE;
}

/**
 * Save language to localStorage
 */
export function saveLanguage(language: Language): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('infographix_language', language);
  }
}
