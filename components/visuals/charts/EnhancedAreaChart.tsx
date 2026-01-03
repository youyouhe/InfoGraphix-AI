/**
 * EnhancedAreaChart - AreaChart with multiple style variants
 * Subtypes: Simple, Stacked, Percent, Gradient
 */

import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import { VisualProps } from '../shared/types';
import { DataPlaceholder, CustomTooltip, COLORS, normalizeChartData } from '../shared/shared';

type AreaStyle = 'simple' | 'stacked' | 'percent' | 'gradient';

export interface EnhancedAreaChartProps extends VisualProps {
  style?: AreaStyle;
}

export const EnhancedAreaChart: React.FC<EnhancedAreaChartProps> = ({
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
    <AreaChart data={normalizedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
      <defs>
        <linearGradient id="areaGradientSimple" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
      <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
      <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
      <Tooltip content={<CustomTooltip />} />
      <Area
        type="monotone"
        dataKey="value"
        stroke="#6366f1"
        strokeWidth={2}
        fill="url(#areaGradientSimple)"
        isAnimationActive={true}
        animationDuration={1800}
        animationEasing="ease-out"
      />
    </AreaChart>
  );

  const renderStacked = () => {
    if (!hasMultiSeries) {
      return renderSimple();
    }
    return (
      <AreaChart data={normalizedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
        <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        {seriesKeys.map((key, index) => (
          <Area
            key={key}
            type="monotone"
            dataKey={key}
            stackId="stack"
            stroke={COLORS[index % COLORS.length]}
            fill={COLORS[index % COLORS.length]}
            fillOpacity={0.6}
            strokeWidth={2}
            isAnimationActive={true}
            animationDuration={1500 + index * 200}
          />
        ))}
      </AreaChart>
    );
  };

  const renderPercent = () => {
    if (!hasMultiSeries) {
      return renderSimple();
    }
    // Calculate totals for percentage
    const totals = normalizedData.map(item =>
      seriesKeys.reduce((sum, key) => sum + (Number(item[key]) || 0), 0)
    );

    const percentData = normalizedData.map(item => {
      const total = totals[normalizedData.indexOf(item)] || 1;
      const newItem: any = { name: item.name };
      seriesKeys.forEach(key => {
        newItem[key] = ((item[key] || 0) / total) * 100;
      });
      return newItem;
    });

    return (
      <AreaChart data={percentData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          {seriesKeys.map((key, index) => (
            <linearGradient key={`percentGradient${index}`} id={`percentGradient${index}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.8} />
              <stop offset="95%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.1} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
        <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis tickFormatter={(value) => `${value}%`} stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip content={<CustomTooltip />} formatter={(value: number) => `${value.toFixed(1)}%`} />
        <Legend />
        {seriesKeys.map((key, index) => (
          <Area
            key={key}
            type="monotone"
            dataKey={key}
            stackId="percent"
            stroke={COLORS[index % COLORS.length]}
            fill={`url(#percentGradient${index})`}
            strokeWidth={2}
            isAnimationActive={true}
            animationDuration={1500 + index * 200}
          />
        ))}
      </AreaChart>
    );
  };

  const renderGradient = () => {
    if (hasMultiSeries) {
      return (
        <AreaChart data={normalizedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            {seriesKeys.map((key, index) => (
              <linearGradient key={`multiGradient${index}`} id={`multiGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.9} />
                <stop offset="95%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.1} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
          <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {seriesKeys.map((key, index) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={3}
              fill={`url(#multiGradient${index})`}
              isAnimationActive={true}
              animationDuration={1600 + index * 200}
              animationEasing="ease-in-out"
            />
          ))}
        </AreaChart>
      );
    }

    return (
      <AreaChart data={normalizedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="areaGradientMulti" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.9} />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity={0.5} />
            <stop offset="95%" stopColor="#ec4899" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
        <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="value"
          stroke="url(#areaGradientMulti)"
          strokeWidth={3}
          fill="url(#areaGradientMulti)"
          isAnimationActive={true}
          animationDuration={2000}
          animationEasing="ease-in-out"
        />
      </AreaChart>
    );
  };

  const styleRenderers: Record<AreaStyle, () => JSX.Element> = {
    simple: renderSimple,
    stacked: renderStacked,
    percent: renderPercent,
    gradient: renderGradient,
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
export const AreaSimple: React.FC<VisualProps> = (props) => <EnhancedAreaChart {...props} style="simple" />;
export const AreaStacked: React.FC<VisualProps> = (props) => <EnhancedAreaChart {...props} style="stacked" />;
export const AreaPercent: React.FC<VisualProps> = (props) => <EnhancedAreaChart {...props} style="percent" />;
export const AreaGradient: React.FC<VisualProps> = (props) => <EnhancedAreaChart {...props} style="gradient" />;
