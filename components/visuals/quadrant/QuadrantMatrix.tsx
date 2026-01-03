/**
 * QuadrantMatrix - Classic priority matrix with color-coded quadrants
 * Used by: quadrant-quarter-simple-card
 */

import React from 'react';
import { VisualProps } from '../shared/types';
import { DataPlaceholder } from '../shared/shared';

interface QuadrantItem {
  label: string;
  desc: string;
  icon?: string;
}

export const QuadrantMatrix: React.FC<VisualProps> = ({ section, isLoading = false }) => {
  const quadrantData = section.data as { title?: string; desc?: string; items?: QuadrantItem[] };

  if (!quadrantData?.items || quadrantData.items.length === 0) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="Quadrant" />;
  }

  // Axis labels
  const xAxis = '重要性';
  const yAxis = '紧急性';

  return (
    <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">{section.title}</h3>
      {quadrantData.title && <p className="text-center text-gray-500 dark:text-zinc-500 text-sm mb-2">{quadrantData.title}</p>}
      {quadrantData.desc && <p className="text-center text-gray-600 dark:text-zinc-400 text-sm mb-6 max-w-2xl mx-auto">{quadrantData.desc}</p>}

      {/* Axis labels */}
      <div className="max-w-lg mx-auto mb-4">
        <div className="text-center text-sm font-medium text-gray-500 dark:text-zinc-500">
          {xAxis} →
        </div>
      </div>

      {/* Quadrant grid */}
      <div className="max-w-lg mx-auto relative">
        {/* Y-axis label */}
        <div className="absolute -left-8 top-1/2 -translate-y-1/2 -rotate-90 text-sm font-medium text-gray-500 dark:text-zinc-500 whitespace-nowrap">
          {yAxis} →
        </div>

        <div className="grid grid-cols-2 gap-1">
          {quadrantData.items.map((item, index) => (
            <MatrixQuadrant key={index} item={item} index={index} />
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-6 text-xs text-gray-500 dark:text-zinc-500">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-100 dark:bg-red-900/30 border-2 border-red-400" />
          <span>优先处理</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-amber-100 dark:bg-amber-900/30 border-2 border-amber-400" />
          <span>计划安排</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-100 dark:bg-green-900/30 border-2 border-green-400" />
          <span>适当处理</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-100 dark:bg-gray-900/30 border-2 border-gray-400" />
          <span>尽量减少</span>
        </div>
      </div>
    </div>
  );
};

interface MatrixQuadrantProps {
  item: QuadrantItem;
  index: number;
}

const MatrixQuadrant: React.FC<MatrixQuadrantProps> = ({ item, index }) => {
  const styles = [
    // Top-left: High-High (Red)
    {
      bg: 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/20',
      border: 'border-red-300 dark:border-red-700',
      title: 'text-red-700 dark:text-red-400',
      desc: 'text-red-600 dark:text-red-500',
      badge: 'bg-red-500'
    },
    // Top-right: High-Low (Amber)
    {
      bg: 'bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/20',
      border: 'border-amber-300 dark:border-amber-700',
      title: 'text-amber-700 dark:text-amber-400',
      desc: 'text-amber-600 dark:text-amber-500',
      badge: 'bg-amber-500'
    },
    // Bottom-left: Low-High (Green)
    {
      bg: 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20',
      border: 'border-green-300 dark:border-green-700',
      title: 'text-green-700 dark:text-green-400',
      desc: 'text-green-600 dark:text-green-500',
      badge: 'bg-green-500'
    },
    // Bottom-right: Low-Low (Gray)
    {
      bg: 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/30 dark:to-gray-800/20',
      border: 'border-gray-300 dark:border-gray-700',
      title: 'text-gray-700 dark:text-gray-400',
      desc: 'text-gray-600 dark:text-gray-500',
      badge: 'bg-gray-500'
    },
  ];

  const style = styles[index % 4];

  return (
    <div className={`p-5 rounded-lg border-2 ${style.bg} ${style.border} relative`}>
      {/* Priority badge */}
      <div className={`absolute top-2 left-2 px-2 py-0.5 ${style.badge} text-white text-xs font-bold rounded`}>
        P{index + 1}
      </div>

      {/* Content */}
      <div className="pt-6">
        <h4 className={`font-bold text-base mb-2 text-center ${style.title}`}>{item.label}</h4>
        <p className={`text-xs text-center ${style.desc} whitespace-pre-line leading-relaxed`}>{item.desc}</p>
      </div>

      {/* Corner decoration */}
      <div className={`absolute bottom-2 right-2 w-8 h-8 rounded-tr-lg ${style.badge} opacity-20`} />
    </div>
  );
};
