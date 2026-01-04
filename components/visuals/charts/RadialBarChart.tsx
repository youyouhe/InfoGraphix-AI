/**
 * RadialBarChart - Enhanced RadialBarChart with animations and styles
 * Subtypes: Simple, Gauge, Stacked
 */

import React, { useState, useEffect } from 'react';
import {
  RadialBarChart as RechartsRadialBarChart, RadialBar, Legend,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { VisualProps } from '../shared/types';
import { DataPlaceholder, CustomTooltip, COLORS, normalizeChartData } from '../shared/shared';

type RadialBarStyle = 'simple' | 'gauge' | 'stacked';

export interface RadialBarChartProps extends VisualProps {
  style?: RadialBarStyle;
}

export const RadialBarChart: React.FC<RadialBarChartProps> = ({
  section,
  isLoading = false,
  style = 'simple'
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = requestAnimationFrame(() => setIsMounted(true));
    return () => cancelAnimationFrame(timer);
  }, []);

  // Handle both data formats for radial bar chart
  const rawData = section.data as any;
  const isDirectArray = Array.isArray(rawData);
  const chartData = isDirectArray
    ? { items: rawData }
    : (rawData as { title?: string; items?: { label: string; value: number; fill?: string }[] });

  if (!chartData?.items || chartData.items.length === 0) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="Chart" />;
  }

  const normalizedItems = chartData.items.map((item: any, index: number) => ({
    name: item.label || item.name,
    uv: item.value,
    fill: item.fill || COLORS[index % COLORS.length],
  }));

  if (!isMounted) {
    return (
      <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm min-h-[300px] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-zinc-300 dark:border-zinc-700 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Style variants
  const renderSimple = () => (
    <RechartsRadialBarChart
      cx="50%"
      cy="50%"
      innerRadius="20%"
      outerRadius="80%"
      barSize={12}
      data={normalizedItems}
    >
      <RadialBar
        minAngle={15}
        label={{ position: 'insideStart', fill: '#fff', fontSize: 12 }}
        background
        clockWise
        dataKey="uv"
        isAnimationActive={true}
        animationDuration={1500}
        animationEasing="ease-out"
      />
      <Legend iconSize={12} layout="vertical" verticalAlign="middle" align="right" />
      <Tooltip content={<CustomTooltip />} />
    </RechartsRadialBarChart>
  );

  const renderGauge = () => (
    <RechartsRadialBarChart
      cx="50%"
      cy="50%"
      innerRadius="60%"
      outerRadius="90%"
      barSize={16}
      data={normalizedItems}
      startAngle={90}
      endAngle={-270}
    >
      <RadialBar
        minAngle={15}
        label={{ position: 'insideStart', fill: '#fff', fontSize: 14, fontWeight: 'bold' }}
        background={{ fill: '#e5e7eb', fillOpacity: 0.3 }}
        clockWise={false}
        dataKey="uv"
        isAnimationActive={true}
        animationDuration={2000}
        animationEasing="ease-in-out"
      />
      <Legend iconSize={12} layout="horizontal" verticalAlign="bottom" align="center" />
      <Tooltip content={<CustomTooltip />} />
    </RechartsRadialBarChart>
  );

  const renderStacked = () => (
    <RechartsRadialBarChart
      cx="50%"
      cy="50%"
      innerRadius="10%"
      outerRadius="80%"
      barSize={8}
      data={normalizedItems}
    >
      <RadialBar
        minAngle={10}
        label={false}
        background
        clockWise
        dataKey="uv"
        isAnimationActive={true}
        animationDuration={1800}
        animationEasing="ease-out"
      />
      <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
      <Tooltip content={<CustomTooltip />} />
    </RechartsRadialBarChart>
  );

  const styleRenderers: Record<RadialBarStyle, () => JSX.Element> = {
    simple: renderSimple,
    gauge: renderGauge,
    stacked: renderStacked,
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
export const RadialBarSimple: React.FC<VisualProps> = (props) => (
  <RadialBarChart {...props} style="simple" />
);

export const RadialBarGauge: React.FC<VisualProps> = (props) => (
  <RadialBarChart {...props} style="gauge" />
);

export const RadialBarStacked: React.FC<VisualProps> = (props) => (
  <RadialBarChart {...props} style="stacked" />
);
