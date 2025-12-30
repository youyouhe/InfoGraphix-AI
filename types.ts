export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
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
  title?: string;
  content?: string; // For text
  data?: ChartDataPoint[]; // For charts
  statValue?: string; // For highlights
  statLabel?: string; // For highlights
  statTrend?: 'up' | 'down' | 'neutral'; // For highlights
  steps?: { step: number; title: string; description: string }[]; // For process flow
  comparisonItems?: { left: string; right: string; label: string }[]; // For comparison

  // Extension fields for custom section types
  [key: string]: any;
}

export interface InfographicReport {
  title: string;
  summary: string;
  sections: InfographicSection[];
  sources?: { title: string; uri: string }[];
}

export interface HistoryItem {
  id: string;
  query: string;
  timestamp: number;
  report?: InfographicReport;
}
