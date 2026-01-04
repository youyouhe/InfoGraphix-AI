/**
 * LineChart - Enhanced LineChart with animations and gradients
 * Originally: ChartLinePlain
 */

import React, { useState, useEffect } from 'react';
import {
  LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { VisualProps } from '../shared/types';
import { DataPlaceholder, CustomTooltip, COLORS, normalizeChartData } from '../shared/shared';

export const LineChart: React.FC<VisualProps> = ({ section, isLoading = false }) => {
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

  const normalizedItems = chartData.items;

  if (!isMounted) {
    return (
      <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm min-h-[300px] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-zinc-300 dark:border-zinc-700 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">{section.title}</h3>
      {chartData.title && <p className="text-center text-gray-500 dark:text-zinc-500 text-sm mb-6">{chartData.title}</p>}

      <div className="w-full flex items-center" style={{ aspectRatio: '16 / 9', minHeight: '200px' }}>
        <ResponsiveContainer width="100%" height="100%">
          {/* SVG Gradients */}
          <svg width="0" height="0">
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                <stop offset="100%" stopColor="#ec4899" stopOpacity={1} />
              </linearGradient>
            </defs>
          </svg>
          <RechartsLineChart data={normalizedItems} margin={{ top: 20, right: 20, left: 20, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
            <XAxis dataKey="label" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="url(#strokeGradient)"
              strokeWidth={3}
              dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#ec4899', strokeWidth: 2 }}
              fill="url(#lineGradient)"
              isAnimationActive={true}
              animationDuration={2000}
              animationEasing="ease-in-out"
            />
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
