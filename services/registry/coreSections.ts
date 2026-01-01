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
import { SequenceTimeline, SequenceSteps, SequenceCircular } from '../../components/Visuals';
import { ListGrid, ListRow, ListColumn, CompareBinary, SWOTAnalysis, ChartColumnSimple, ChartLinePlain, QuadrantQuarterCard } from '../../components/Visuals';

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

  // Sequence Timeline Section
  registerSectionType({
    type: 'sequence-timeline-simple',
    displayName: 'Timeline',
    category: 'sequence',
    component: SequenceTimeline,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  // Sequence Steps Section (for multiple sequence-* types)
  registerSectionType({
    type: 'sequence-zigzag-steps-underline-text',
    displayName: 'Zigzag Steps',
    category: 'sequence',
    component: SequenceSteps,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  registerSectionType({
    type: 'sequence-ascending-steps',
    displayName: 'Ascending Steps',
    category: 'sequence',
    component: SequenceSteps,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  registerSectionType({
    type: 'sequence-snake-steps',
    displayName: 'Snake Steps',
    category: 'sequence',
    component: SequenceSteps,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  // List Grid Section
  registerSectionType({
    type: 'list-grid-badge-card',
    displayName: 'Grid Cards',
    category: 'list',
    component: ListGrid,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  // List Row Section
  registerSectionType({
    type: 'list-row-horizontal-icon-arrow',
    displayName: 'Row List',
    category: 'list',
    component: ListRow,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  registerSectionType({
    type: 'list-zigzag-down',
    displayName: 'Zigzag List',
    category: 'list',
    component: ListRow,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  // Compare Binary Section
  registerSectionType({
    type: 'compare-binary-horizontal',
    displayName: 'Binary Comparison',
    category: 'comparison',
    component: CompareBinary,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  registerSectionType({
    type: 'compare-swot',
    displayName: 'SWOT Analysis',
    category: 'comparison',
    component: SWOTAnalysis,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  // List Column Section
  registerSectionType({
    type: 'list-column-done-list',
    displayName: 'Checklist',
    category: 'list',
    component: ListColumn,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  registerSectionType({
    type: 'list-column-vertical-icon-arrow',
    displayName: 'Vertical List',
    category: 'list',
    component: ListColumn,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  registerSectionType({
    type: 'list-column-simple-vertical-arrow',
    displayName: 'Simple List',
    category: 'list',
    component: ListColumn,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  registerSectionType({
    type: 'list-row-simple-illus',
    displayName: 'Simple Row List',
    category: 'list',
    component: ListRow,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  registerSectionType({
    type: 'list-zigzag-up',
    displayName: 'Zigzag Up',
    category: 'list',
    component: ListRow,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  // Sequence Circular Section
  registerSectionType({
    type: 'sequence-circular-simple',
    displayName: 'Circular Process',
    category: 'sequence',
    component: SequenceCircular,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  // Chart Column Simple
  registerSectionType({
    type: 'chart-column-simple',
    displayName: 'Column Chart Simple',
    category: 'chart',
    component: ChartColumnSimple,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  registerSectionType({
    type: 'chart-line-plain-text',
    displayName: 'Line Chart',
    category: 'chart',
    component: ChartLinePlain,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  // Quadrant Quarter
  registerSectionType({
    type: 'quadrant-quarter-simple-card',
    displayName: 'Quadrant Card',
    category: 'quadrant',
    component: QuadrantQuarterCard,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  registerSectionType({
    type: 'quadrant-quarter-circular',
    displayName: 'Quadrant Circular',
    category: 'quadrant',
    component: QuadrantQuarterCard,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
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
