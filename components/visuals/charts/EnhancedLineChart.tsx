/**
 * EnhancedLineChart - LineChart with multiple style variants
 * Subtypes: Simple, Smooth, MultiSeries, Step, Dashed
 */

import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import { VisualProps } from '../shared/types';
import { DataPlaceholder, CustomTooltip, COLORS, normalizeChartData } from '../shared/shared';

type LineStyle = 'simple' | 'smooth' | 'multi-series' | 'step' | 'dashed';

export interface EnhancedLineChartProps extends VisualProps {
  style?: LineStyle;
}

export const EnhancedLineChart: React.FC<EnhancedLineChartProps> = ({
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
    <LineChart data={normalizedData} margin={{ top: 20, right: 20, left: 20, bottom: 40 }}>
      <defs>
        <linearGradient id="lineGradientSimple" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
          <stop offset="100%" stopColor="#ec4899" stopOpacity={1} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
      <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
      <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
      <Tooltip content={<CustomTooltip />} />
      <Line
        type="monotone"
        dataKey="value"
        stroke="url(#lineGradientSimple)"
        strokeWidth={3}
        dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
        activeDot={{ r: 6, stroke: '#ec4899', strokeWidth: 2 }}
        isAnimationActive={true}
        animationDuration={2000}
        animationEasing="ease-in-out"
      />
    </LineChart>
  );

  const renderSmooth = () => (
    <LineChart data={normalizedData} margin={{ top: 20, right: 20, left: 20, bottom: 40 }}>
      <defs>
        <linearGradient id="lineGradientSmooth" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
      <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
      <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
      <Tooltip content={<CustomTooltip />} />
      <Line
        type="monotone"
        dataKey="value"
        stroke="#6366f1"
        strokeWidth={3}
        fill="url(#lineGradientSmooth)"
        dot={false}
        activeDot={{ r: 8 }}
        isAnimationActive={true}
        animationDuration={2200}
        animationEasing="ease-in-out"
      />
    </LineChart>
  );

  const renderMultiSeries = () => {
    if (!hasMultiSeries) {
      return renderSimple();
    }
    return (
      <LineChart data={normalizedData} margin={{ top: 20, right: 20, left: 20, bottom: 40 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
        <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        {seriesKeys.map((key, index) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={COLORS[index % COLORS.length]}
            strokeWidth={2 + (index % 3)}
            dot={{ fill: COLORS[index % COLORS.length], r: 4 + (index % 2) * 2, strokeWidth: 2 }}
            activeDot={{ r: 6 }}
            isAnimationActive={true}
            animationDuration={1800 + index * 200}
            animationEasing="ease-out"
          />
        ))}
      </LineChart>
    );
  };

  const renderStep = () => (
    <LineChart data={normalizedData} margin={{ top: 20, right: 20, left: 20, bottom: 40 }}>
      <defs>
        <linearGradient id="lineGradientStep" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
          <stop offset="100%" stopColor="#059669" stopOpacity={1} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
      <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
      <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
      <Tooltip content={<CustomTooltip />} />
      <Line
        type="monotone"
        dataKey="value"
        stroke="url(#lineGradientStep)"
        strokeWidth={3}
        step="before"
        dot={{ fill: '#10b981', r: 5 }}
        activeDot={{ r: 7, stroke: '#059669', strokeWidth: 3 }}
        isAnimationActive={true}
        animationDuration={1800}
        animationEasing="ease-out"
      />
    </LineChart>
  );

  const renderDashed = () => (
    <LineChart data={normalizedData} margin={{ top: 20, right: 20, left: 20, bottom: 40 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
      <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
      <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
      <Tooltip content={<CustomTooltip />} />
      <Legend />
      {hasMultiSeries ? (
        // Multi-series dashed lines
        seriesKeys.map((key, index) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={COLORS[index % COLORS.length]}
            strokeWidth={2}
            strokeDasharray={index % 2 === 0 ? '5 5' : '10 10'}
            dot={{ fill: COLORS[index % COLORS.length], r: 4 }}
            activeDot={{ r: 6 }}
            isAnimationActive={true}
            animationDuration={1600 + index * 200}
          />
        ))
      ) : (
        // Single series with dashed line and solid comparison
        <>
          <Line
            type="monotone"
            dataKey="value"
            stroke="#6366f1"
            strokeWidth={2}
            strokeDasharray="8 8"
            dot={{ fill: '#6366f1', r: 4 }}
            activeDot={{ r: 6 }}
            isAnimationActive={true}
            animationDuration={1800}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#ec4899"
            strokeWidth={2}
            dot={false}
            isAnimationActive={true}
            animationDuration={2000}
            animationBegin={500}
          />
        </>
      )}
    </LineChart>
  );

  const styleRenderers: Record<LineStyle, () => JSX.Element> = {
    simple: renderSimple,
    smooth: renderSmooth,
    'multi-series': renderMultiSeries,
    step: renderStep,
    dashed: renderDashed,
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
export const LineSimple: React.FC<VisualProps> = (props) => <EnhancedLineChart {...props} style="simple" />;
export const LineSmooth: React.FC<VisualProps> = (props) => <EnhancedLineChart {...props} style="smooth" />;
export const LineMultiSeries: React.FC<VisualProps> = (props) => <EnhancedLineChart {...props} style="multi-series" />;
export const LineStep: React.FC<VisualProps> = (props) => <EnhancedLineChart {...props} style="step" />;
export const LineDashed: React.FC<VisualProps> = (props) => <EnhancedLineChart {...props} style="dashed" />;
