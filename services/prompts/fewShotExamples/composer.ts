import { CategoryExamples, SubCategory } from './types';
import { SEQUENCE_EXAMPLES } from './sequence';
import { COMPARISON_EXAMPLES } from './comparison';
import { LIST_GRID_EXAMPLES } from './listGrid';
import { CHART_EXAMPLES } from './chart';
import { HIERARCHY_EXAMPLES } from './hierarchy';
import { QUADRANT_EXAMPLES } from './quadrant';
import { RELATION_EXAMPLES } from './relation';
import { BASIC_EXAMPLES } from './basic';

/**
 * All category examples
 */
const ALL_CATEGORIES: CategoryExamples[] = [
  SEQUENCE_EXAMPLES,
  COMPARISON_EXAMPLES,
  LIST_GRID_EXAMPLES,
  CHART_EXAMPLES,
  HIERARCHY_EXAMPLES,
  QUADRANT_EXAMPLES,
  RELATION_EXAMPLES,
  BASIC_EXAMPLES,
];

/**
 * Configuration for few-shot composition
 */
export interface ComposerConfig {
  /**
   * Number of examples to select per category.
   * Default: 1 (select 1 random example from each category)
   */
  examplesPerCategory?: number;

  /**
   * Specific categories to include. If not provided, uses all categories.
   */
  categories?: Array<'sequence' | 'comparison' | 'listGrid' | 'chart' | 'hierarchy' | 'quadrant' | 'relation' | 'basic'>;

  /**
   * Seed for reproducible random selection (useful for testing)
   * If not provided, uses random selection.
   */
  seed?: number;
}

/**
 * Composed few-shot result
 */
export interface ComposedFewShot {
  /** Combined few-shot JSON structure */
  data: {
    infographic_gallery_few_shot: CategoryExamples[];
  };
  /** Count of total examples selected */
  totalExamples: number;
  /** Categories included */
  categoriesIncluded: string[];
}

/**
 * Select a random subcategory from a category
 */
function selectRandomSubcategory(
  category: CategoryExamples,
  config: ComposerConfig
): SubCategory[] {
  const count = config.examplesPerCategory || 1;
  const subcategories = category.sub_categories;

  // Simple random selection
  const selected: SubCategory[] = [];
  const available = [...subcategories];
  const selections = Math.min(count, available.length);

  for (let i = 0; i < selections; i++) {
    const randomIndex = Math.floor(Math.random() * available.length);
    selected.push(available[randomIndex]);
    available.splice(randomIndex, 1);
  }

  return selected;
}

/**
 * Compose a few-shot prompt by selecting random examples from each category
 *
 * @param config - Configuration for selection
 * @returns Composed few-shot data
 */
export function composeFewShot(config: ComposerConfig = {}): ComposedFewShot {
  let categories = ALL_CATEGORIES;
  const categoriesIncluded: string[] = [];

  // Filter categories if specified
  if (config.categories && config.categories.length > 0) {
    const categoryMap: Record<string, CategoryExamples> = {
      sequence: SEQUENCE_EXAMPLES,
      comparison: COMPARISON_EXAMPLES,
      listGrid: LIST_GRID_EXAMPLES,
      chart: CHART_EXAMPLES,
      hierarchy: HIERARCHY_EXAMPLES,
      quadrant: QUADRANT_EXAMPLES,
      relation: RELATION_EXAMPLES,
      basic: BASIC_EXAMPLES,
    };

    categories = config.categories.map(c => categoryMap[c]).filter(Boolean) as CategoryExamples[];
  }

  // Select random subcategory from each category
  const composedCategories: CategoryExamples[] = [];
  let totalExamples = 0;

  for (const category of categories) {
    const selectedSubcategories = selectRandomSubcategory(category, config);
    composedCategories.push({
      category: category.category,
      sub_categories: selectedSubcategories,
    });
    categoriesIncluded.push(category.category);
    totalExamples += selectedSubcategories.length;
  }

  return {
    data: {
      infographic_gallery_few_shot: composedCategories,
    },
    totalExamples,
    categoriesIncluded,
  };
}

/**
 * Format composed few-shot as a string for inclusion in prompts
 */
export function formatComposedFewShot(composed: ComposedFewShot): string {
  return JSON.stringify(composed.data, null, 2);
}

/**
 * Get a quick few-shot string (ready to use in prompts)
 * This is the main function you'll use in practice.
 */
export function getFewShotPrompt(config?: ComposerConfig): string {
  const composed = composeFewShot(config);
  return formatComposedFewShot(composed);
}

/**
 * Get syntax for a specific example_id from few-shot examples
 * @param exampleId - The example_id to look up
 * @returns The syntax string or null if not found
 */
export function getSyntaxForExampleId(exampleId: string): string | null {
  for (const category of ALL_CATEGORIES) {
    for (const sub of category.sub_categories) {
      if (sub.example_id === exampleId) {
        return sub.syntax;
      }
    }
  }
  return null;
}

// Export all category data for direct access if needed
export const CATEGORY_DATA = {
  sequence: SEQUENCE_EXAMPLES,
  comparison: COMPARISON_EXAMPLES,
  listGrid: LIST_GRID_EXAMPLES,
  chart: CHART_EXAMPLES,
  hierarchy: HIERARCHY_EXAMPLES,
  quadrant: QUADRANT_EXAMPLES,
  relation: RELATION_EXAMPLES,
  basic: BASIC_EXAMPLES,
};
