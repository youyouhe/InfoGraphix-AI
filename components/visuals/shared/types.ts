/**
 * Shared types for visual components
 */

import { InfographicSection } from '../../types';

export interface VisualProps {
  section: InfographicSection;
  isDark?: boolean;
  isLoading?: boolean;
}

export interface HierarchyNode {
  label: string;
  value?: number;
  icon?: string;
  children?: HierarchyNode[];
}

export interface ChartDataItem {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}
