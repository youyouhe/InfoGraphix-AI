/**
 * ScatterChart - Enhanced ScatterChart with animations and styles
 * Subtypes: Simple, Bubble, MultiSeries, Shape
 */

import React, { useState, useEffect } from 'react';
import {
  ScatterChart as RechartsScatterChart, Scatter, XAxis, YAxis, ZAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell,
} from 'recharts';
import { VisualProps } from '../shared/types';
import { DataPlaceholder, CustomTooltip, COLORS, normalizeChartData } from '../shared/shared';

type ScatterStyle = 'simple' | 'bubble' | 'multi-series' | 'shape';

export interface ScatterChartProps extends VisualProps {
  style?: ScatterStyle;
}

export const ScatterChart: React.FC<ScatterChartProps> = ({
  section,
  isLoading = false,
  style = 'simple'
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = requestAnimationFrame(() => setIsMounted(true));
    return () => cancelAnimationFrame(timer);
  }, []);

  // Handle both data formats for scatter chart
  const rawData = section.data as any;
  const isDirectArray = Array.isArray(rawData);
  const chartData = isDirectArray
    ? { items: rawData }
    : (rawData as { title?: string; items?: { x: number; y: number; z?: number; [key: string]: any }[] });

  if (!chartData?.items || chartData.items.length === 0) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="Chart" />;
  }

  if (!isMounted) {
    return (
      <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm min-h-[300px] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-zinc-300 dark:border-zinc-700 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Style variants
  const renderSimple = () => (
    <RechartsScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
      <XAxis type="number" dataKey="x" name="X" stroke="#71717a" fontSize={12} />
      <YAxis type="number" dataKey="y" name="Y" stroke="#71717a" fontSize={12} />
      <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
      <Scatter name="Data" data={chartData.items} fill="#6366f1" isAnimationActive={true} animationDuration={1200}>
        {chartData.items.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Scatter>
    </RechartsScatterChart>
  );

  const renderBubble = () => {
    const hasZ = chartData.items.some(item => item.z !== undefined);
    return (
      <RechartsScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
        <XAxis type="number" dataKey="x" name="X Axis" stroke="#71717a" fontSize={12} />
        <YAxis type="number" dataKey="y" name="Y Axis" stroke="#71717a" fontSize={12} />
        {hasZ && <ZAxis type="number" dataKey="z" range={[50, 300]} name="Size" />}
        <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
        <Scatter
          name="Bubbles"
          data={chartData.items}
          fill="#8b5cf6"
          fillOpacity={0.6}
          isAnimationActive={true}
          animationDuration={1500}
          animationEasing="ease-out"
        >
          {chartData.items.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.7} />
          ))}
        </Scatter>
      </RechartsScatterChart>
    );
  };

  const renderMultiSeries = () => {
    if (!chartData.series || chartData.series.length === 0) {
      return renderSimple();
    }

    return (
      <RechartsScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
        <XAxis type="number" dataKey="x" name="X" stroke="#71717a" fontSize={12} />
        <YAxis type="number" dataKey="y" name="Y" stroke="#71717a" fontSize={12} />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
        <Legend />
        {chartData.series.map((series, index) => (
          <Scatter
            key={series.name}
            name={series.name}
            data={series.data}
            fill={COLORS[index % COLORS.length]}
            shape={index % 2 === 0 ? 'circle' : 'triangle'}
            isAnimationActive={true}
            animationDuration={1200 + index * 200}
          />
        ))}
      </RechartsScatterChart>
    );
  };

  const renderShape = () => (
    <RechartsScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
      <XAxis type="number" dataKey="x" name="X" stroke="#71717a" fontSize={12} />
      <YAxis type="number" dataKey="y" name="Y" stroke="#71717a" fontSize={12} />
      <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
      <Legend />
      <Scatter
        name="Circle"
        data={chartData.items}
        fill="#6366f1"
        shape="circle"
        isAnimationActive={true}
        animationDuration={1200}
      />
      <Scatter
        name="Triangle"
        data={chartData.items.map(item => ({ x: item.x + 0.5, y: item.y + 0.5 }))}
        fill="#ec4899"
        shape="triangle"
        isAnimationActive={true}
        animationDuration={1400}
      />
      <Scatter
        name="Diamond"
        data={chartData.items.map(item => ({ x: item.x + 1, y: item.y + 1 }))}
        fill="#10b981"
        shape="diamond"
        isAnimationActive={true}
        animationDuration={1600}
      />
    </RechartsScatterChart>
  );

  const styleRenderers: Record<ScatterStyle, () => JSX.Element> = {
    simple: renderSimple,
    bubble: renderBubble,
    'multi-series': renderMultiSeries,
    shape: renderShape,
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
export const ScatterSimple: React.FC<VisualProps> = (props) => (
  <ScatterChart {...props} style="simple" />
);

export const ScatterBubble: React.FC<VisualProps> = (props) => (
  <ScatterChart {...props} style="bubble" />
);

export const ScatterMultiSeries: React.FC<VisualProps> = (props) => (
  <ScatterChart {...props} style="multi-series" />
);

export const ScatterShape: React.FC<VisualProps> = (props) => (
  <ScatterChart {...props} style="shape" />
);
