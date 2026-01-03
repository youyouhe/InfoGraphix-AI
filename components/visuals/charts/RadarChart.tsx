/**
 * RadarChart - Enhanced RadarChart with animations and styles
 * Subtypes: Simple, Filled, Comparison
 */

import React, { useState, useEffect } from 'react';
import {
  RadarChart as RechartsRadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Legend, ResponsiveContainer, Tooltip,
} from 'recharts';
import { VisualProps } from '../shared/types';
import { DataPlaceholder, CustomTooltip, COLORS, normalizeChartData } from '../shared/shared';

type RadarStyle = 'simple' | 'filled' | 'comparison';

export interface RadarChartProps extends VisualProps {
  style?: RadarStyle;
}

export const RadarChart: React.FC<RadarChartProps> = ({
  section,
  isLoading = false,
  style = 'simple'
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = requestAnimationFrame(() => setIsMounted(true));
    return () => cancelAnimationFrame(timer);
  }, []);

  // Normalize chart data (handles both array and object formats)
  const chartData = normalizeChartData(section.data);

  if (!chartData?.items || chartData.items.length === 0) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="Chart" />;
  }

  // For comparison style, check if we have multiple series
  const isMultiSeries = chartData.items.some(item =>
    Object.keys(item).some(key => key !== 'name' && key !== 'label' && key !== 'value' && typeof item[key] === 'number')
  );

  const onRadarEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  if (!isMounted) {
    return (
      <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm min-h-[300px] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-zinc-300 dark:border-zinc-700 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Style variants
  const renderSimple = () => (
    <RechartsRadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData.items}>
      <PolarGrid stroke="#e5e7eb" strokeOpacity={0.5} />
      <PolarAngleAxis dataKey="name" stroke="#71717a" fontSize={12} />
      <PolarRadiusAxis angle={90} domain={[0, 'auto']} stroke="#71717a" fontSize={10} />
      <Radar
        name="Value"
        dataKey="value"
        stroke="#6366f1"
        fill="#6366f1"
        fillOpacity={0.3}
        strokeWidth={2}
        isAnimationActive={true}
        animationDuration={1500}
        animationEasing="ease-out"
      />
      <Legend />
    </RechartsRadarChart>
  );

  const renderFilled = () => (
    <RechartsRadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData.items}>
      <PolarGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.6} />
      <PolarAngleAxis dataKey="name" stroke="#71717a" fontSize={12} />
      <PolarRadiusAxis angle={90} domain={[0, 'auto']} stroke="#71717a" fontSize={10} />
      <Radar
        name="Value"
        dataKey="value"
        stroke="#8b5cf6"
        fill="url(#radarGradient)"
        fillOpacity={0.7}
        strokeWidth={3}
        activeIndex={activeIndex}
        activeShape={{
          fillOpacity: 0.9,
          stroke: '#ec4899',
          strokeWidth: 3,
        }}
        onMouseEnter={onRadarEnter}
        isAnimationActive={true}
        animationDuration={1800}
        animationEasing="ease-in-out"
      >
        <defs>
          <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#6366f1" stopOpacity={0.3} />
          </radialGradient>
        </defs>
      </Radar>
      <Tooltip content={<CustomTooltip />} />
      <Legend />
    </RechartsRadarChart>
  );

  const renderComparison = () => {
    if (!isMultiSeries) {
      // Fall back to filled style if no multiple series
      return renderFilled();
    }

    // Get all series keys (excluding 'name', 'label', 'value')
    const seriesKeys = Object.keys(chartData.items[0]).filter(k => k !== 'name' && k !== 'label' && k !== 'value');
    const colors = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6'];

    return (
      <RechartsRadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData.items}>
        <PolarGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
        <PolarAngleAxis dataKey="name" stroke="#71717a" fontSize={11} />
        <PolarRadiusAxis angle={90} domain={[0, 'auto']} stroke="#71717a" fontSize={10} />
        {seriesKeys.map((key, index) => (
          <Radar
            key={key}
            name={key}
            dataKey={key}
            stroke={colors[index % colors.length]}
            fill={colors[index % colors.length]}
            fillOpacity={0.4}
            strokeWidth={2}
            isAnimationActive={true}
            animationDuration={1500 + index * 200}
            animationEasing="ease-out"
          />
        ))}
        <Legend />
        <Tooltip content={<CustomTooltip />} />
      </RechartsRadarChart>
    );
  };

  const styleRenderers: Record<RadarStyle, () => JSX.Element> = {
    simple: renderSimple,
    filled: renderFilled,
    comparison: renderComparison,
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
export const RadarSimple: React.FC<VisualProps> = (props) => (
  <RadarChart {...props} style="simple" />
);

export const RadarFilled: React.FC<VisualProps> = (props) => (
  <RadarChart {...props} style="filled" />
);

export const RadarComparison: React.FC<VisualProps> = (props) => (
  <RadarChart {...props} style="comparison" />
);
