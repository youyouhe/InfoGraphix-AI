/**
 * Chart components - Index
 * Exports all chart-related visual components
 */

// Original components
export { ChartSection } from './ChartSection';
export { LineChart } from './LineChart';
export { AreaChart } from './AreaChart';

// Backward compatibility aliases
export { LineChart as ChartLinePlain } from './LineChart';

// ========================================
// NEW ENHANCED CHART COMPONENTS
// ========================================

// RadialBarChart (3 variants)
export {
  RadialBarChart,
  RadialBarSimple,
  RadialBarGauge,
  RadialBarStacked,
} from './RadialBarChart';

// RadarChart (3 variants)
export {
  RadarChart,
  RadarSimple,
  RadarFilled,
  RadarComparison,
} from './RadarChart';

// ScatterChart (4 variants)
export {
  ScatterChart,
  ScatterSimple,
  ScatterBubble,
  ScatterMultiSeries,
  ScatterShape,
} from './ScatterChart';

// Enhanced BarChart (5 variants)
export {
  EnhancedBarChart,
  BarSimple,
  BarStacked,
  BarHorizontal,
  BarPercent,
  BarRounded,
} from './EnhancedBarChart';

// Enhanced PieChart (5 variants)
export {
  EnhancedPieChart,
  PieSimple,
  PieDonut,
  PieInteractive,
  PieLabel,
  PieRose,
} from './EnhancedPieChart';

// Enhanced AreaChart (4 variants)
export {
  EnhancedAreaChart,
  AreaSimple,
  AreaStacked,
  AreaPercent,
  AreaGradient,
} from './EnhancedAreaChart';

// Enhanced LineChart (5 variants)
export {
  EnhancedLineChart,
  LineSimple,
  LineSmooth,
  LineMultiSeries,
  LineStep,
  LineDashed,
} from './EnhancedLineChart';
