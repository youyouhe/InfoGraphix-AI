
/**
 * Few-shot examples for infographic generation
 * Based on AntV Infographic syntax and SKILL.md specifications
 *
 * This file now serves as a re-export of the modular few-shot examples system.
 * The examples are organized by category in the fewShotExamples/ directory.
 *
 * @module fewShotExamples
 */

// Re-export types
export type {
  InfographicGalleryFewShot,
  GalleryCategory,
  SubCategory
} from './fewShotExamples/types';

// Re-export composer types
export type {
  ComposerConfig,
  ComposedFewShot
} from './fewShotExamples/composer';

// Re-export main functions
export {
  composeFewShot,
  formatComposedFewShot,
  getFewShotPrompt,
  CATEGORY_DATA
} from './fewShotExamples';

// Re-export category data
export { SEQUENCE_EXAMPLES } from './fewShotExamples/sequence';
export { COMPARISON_EXAMPLES } from './fewShotExamples/comparison';
export { LIST_GRID_EXAMPLES } from './fewShotExamples/listGrid';
export { CHART_EXAMPLES } from './fewShotExamples/chart';
export { HIERARCHY_EXAMPLES } from './fewShotExamples/hierarchy';
export { QUADRANT_EXAMPLES } from './fewShotExamples/quadrant';
export { RELATION_EXAMPLES } from './fewShotExamples/relation';
export { BASIC_EXAMPLES } from './fewShotExamples/basic';

/**
 * Backward compatibility: Re-export default as getFewShotPrompt
 */
export { default } from './fewShotExamples/index';

/**
 * Keyword to AntV Template mapping for intelligent template selection
 * Maps user intent keywords to specific template IDs defined in SKILL.md
 */
const KEYWORD_TEMPLATE_MAP: Record<string, string> = {
  // Sequence / Timeline
  'timeline': 'sequence-timeline-simple',
  'history': 'sequence-timeline-simple',
  'milestone': 'sequence-timeline-rounded-rect-node',
  'steps': 'sequence-zigzag-steps-underline-text',
  'process': 'sequence-zigzag-steps-underline-text',
  'flow': 'sequence-horizontal-zigzag-simple-illus',
  'roadmap': 'sequence-roadmap-vertical-simple',
  'cycle': 'sequence-circular-simple',
  'loop': 'sequence-circular-simple',

  // Comparison (基于自定义增强组件)
  'vs': 'compare-pros-cons',
  'compare': 'compare-pros-cons',
  'difference': 'compare-binary-fold',
  'pros': 'compare-pros-cons',
  'cons': 'compare-pros-cons',
  'swot': 'compare-swot',
  'score': 'compare-score-card',
  'rating': 'compare-score-card',
  'triple': 'compare-triple',
  'three-way': 'compare-triple',
  'feature': 'compare-feature-table',
  'timeline': 'compare-timeline',
  'before-after': 'compare-timeline',
  'improvement': 'compare-timeline',
  'kpi': 'compare-metric-gauge',
  'metric': 'compare-metric-gauge',
  'gauge': 'compare-metric-gauge',
  'stack': 'compare-card-stack',
  'card': 'compare-card-stack',

  // List / Grid
  'list': 'list-row-horizontal-icon-arrow',
  'features': 'list-row-horizontal-icon-arrow',
  'grid': 'list-grid-badge-card',
  'cards': 'list-grid-candy-card-lite',
  'collection': 'list-grid-ribbon-card',

  // Hierarchy
  'tree': 'hierarchy-tree-tech-style-capsule-item',
  'hierarchy': 'hierarchy-tree-curved-line-rounded-rect-node',
  'structure': 'hierarchy-tree-tech-style-badge-card',
  'org': 'hierarchy-tree-tech-style-capsule-item',

  // Charts (基于自定义增强组件)
  'bar': 'bar-simple',
  'column': 'bar-simple',
  'stack': 'bar-stacked',
  'horizontal': 'bar-horizontal',
  'percent': 'bar-percent',
  'pie': 'pie-simple',
  'donut': 'pie-donut',
  'line': 'line-simple',
  'trend': 'line-smooth',
  'growth': 'line-smooth',
  'area': 'area-simple',
  'cumulative': 'area-gradient',
  'radial': 'radial-bar-simple',
  'gauge': 'radial-bar-gauge',
  'kpi': 'radial-bar-gauge',
  'radar': 'radar-simple',
  'scatter': 'scatter-simple',
  'bubble': 'scatter-bubble',

  // Quadrant
  'quadrant': 'quadrant-quarter-simple-card',
  'matrix': 'quadrant-quarter-circular',
  'priority': 'quadrant-quarter-simple-card',

  // Relation
  'relation': 'relation-circle-icon-badge',
  'ecosystem': 'relation-circle-icon-badge',
  'surround': 'relation-circle-icon-badge',
  'around': 'relation-circle-circular-progress',
  'circular': 'relation-circle-circular-progress',
  'skill': 'relation-circle-circular-progress'
};

/**
 * Get recommended AntV template ID based on text keywords
 */
export function getTemplateByKeywords(text: string): string {
  const lowerText = text.toLowerCase();

  for (const [keyword, template] of Object.entries(KEYWORD_TEMPLATE_MAP)) {
    if (lowerText.includes(keyword.toLowerCase())) {
      return template;
    }
  }

  // Fallback defaults based on content type detection could go here
  return 'list-row-horizontal-icon-arrow';
}
