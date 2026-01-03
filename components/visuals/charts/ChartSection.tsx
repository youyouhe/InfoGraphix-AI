/**
 * ChartSection - Enhanced BarChart and PieChart with animations and gradients
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend,
} from 'recharts';
import { VisualProps } from '../shared/types';
import { DataPlaceholder, CustomTooltip, COLORS } from '../shared/shared';

export const ChartSection: React.FC<VisualProps> = ({ section, isDark = true, isLoading = false }) => {
  const axisColor = isDark ? "#71717a" : "#4b5563";
  const cursorFill = isDark ? "#3f3f46" : "#e5e7eb";
  const [isMounted, setIsMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Defer rendering until client-side hydration
  useEffect(() => {
    const timer = requestAnimationFrame(() => setIsMounted(true));
    return () => cancelAnimationFrame(timer);
  }, []);

  // Normalize data
  const chartData = useMemo(() => {
    if (section.data && typeof section.data === 'object' && !Array.isArray(section.data)) {
      const objData = section.data as { items?: { label?: string; name?: string; value: number }[] };
      if (objData.items && Array.isArray(objData.items) && objData.items.length > 0) {
        return objData.items.map((item: any) => {
          const name = item.label || item.name || 'Unknown';
          const value = typeof item.value === 'string' ? parseFloat(item.value.replace(/[^0-9.-]+/g, "")) : item.value;
          return { name: String(name), value: Number(value) || 0 };
        }).filter(item => item.value > 0);
      }
    }

    if (!section.data || !Array.isArray(section.data) || section.data.length === 0) {
      return null;
    }

    return section.data.map((item: any) => {
      let name = item.name;
      let value = item.value;

      if (!name || value === undefined) {
         const keys = Object.keys(item);
         if (!name) name = item[keys.find(k => typeof item[k] === 'string') || ''] || 'Unknown';
         if (value === undefined) value = item[keys.find(k => typeof item[k] === 'number') || ''] || 0;
      }

      if (typeof value === 'string') {
        value = parseFloat(value.replace(/[^0-9.-]+/g,""));
      }

      return { name: String(name), value: Number(value) || 0 };
    }).filter(item => item.value > 0);
  }, [section.data]);

  if (!chartData || chartData.length === 0) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} content={section.content} type="Chart" />;
  }

  if (!isMounted) {
    return (
       <div className="mb-8 p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-lg min-h-[300px] flex items-center justify-center">
         <div className="w-6 h-6 border-2 border-zinc-300 dark:border-zinc-700 border-t-transparent rounded-full animate-spin"></div>
       </div>
    );
  }

  const isBarChart = section.type === 'bar_chart';
  const isPieChart = section.type === 'pie_chart' || section.type === 'chart-pie-plain-text';

  // Pie chart custom label renderer
  const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="12"
        fontWeight="500"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className="mb-8 p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-lg">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 text-center">{section.title}</h3>
      <div className="w-full min-w-0" style={{ aspectRatio: '16 / 9', minHeight: '250px' }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          {isBarChart ? (
            <>
              {/* SVG Gradients for Bar Chart */}
              <svg width="0" height="0">
                <defs>
                  <linearGradient id="barGradient1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
              </svg>
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: cursorFill, opacity: 0.5 }} />
                <Bar
                  dataKey="value"
                  radius={[4, 4, 0, 0]}
                  fill="url(#barGradient1)"
                  isAnimationActive={true}
                  animationDuration={1500}
                  animationEasing="ease-in-out"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </>
          ) : (
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                nameKey="name"
                label={renderPieLabel}
                activeIndex={activeIndex}
                activeShape={{
                  outerRadius: 110,
                  stroke: '#6366f1',
                  strokeWidth: 2,
                }}
                onMouseEnter={onPieEnter}
                isAnimationActive={true}
                animationDuration={1200}
                animationEasing="ease-out"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ color: axisColor, fontSize: '12px' }} />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
       {section.content && <p className="mt-4 text-center text-gray-500 dark:text-zinc-500 text-sm italic">{section.content}</p>}
    </div>
  );
};
