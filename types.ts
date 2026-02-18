export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

/**
 * Bilingual text type for English and Chinese
 */
export type BilingualText = string | { en: string; zh: string };

/**
 * Bilingual data point for charts
 */
export type BilingualDataPoint = {
  name: BilingualText;
  value: number;
  [key: string]: BilingualText | number;
};

/**
 * Helper to get text from BilingualText
 */
export function getBilingualText(text: BilingualText, lang: 'en' | 'zh'): string {
  if (typeof text === 'string') {
    return text;
  }
  return text[lang] || text.en || '';
}

/**
 * Helper to check if text is bilingual
 */
export function isBilingualText(text: BilingualText): text is { en: string; zh: string } {
  return typeof text === 'object' && text !== null && 'en' in text && 'zh' in text;
}

/**
 * Section type is now a string for dynamic type registration
 * Core types are registered in services/registry/sectionRegistry.ts
 * Use `registerSectionType()` to add new types at runtime
 */
export type SectionType = string;

/**
 * Display mode for infographic report
 */
export type DisplayMode = 'scroll-vertical' | 'scroll-horizontal' | 'pagination';

/**
 * Core section type constants for backwards compatibility
 */
export const CoreSectionTypes = {
  TEXT: 'text',
  STAT_HIGHLIGHT: 'stat_highlight',
  BAR_CHART: 'bar_chart',
  PIE_CHART: 'pie_chart',
  PROCESS_FLOW: 'process_flow',
  COMPARISON: 'comparison',
} as const;

/**
 * Legacy enum values for backwards compatibility
 * @deprecated Use CoreSectionTypes constants instead
 */
export const LegacySectionType = {
  TEXT: 'text',
  STAT_HIGHLIGHT: 'stat_highlight',
  BAR_CHART: 'bar_chart',
  PIE_CHART: 'pie_chart',
  PROCESS_FLOW: 'process_flow',
  COMPARISON: 'comparison',
} as const;

export interface InfographicSection {
  type: SectionType;  // Now a flexible string type
  title?: BilingualText;
  content?: BilingualText; // For text
  data?: ChartDataPoint[] | BilingualDataPoint[] | any; // For charts - support both old and new formats
  statValue?: BilingualText; // For highlights
  statLabel?: BilingualText; // For highlights
  statTrend?: 'up' | 'down' | 'neutral'; // For highlights
  steps?: { step: number; title: BilingualText; description: BilingualText }[]; // For process flow
  comparisonItems?: { left: BilingualText; right: BilingualText; label: BilingualText }[]; // For comparison

  // Extension fields for custom section types
  [key: string]: any;
}

export interface InfographicReport {
  title: BilingualText;
  summary: BilingualText;
  sections: InfographicSection[];
  sources?: { title: BilingualText; uri: string }[];
}

export interface HistoryItem {
  id: string;
  query: string;
  timestamp: number;
  report?: InfographicReport;
  language?: 'en' | 'zh' | 'bilingual';  // Track which language was used
}
