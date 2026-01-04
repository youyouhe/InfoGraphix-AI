/**
 * EnhancedBarChart - BarChart with multiple style variants
 * Subtypes: Simple, Stacked, Horizontal, Percent, Rounded
 */

import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, Legend,
} from 'recharts';
import { VisualProps } from '../shared/types';
import { DataPlaceholder, CustomTooltip, COLORS, normalizeChartData } from '../shared/shared';

type BarStyle = 'simple' | 'stacked' | 'horizontal' | 'percent' | 'rounded';

export interface EnhancedBarChartProps extends VisualProps {
  style?: BarStyle;
}

export const EnhancedBarChart: React.FC<EnhancedBarChartProps> = ({
  section,
  isLoading = false,
  style = 'simple'
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = requestAnimationFrame(() => setIsMounted(true));
    return () => cancelAnimationFrame(timer);
  }, []);

  // Normalize chart data (handles both array and object formats)
  const chartData = normalizeChartData(section.data);

  if (!chartData?.items || chartData.items.length === 0) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="Chart" />;
  }

  const normalizedData = chartData.items;

  // Check for multi-series data
  const hasMultiSeries = normalizedData.some(item =>
    Object.keys(item).some(key => key !== 'name' && key !== 'label' && key !== 'value' && typeof item[key] === 'number')
  );

  const seriesKeys = hasMultiSeries
    ? Object.keys(normalizedData[0]).filter(k => k !== 'name' && k !== 'label' && typeof normalizedData[0][k] === 'number')
    : ['value'];

  if (!isMounted) {
    return (
      <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm min-h-[300px] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-zinc-300 dark:border-zinc-700 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Style variants
  const renderSimple = () => (
    <BarChart data={normalizedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
      <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
      <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
      <Tooltip content={<CustomTooltip />} />
      <Bar dataKey="value" radius={[4, 4, 0, 0]} isAnimationActive={true} animationDuration={1500} animationEasing="ease-in-out">
        {normalizedData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Bar>
    </BarChart>
  );

  const renderStacked = () => {
    if (!hasMultiSeries) {
      return renderSimple();
    }
    return (
      <BarChart data={normalizedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
        <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        {seriesKeys.map((key, index) => (
          <Bar
            key={key}
            dataKey={key}
            stackId="stack"
            fill={COLORS[index % COLORS.length]}
            isAnimationActive={true}
            animationDuration={1500 + index * 200}
          />
        ))}
      </BarChart>
    );
  };

  const renderHorizontal = () => (
    <BarChart layout="vertical" data={normalizedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
      <XAxis type="number" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
      <YAxis type="category" dataKey="name" width={80} stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
      <Tooltip content={<CustomTooltip />} />
      <Bar dataKey="value" radius={[0, 4, 4, 0]} isAnimationActive={true} animationDuration={1500} animationEasing="ease-in-out">
        {normalizedData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Bar>
    </BarChart>
  );

  const renderPercent = () => {
    if (!hasMultiSeries) {
      return renderSimple();
    }
    // Calculate totals for percentage
    const totals = normalizedData.map(item =>
      seriesKeys.reduce((sum, key) => sum + (Number(item[key]) || 0), 0)
    );
    const maxTotal = Math.max(...totals);

    return (
      <BarChart data={normalizedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
        <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis tickFormatter={(value) => `${value}%`} stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip content={<CustomTooltip />} formatter={(value: number) => `${value.toFixed(1)}%`} />
        <Legend />
        {seriesKeys.map((key, index) => {
          const percentData = normalizedData.map(item => ({
            ...item,
            [key]: (item[key] / (totals[normalizedData.indexOf(item)] || 1)) * 100,
          }));
          return (
            <Bar
              key={key}
              data={percentData}
              dataKey={key}
              stackId="percent"
              fill={COLORS[index % COLORS.length]}
              isAnimationActive={true}
              animationDuration={1500 + index * 200}
            />
          );
        })}
      </BarChart>
    );
  };

  const renderRounded = () => (
    <BarChart data={normalizedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.3} />
      <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
      <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
      <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }} />
      <Bar dataKey="value" radius={[20, 20, 0, 0]} isAnimationActive={true} animationDuration={1800} animationEasing="ease-out">
        {normalizedData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={`url(#barGradient${index})`} />
        ))}
      </Bar>
      <defs>
        {normalizedData.map((entry, index) => (
          <linearGradient key={`barGradient${index}`} id={`barGradient${index}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={COLORS[index % COLORS.length]} stopOpacity={1} />
            <stop offset="95%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.3} />
          </linearGradient>
        ))}
      </defs>
    </BarChart>
  );

  const styleRenderers: Record<BarStyle, () => JSX.Element> = {
    simple: renderSimple,
    stacked: renderStacked,
    horizontal: renderHorizontal,
    percent: renderPercent,
    rounded: renderRounded,
  };

  return (
    <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">{section.title}</h3>
      {chartData.title && <p className="text-center text-gray-500 dark:text-zinc-500 text-sm mb-6">{chartData.title}</p>}

      <div className="w-full" style={{ aspectRatio: '16 / 9', minHeight: '250px' }}>
        <ResponsiveContainer width="100%" height="100%">
          {styleRenderers[style]()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Style-specific exports
export const BarSimple: React.FC<VisualProps> = (props) => <EnhancedBarChart {...props} style="simple" />;
export const BarStacked: React.FC<VisualProps> = (props) => <EnhancedBarChart {...props} style="stacked" />;
export const BarHorizontal: React.FC<VisualProps> = (props) => <EnhancedBarChart {...props} style="horizontal" />;
export const BarPercent: React.FC<VisualProps> = (props) => <EnhancedBarChart {...props} style="percent" />;
export const BarRounded: React.FC<VisualProps> = (props) => <EnhancedBarChart {...props} style="rounded" />;
