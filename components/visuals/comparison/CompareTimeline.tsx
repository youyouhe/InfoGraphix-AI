/**
 * CompareTimeline - Before/After timeline comparison
 * Shows progression or changes over time with visual indicators
 */

import React from 'react';
import { VisualProps } from '../shared/types';
import { DataPlaceholder } from '../shared/shared';

export const CompareTimeline: React.FC<VisualProps> = ({ section, isLoading = false }) => {
  const compareData = section.data as {
    title?: string;
    items?: {
      label: string; // timestamp or phase
      before?: string;
      after?: string;
      change?: 'improvement' | 'decline' | 'neutral';
    }[];
  };

  if (!compareData?.items || compareData.items.length === 0) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="Comparison" />;
  }

  const getChangeIcon = (change?: string) => {
    if (change === 'improvement') return '↑';
    if (change === 'decline') return '↓';
    return '→';
  };

  const getChangeColor = (change?: string) => {
    if (change === 'improvement') return 'text-green-500 bg-green-50 dark:bg-green-500/20';
    if (change === 'decline') return 'text-red-500 bg-red-50 dark:bg-red-500/20';
    return 'text-gray-400 bg-gray-50 dark:bg-zinc-800';
  };

  return (
    <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">{section.title}</h3>
      {compareData.title && <p className="text-center text-gray-500 dark:text-zinc-500 text-sm mb-6">{compareData.title}</p>}

      <div className="space-y-4">
        {compareData.items.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            {/* Label */}
            <div className="flex-shrink-0 w-20 text-center">
              <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">{item.label}</span>
            </div>

            {/* Before */}
            <div className="flex-1 p-3 bg-gradient-to-r from-gray-50 to-white dark:from-zinc-800 dark:to-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700">
              <p className="text-xs text-gray-500 dark:text-zinc-500 mb-1">Before</p>
              <p className="text-sm text-gray-900 dark:text-white">{item.before}</p>
            </div>

            {/* Arrow with change indicator */}
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getChangeColor(item.change)} border`}>
              <span className="text-sm">{getChangeIcon(item.change)}</span>
            </div>

            {/* After */}
            <div className="flex-1 p-3 bg-gradient-to-r from-indigo-50 to-white dark:from-indigo-900/20 dark:to-zinc-900 rounded-lg border border-indigo-200 dark:border-indigo-800">
              <p className="text-xs text-indigo-600 dark:text-indigo-400 mb-1">After</p>
              <p className="text-sm text-gray-900 dark:text-white">{item.after}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
