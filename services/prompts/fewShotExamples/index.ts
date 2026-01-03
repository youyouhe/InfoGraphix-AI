/**
 * Few-Shot Examples Module
 *
 * This module provides dynamic few-shot prompt composition for infographic generation.
 * Examples are organized by category, and random examples are selected from each category
 * to create varied, token-efficient prompts.
 *
 * @example
 * ```ts
 * import { getFewShotPrompt } from './fewShotExamples';
 *
 * // Get a random few-shot prompt with 1 example per category
 * const fewShot = getFewShotPrompt();
 *
 * // Or customize the selection
 * const customFewShot = getFewShotPrompt({
 *   examplesPerCategory: 2,
 *   categories: ['sequence', 'comparison', 'chart']
 * });
 * ```
 */

// Re-export types
export type {
  InfographicGalleryFewShot,
  GalleryCategory,
  SubCategory
} from './types';

// Re-export composer
export type {
  ComposerConfig,
  ComposedFewShot
} from './composer';

export {
  composeFewShot,
  formatComposedFewShot,
  getFewShotPrompt,
  CATEGORY_DATA
} from './composer';

// Re-export category data for direct access
export { SEQUENCE_EXAMPLES } from './sequence';
export { COMPARISON_EXAMPLES } from './comparison';
export { LIST_GRID_EXAMPLES } from './listGrid';
export { CHART_EXAMPLES } from './chart';
export { HIERARCHY_EXAMPLES } from './hierarchy';
export { QUADRANT_EXAMPLES } from './quadrant';
export { RELATION_EXAMPLES } from './relation';
export { BASIC_EXAMPLES } from './basic';

/**
 * Default export - get a random few-shot prompt
 */
export { getFewShotPrompt as default } from './composer';
