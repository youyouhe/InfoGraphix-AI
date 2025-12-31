export * from './locales';
export * from './translations';

// Re-export commonly used types and functions
export type { Language, UILanguage } from './locales';
export { getInitialUILanguage, saveUILanguage } from './locales';
