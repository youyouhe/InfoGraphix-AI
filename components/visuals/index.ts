/**
 * Visuals components - Main Index
 * Exports all visual components organized by category
 */

// Shared types and utilities
export type { VisualProps, HierarchyNode } from './shared/types';
export { CustomTooltip, DataPlaceholder, COLORS } from './shared/shared';

// Chart components (original + enhanced)
export {
  ChartSection,
  LineChart,
  AreaChart,
  ChartLinePlain,
  // RadialBar (3 variants)
  RadialBarChart,
  RadialBarSimple,
  RadialBarGauge,
  RadialBarStacked,
  // Radar (3 variants)
  RadarChart,
  RadarSimple,
  RadarFilled,
  RadarComparison,
  // Scatter (4 variants)
  ScatterChart,
  ScatterSimple,
  ScatterBubble,
  ScatterMultiSeries,
  ScatterShape,
  // Enhanced Bar (5 variants)
  EnhancedBarChart,
  BarSimple,
  BarStacked,
  BarHorizontal,
  BarPercent,
  BarRounded,
  // Enhanced Pie (5 variants)
  EnhancedPieChart,
  PieSimple,
  PieDonut,
  PieInteractive,
  PieLabel,
  PieRose,
  // Enhanced Area (4 variants)
  EnhancedAreaChart,
  AreaSimple,
  AreaStacked,
  AreaPercent,
  AreaGradient,
  // Enhanced Line (5 variants)
  EnhancedLineChart,
  LineSimple,
  LineSmooth,
  LineMultiSeries,
  LineStep,
  LineDashed,
} from './charts';

// Sequence components
export {
  SequenceTimeline,
  SequenceSteps,
  SequenceCircular,
  SequenceRoadmap,
  SequenceSnake,
  SequenceZigzagUnderline,
  SequenceAscending,
  SequenceHorizontalZigzag,
} from './sequence';

// List components
export {
  ListGrid,
  ListRow,
  ListColumn,
  ListSector,
  ListCircularProgress,
  ListRibbonCard,
  ListPyramid,
  ListZigzag,
  ListCandyCard,
  ListSectorEnhanced,
} from './list';

// Comparison components
export {
  CompareBinary,
  SWOTAnalysis,
  CompareProsCons,
  CompareScoreCard,
  CompareTriple,
  CompareFeatureTable,
  CompareTimeline,
  CompareMetricGauge,
  CompareCardStack,
} from './comparison';

// Hierarchy components
export {
  HierarchyTree,
  RelationCircle,
  RelationCircularProgress,
  HierarchyMindmap,
  HierarchyCapsule,
  HierarchyBadge,
  HierarchyRibbon,
  HierarchyCircleProgress,
} from './hierarchy';

// Quadrant components
export {
  QuadrantCircular,
  QuadrantIllustrated,
  QuadrantMatrix,
} from './quadrant';

// Other components
export {
  TextSection,
  StatHighlight,
  ProcessFlow,
  QuadrantQuarterCard,
  ComparisonSection,
} from './other';
