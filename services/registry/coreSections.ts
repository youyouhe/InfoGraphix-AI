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
import { SequenceTimeline, SequenceSteps, SequenceCircular, SequenceRoadmap } from '../../components/Visuals';
import { ListGrid, ListRow, ListColumn, ListSector } from '../../components/Visuals';
import { CompareBinary, SWOTAnalysis, CompareProsCons, CompareScoreCard, CompareTriple, CompareFeatureTable, CompareTimeline, CompareMetricGauge, CompareCardStack } from '../../components/Visuals';
import { ChartLinePlain, QuadrantQuarterCard, BarSimple, BarStacked, BarHorizontal, BarPercent, BarRounded, PieSimple, PieDonut, PieInteractive, PieLabel, PieRose, LineSimple, LineSmooth, LineMultiSeries, LineStep, LineDashed, AreaSimple, AreaStacked, AreaPercent, AreaGradient, RadialBarSimple, RadialBarGauge, RadialBarStacked, RadarSimple, RadarFilled, RadarComparison, ScatterSimple, ScatterBubble, ScatterMultiSeries, ScatterShape } from '../../components/Visuals';
import { RelationCircle } from '../../components/Visuals';
import { HierarchyTree } from '../../components/Visuals';

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

  // Compare Binary Section (using few-shot types)
  registerSectionType({
    type: 'compare-binary-horizontal-underline-text-vs',
    displayName: 'Binary Comparison VS',
    category: 'comparison',
    component: CompareBinary,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  registerSectionType({
    type: 'compare-binary-horizontal-badge-card-vs',
    displayName: 'Binary Badge Card VS',
    category: 'comparison',
    component: CompareBinary,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  registerSectionType({
    type: 'compare-binary-horizontal-compact-card-arrow',
    displayName: 'Binary Compact Arrow',
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

  registerSectionType({
    type: 'chart-bar-plain-text',
    displayName: 'Bar Chart Plain',
    category: 'chart',
    component: ChartLinePlain,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  registerSectionType({
    type: 'chart-pie-plain-text',
    displayName: 'Pie Chart Plain',
    category: 'chart',
    component: ChartSection,
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

  registerSectionType({
    type: 'quadrant-simple-illus',
    displayName: 'Quadrant Simple Illustration',
    category: 'quadrant',
    component: QuadrantQuarterCard,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  // List Sector
  registerSectionType({
    type: 'list-sector-plain-text',
    displayName: 'Sector List',
    category: 'list',
    component: ListSector,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  // Relation Circle
  registerSectionType({
    type: 'relation-circle-icon-badge',
    displayName: 'Relation Circle',
    category: 'relation',
    component: RelationCircle,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  registerSectionType({
    type: 'relation-circle-circular-progress',
    displayName: 'Relation Progress',
    category: 'relation',
    component: RelationCircle,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  // Sequence Roadmap
  registerSectionType({
    type: 'sequence-roadmap-vertical-simple',
    displayName: 'Roadmap',
    category: 'sequence',
    component: SequenceRoadmap,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  registerSectionType({
    type: 'sequence-horizontal-zigzag-underline-text',
    displayName: 'Zigzag Timeline',
    category: 'sequence',
    component: SequenceTimeline,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  // ========================================
  // HIERARCHY TYPES (12 types)
  // ========================================
  const hierarchyTypes = [
    'hierarchy-tree-tech-style-badge-card',
    'hierarchy-tree-tech-style-capsule-item',
    'hierarchy-tree-curved-line-rounded-rect-node',
    'hierarchy-tree-bt-curved-line-badge-card',
    'hierarchy-tree-bt-curved-line-compact-card',
    'hierarchy-tree-bt-curved-line-ribbon-card',
    'hierarchy-tree-bt-curved-line-rounded-rect-node',
    'hierarchy-tree-lr-curved-line-badge-card',
    'hierarchy-tree-rl-distributed-origin-rounded-rect-node',
    'hierarchy-mindmap-branch-gradient-capsule-item',
    'hierarchy-mindmap-branch-gradient-circle-progress',
    'hierarchy-mindmap-branch-gradient-compact-card',
  ];
  hierarchyTypes.forEach(type => {
    registerSectionType({
      type,
      displayName: type,
      category: 'hierarchy',
      component: HierarchyTree,
      requiredFields: ['data'],
      optionalFields: [],
      forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
    });
  });

  // ========================================
  // COMPARISON TYPES (7 types - missing + badge-card-vs)
  // ========================================
  const comparisonTypes = [
    'compare-binary-horizontal-simple-fold',
    'compare-binary-horizontal-compact-card-vs',
    'compare-binary-horizontal-underline-text-arrow',
    'compare-binary-horizontal-underline-text-fold',
    'compare-hierarchy-left-right-circle-node-pill-badge',
    'compare-hierarchy-left-right-circle-node-plain-text',
    'compare-hierarchy-row-letter-card-compact-card',
  ];
  comparisonTypes.forEach(type => {
    registerSectionType({
      type,
      displayName: type,
      category: 'comparison',
      component: CompareBinary,
      requiredFields: ['data'],
      optionalFields: [],
      forbiddenFields: ['steps', 'statValue', 'statLabel', 'statTrend'],
    });
  });

  // ========================================
  // LIST TYPES (10 types - missing)
  // ========================================
  registerSectionType({
    type: 'list-grid-candy-card-lite',
    displayName: 'Grid Candy Card',
    category: 'list',
    component: ListGrid,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  registerSectionType({
    type: 'list-grid-circular-progress',
    displayName: 'Grid Circular Progress',
    category: 'list',
    component: ListGrid,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  registerSectionType({
    type: 'list-grid-ribbon-card',
    displayName: 'Grid Ribbon Card',
    category: 'list',
    component: ListGrid,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  registerSectionType({
    type: 'list-pyramid-badge-card',
    displayName: 'Pyramid Badge Card',
    category: 'list',
    component: ListGrid,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  registerSectionType({
    type: 'list-pyramid-compact-card',
    displayName: 'Pyramid Compact Card',
    category: 'list',
    component: ListGrid,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  registerSectionType({
    type: 'list-row-circular-progress',
    displayName: 'Row Circular Progress',
    category: 'list',
    component: ListRow,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  registerSectionType({
    type: 'list-row-horizontal-icon-line',
    displayName: 'Row Icon Line',
    category: 'list',
    component: ListRow,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  registerSectionType({
    type: 'list-row-simple-illus',
    displayName: 'Row Simple Illustration',
    category: 'list',
    component: ListRow,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  registerSectionType({
    type: 'list-sector-half-plain-text',
    displayName: 'Sector Half Plain Text',
    category: 'list',
    component: ListSector,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  registerSectionType({
    type: 'list-zigzag-down-compact-card',
    displayName: 'Zigzag Down Compact Card',
    category: 'list',
    component: ListGrid,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  registerSectionType({
    type: 'list-zigzag-up-compact-card',
    displayName: 'Zigzag Up Compact Card',
    category: 'list',
    component: ListGrid,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  // ========================================
  // CHART TYPES (1 type - missing)
  // ========================================
  registerSectionType({
    type: 'chart-wordcloud',
    displayName: 'Word Cloud',
    category: 'chart',
    component: ChartSection,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  // ========================================
  // NEW COMPARISON TYPES (7 types)
  // ========================================
  registerSectionType({
    type: 'compare-pros-cons',
    displayName: 'Pros and Cons List',
    category: 'comparison',
    component: CompareProsCons,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  registerSectionType({
    type: 'compare-score-card',
    displayName: 'Score Card Comparison',
    category: 'comparison',
    component: CompareScoreCard,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  registerSectionType({
    type: 'compare-triple',
    displayName: 'Triple Comparison',
    category: 'comparison',
    component: CompareTriple,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  registerSectionType({
    type: 'compare-feature-table',
    displayName: 'Feature Table Comparison',
    category: 'comparison',
    component: CompareFeatureTable,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  registerSectionType({
    type: 'compare-timeline',
    displayName: 'Timeline Comparison',
    category: 'comparison',
    component: CompareTimeline,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  registerSectionType({
    type: 'compare-metric-gauge',
    displayName: 'Metric Gauge Comparison',
    category: 'comparison',
    component: CompareMetricGauge,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  registerSectionType({
    type: 'compare-card-stack',
    displayName: 'Card Stack Comparison',
    category: 'comparison',
    component: CompareCardStack,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  registerSectionType({
    type: 'compare-binary-fold',
    displayName: 'Binary Fold Comparison',
    category: 'comparison',
    component: CompareBinary,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  // ========================================
  // NEW CHART TYPES (29 variants)
  // ========================================
  // Bar Charts (5 variants)
  registerSectionType({
    type: 'bar-simple',
    displayName: 'Simple Bar Chart',
    category: 'chart',
    component: BarSimple,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  registerSectionType({
    type: 'bar-stacked',
    displayName: 'Stacked Bar Chart',
    category: 'chart',
    component: BarStacked,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  registerSectionType({
    type: 'bar-horizontal',
    displayName: 'Horizontal Bar Chart',
    category: 'chart',
    component: BarHorizontal,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  registerSectionType({
    type: 'bar-percent',
    displayName: 'Percent Bar Chart',
    category: 'chart',
    component: BarPercent,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  registerSectionType({
    type: 'bar-rounded',
    displayName: 'Rounded Bar Chart',
    category: 'chart',
    component: BarRounded,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  // Pie Charts (5 variants)
  registerSectionType({
    type: 'pie-simple',
    displayName: 'Simple Pie Chart',
    category: 'chart',
    component: PieSimple,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  registerSectionType({
    type: 'pie-donut',
    displayName: 'Donut Chart',
    category: 'chart',
    component: PieDonut,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  registerSectionType({
    type: 'pie-interactive',
    displayName: 'Interactive Pie Chart',
    category: 'chart',
    component: PieInteractive,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  registerSectionType({
    type: 'pie-label',
    displayName: 'Pie Chart with Labels',
    category: 'chart',
    component: PieLabel,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  registerSectionType({
    type: 'pie-rose',
    displayName: 'Rose Pie Chart',
    category: 'chart',
    component: PieRose,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  // Line Charts (5 variants)
  registerSectionType({
    type: 'line-simple',
    displayName: 'Simple Line Chart',
    category: 'chart',
    component: LineSimple,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  registerSectionType({
    type: 'line-smooth',
    displayName: 'Smooth Line Chart',
    category: 'chart',
    component: LineSmooth,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  registerSectionType({
    type: 'line-multi-series',
    displayName: 'Multi-Series Line Chart',
    category: 'chart',
    component: LineMultiSeries,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  registerSectionType({
    type: 'line-step',
    displayName: 'Step Line Chart',
    category: 'chart',
    component: LineStep,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  registerSectionType({
    type: 'line-dashed',
    displayName: 'Dashed Line Chart',
    category: 'chart',
    component: LineDashed,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  // Area Charts (4 variants)
  registerSectionType({
    type: 'area-simple',
    displayName: 'Simple Area Chart',
    category: 'chart',
    component: AreaSimple,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  registerSectionType({
    type: 'area-stacked',
    displayName: 'Stacked Area Chart',
    category: 'chart',
    component: AreaStacked,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  registerSectionType({
    type: 'area-percent',
    displayName: 'Percent Area Chart',
    category: 'chart',
    component: AreaPercent,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  registerSectionType({
    type: 'area-gradient',
    displayName: 'Gradient Area Chart',
    category: 'chart',
    component: AreaGradient,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  // Radial Bar Charts (3 variants)
  registerSectionType({
    type: 'radial-bar-simple',
    displayName: 'Simple Radial Bar Chart',
    category: 'chart',
    component: RadialBarSimple,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  registerSectionType({
    type: 'radial-bar-gauge',
    displayName: 'Radial Gauge Chart',
    category: 'chart',
    component: RadialBarGauge,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  registerSectionType({
    type: 'radial-bar-stacked',
    displayName: 'Stacked Radial Bar Chart',
    category: 'chart',
    component: RadialBarStacked,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  // Radar Charts (3 variants)
  registerSectionType({
    type: 'radar-simple',
    displayName: 'Simple Radar Chart',
    category: 'chart',
    component: RadarSimple,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  registerSectionType({
    type: 'radar-filled',
    displayName: 'Filled Radar Chart',
    category: 'chart',
    component: RadarFilled,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  registerSectionType({
    type: 'radar-comparison',
    displayName: 'Comparison Radar Chart',
    category: 'chart',
    component: RadarComparison,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  // Scatter Charts (4 variants)
  registerSectionType({
    type: 'scatter-simple',
    displayName: 'Simple Scatter Chart',
    category: 'chart',
    component: ScatterSimple,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  registerSectionType({
    type: 'scatter-bubble',
    displayName: 'Bubble Chart',
    category: 'chart',
    component: ScatterBubble,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  registerSectionType({
    type: 'scatter-multi-series',
    displayName: 'Multi-Series Scatter Chart',
    category: 'chart',
    component: ScatterMultiSeries,
    requiredFields: ['data'],
    optionalFields: [],
    forbiddenFields: ['steps', 'comparisonItems', 'statValue', 'statLabel', 'statTrend'],
  });

  registerSectionType({
    type: 'scatter-shape',
    displayName: 'Scatter Chart with Shapes',
    category: 'chart',
    component: ScatterShape,
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
