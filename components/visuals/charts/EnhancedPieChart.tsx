/**
 * EnhancedPieChart - PieChart with multiple style variants
 * Subtypes: Simple, Donut, Interactive, Label, Rose
 */

import React, { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { VisualProps } from '../shared/types';
import { DataPlaceholder, CustomTooltip, COLORS, normalizeChartData } from '../shared/shared';

type PieStyle = 'simple' | 'donut' | 'interactive' | 'label' | 'rose';

export interface EnhancedPieChartProps extends VisualProps {
  style?: PieStyle;
}

export const EnhancedPieChart: React.FC<EnhancedPieChartProps> = ({
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

  const normalizedItems = chartData.items;

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  if (!isMounted) {
    return (
      <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm min-h-[300px] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-zinc-300 dark:border-zinc-700 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Custom label renderer with percentage
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

  // Render label outside with line
  const renderLabelLine = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 10;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <>
        <text
          x={x}
          y={y}
          fill="#374151"
          textAnchor={x > cx ? 'start' : 'end'}
          dominantBaseline="central"
          fontSize="11"
        >
          {`${(percent * 100).toFixed(1)}%`}
        </text>
      </>
    );
  };

  // Style variants
  const renderSimple = () => (
    <PieChart>
      <Pie
        data={normalizedItems}
        cx="50%"
        cy="50%"
        outerRadius={100}
        paddingAngle={2}
        dataKey="value"
        nameKey="name"
        isAnimationActive={true}
        animationDuration={1200}
        animationEasing="ease-out"
      >
        {normalizedItems.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip content={<CustomTooltip />} />
      <Legend verticalAlign="bottom" height={36} />
    </PieChart>
  );

  const renderDonut = () => (
    <PieChart>
      <Pie
        data={normalizedItems}
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={100}
        paddingAngle={3}
        dataKey="value"
        nameKey="name"
        label={renderPieLabel}
        isAnimationActive={true}
        animationDuration={1400}
        animationEasing="ease-out"
      >
        {normalizedItems.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip content={<CustomTooltip />} />
      <Legend verticalAlign="bottom" height={36} />
    </PieChart>
  );

  const renderInteractive = () => (
    <PieChart>
      <Pie
        data={normalizedItems}
        cx="50%"
        cy="50%"
        innerRadius={50}
        outerRadius={100}
        paddingAngle={5}
        dataKey="value"
        nameKey="name"
        labelLine={false}
        label={renderPieLabel}
        activeIndex={activeIndex}
        activeShape={{
          outerRadius: 110,
          innerRadius: 55,
          stroke: '#6366f1',
          strokeWidth: 2,
        }}
        onMouseEnter={onPieEnter}
        isAnimationActive={true}
        animationDuration={1500}
        animationEasing="ease-in-out"
      >
        {normalizedItems.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={COLORS[index % COLORS.length]}
            stroke={index === activeIndex ? '#6366f1' : 'none'}
            strokeWidth={index === activeIndex ? 2 : 0}
          />
        ))}
      </Pie>
      <Tooltip content={<CustomTooltip />} />
      <Legend verticalAlign="bottom" height={36} />
    </PieChart>
  );

  const renderLabel = () => (
    <PieChart>
      <Pie
        data={normalizedItems}
        cx="50%"
        cy="50%"
        outerRadius={90}
        paddingAngle={2}
        dataKey="value"
        nameKey="name"
        labelLine={true}
        label={renderLabelLine}
        isAnimationActive={true}
        animationDuration={1300}
        animationEasing="ease-out"
      >
        {normalizedItems.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip content={<CustomTooltip />} />
      <Legend verticalAlign="bottom" height={36} />
    </PieChart>
  );

  const renderRose = () => {
    const maxValue = Math.max(...normalizedItems.map(d => d.value));
    const roseData = normalizedItems.map(d => ({
      ...d,
      radius: (d.value / maxValue) * 100,
    }));

    return (
      <PieChart>
        <Pie
          data={roseData}
          cx="50%"
          cy="50%"
          innerRadius={40}
          outerRadius={100}
          paddingAngle={1}
          dataKey="value"
          nameKey="name"
          label={renderPieLabel}
          labelLine={false}
          startAngle={90}
          endAngle={-270}
          isAnimationActive={true}
          animationDuration={1600}
          animationEasing="ease-out"
        >
          {roseData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.8} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend verticalAlign="bottom" height={36} />
      </PieChart>
    );
  };

  const styleRenderers: Record<PieStyle, () => JSX.Element> = {
    simple: renderSimple,
    donut: renderDonut,
    interactive: renderInteractive,
    label: renderLabel,
    rose: renderRose,
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
export const PieSimple: React.FC<VisualProps> = (props) => <EnhancedPieChart {...props} style="simple" />;
export const PieDonut: React.FC<VisualProps> = (props) => <EnhancedPieChart {...props} style="donut" />;
export const PieInteractive: React.FC<VisualProps> = (props) => <EnhancedPieChart {...props} style="interactive" />;
export const PieLabel: React.FC<VisualProps> = (props) => <EnhancedPieChart {...props} style="label" />;
export const PieRose: React.FC<VisualProps> = (props) => <EnhancedPieChart {...props} style="rose" />;
