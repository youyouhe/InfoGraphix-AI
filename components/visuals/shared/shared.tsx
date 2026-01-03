/**
 * Shared components and utilities for visual components
 */

import React from 'react';
import { Activity, AlertCircle } from 'lucide-react';
import { TooltipProps } from './types';

// --- Chart Data Normalization ---
export interface NormalizedChartData {
  title?: string;
  desc?: string;
  items: Array<{ name: string; label: string; value: number; [key: string]: any }>;
}

/**
 * Normalizes chart data from different formats:
 * 1. Direct array: [{ name: "A", value: 10 }, ...]
 * 2. Object with items: { items: [{ label: "A", value: 10 }, ...] }
 * 3. Object with title: { title: "...", items: [...] }
 */
export function normalizeChartData(data: any): NormalizedChartData | null {
  if (!data) return null;

  // Case 1: Direct array
  if (Array.isArray(data)) {
    return {
      items: data.map(item => ({
        name: item.label || item.name,
        label: item.label || item.name,
        value: item.value ?? 0,
        ...item,
      })),
    };
  }

  // Case 2 & 3: Object with items property
  if (data.items && Array.isArray(data.items)) {
    return {
      title: data.title,
      desc: data.desc,
      items: data.items.map((item: any) => ({
        name: item.label || item.name,
        label: item.label || item.name,
        value: item.value ?? 0,
        ...item,
      })),
    };
  }

  return null;
}

// --- Colors ---
export const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6'];

// --- Custom Tooltip ---
export const CustomTooltip: React.FC<TooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const item = payload[0];
    const name = label || item.name || item.payload.name;
    const value = item.value;

    // Calculate percentage if we have access to total
    let percentage = '';
    if (payload.length > 1) {
      const total = payload.reduce((sum: number, p: any) => sum + (p.value || 0), 0);
      const pct = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
      percentage = <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">占比: {pct}%</p>;
    }

    return (
      <div className="bg-white/95 dark:bg-zinc-900/95 border border-zinc-200 dark:border-zinc-700 p-3 rounded-lg shadow-xl backdrop-blur-sm min-w-[120px]">
        <p className="text-zinc-500 dark:text-zinc-400 text-xs font-medium uppercase tracking-wider mb-1">{name}</p>
        <p className="text-zinc-900 dark:text-white font-bold text-lg">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
        {percentage}
      </div>
    );
  }
  return null;
};

// --- Data Placeholder Component ---
interface DataPlaceholderProps {
  isLoading: boolean;
  title?: string;
  content?: string;
  type: 'Chart' | 'Comparison' | 'Process';
}

export const DataPlaceholder: React.FC<DataPlaceholderProps> = ({ isLoading, title, content, type }) => {
  const typeIcons = {
    Chart: Activity,
    Comparison: AlertCircle,
    Process: Activity,
  };

  const Icon = typeIcons[type] || Activity;

  return (
    <div className="mb-8 p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-lg min-h-[300px] flex items-center justify-center relative">
      {title && <h3 className="text-lg font-bold text-gray-900 dark:text-white absolute top-6">{title}</h3>}

      {isLoading ? (
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">加载中...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <Icon size={32} className="text-zinc-300 dark:text-zinc-700" />
          <p className="text-zinc-400 dark:text-zinc-600 text-sm">暂无数据</p>
          {content && <p className="text-zinc-500 dark:text-zinc-500 text-xs italic max-w-md text-center">{content}</p>}
        </div>
      )}
    </div>
  );
};

// --- SVG Gradient Definitions for Charts ---
export const ChartGradients: React.FC = () => (
  <defs>
    {/* Bar Chart Gradient */}
    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.9} />
      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.3} />
    </linearGradient>

    {/* Area Chart Gradient */}
    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
    </linearGradient>

    {/* Line Chart Gradient */}
    <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
      <stop offset="100%" stopColor="#ec4899" stopOpacity={1} />
    </linearGradient>
  </defs>
);
