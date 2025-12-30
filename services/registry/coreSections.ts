/**
 * Core Section Type Registration
 * Registers all built-in infographic section types
 */

import { registerSectionType } from './sectionRegistry';
import { TextSection } from '../../components/Visuals';
import { StatHighlight } from '../../components/Visuals';
import { ChartSection } from '../../components/Visuals';
import { ProcessFlow } from '../../components/Visuals';
import { ComparisonSection } from '../../components/Visuals';

/**
 * Register all core section types
 * Call this during app initialization
 */
export function registerCoreSectionTypes(): void {
  // Text Section
  registerSectionType({
    type: 'text',
    displayName: 'Text',
    category: 'content',
    component: TextSection,
    requiredFields: [],
    optionalFields: ['content'],
    forbiddenFields: ['data', 'steps', 'statValue', 'statLabel', 'statTrend', 'comparisonItems'],
  });

  // Stat Highlight Section
  registerSectionType({
    type: 'stat_highlight',
    displayName: 'Stat Highlight',
    category: 'chart',
    component: StatHighlight,
    requiredFields: ['statValue', 'statLabel'],
    optionalFields: ['content', 'statTrend'],
    forbiddenFields: ['data', 'steps', 'comparisonItems'],
  });

  // Bar Chart Section
  registerSectionType({
    type: 'bar_chart',
    displayName: 'Bar Chart',
    category: 'chart',
    component: ChartSection,
    requiredFields: ['data'],
    optionalFields: ['content'],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  // Pie Chart Section
  registerSectionType({
    type: 'pie_chart',
    displayName: 'Pie Chart',
    category: 'chart',
    component: ChartSection,
    requiredFields: ['data'],
    optionalFields: ['content'],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  // Process Flow Section
  registerSectionType({
    type: 'process_flow',
    displayName: 'Process Flow',
    category: 'sequence',
    component: ProcessFlow,
    requiredFields: ['steps'],
    optionalFields: [],
    forbiddenFields: ['data', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  // Comparison Section
  registerSectionType({
    type: 'comparison',
    displayName: 'Comparison',
    category: 'comparison',
    component: ComparisonSection,
    requiredFields: ['comparisonItems'],
    optionalFields: ['content'],
    forbiddenFields: ['data', 'steps', 'statValue', 'statLabel', 'statTrend'],
  });
}

/**
 * Get dynamic section schema for LLM providers
 * Returns the current enum values for all registered types
 */
export function getDynamicSectionSchema(): string[] {
  const { sectionRegistry } = require('./sectionRegistry');
  return sectionRegistry.getTypeNames();
}
