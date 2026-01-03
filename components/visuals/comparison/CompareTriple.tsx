/**
 * CompareTriple - Three-way comparison side by side
 * Compares three options instead of two
 */

import React from 'react';
import { VisualProps } from '../shared/types';
import { DataPlaceholder, COLORS } from '../shared/shared';

export const CompareTriple: React.FC<VisualProps> = ({ section, isLoading = false }) => {
  const compareData = section.data as {
    title?: string;
    items?: {
      label: string;
      optionA?: string;
      optionB?: string;
      optionC?: string;
    }[];
  };

  if (!compareData?.items || compareData.items.length === 0) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="Comparison" />;
  }

  const tripleColors = [
    'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30 border-blue-200 dark:border-blue-800',
    'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/30 border-purple-200 dark:border-purple-800',
    'from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/30 border-orange-200 dark:border-orange-800',
  ];

  const textColors = [
    'text-blue-900 dark:text-blue-100',
    'text-purple-900 dark:text-purple-100',
    'text-orange-900 dark:text-orange-100',
  ];

  return (
    <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">{section.title}</h3>
      {compareData.title && <p className="text-center text-gray-500 dark:text-zinc-500 text-sm mb-6">{compareData.title}</p>}

      {/* Header */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center font-bold text-gray-700 dark:text-zinc-300">Option A</div>
        <div className="text-center font-bold text-gray-700 dark:text-zinc-300">Option B</div>
        <div className="text-center font-bold text-gray-700 dark:text-zinc-300">Option C</div>
      </div>

      {/* Comparison rows */}
      <div className="space-y-3">
        {compareData.items.map((item, index) => (
          <div key={index} className="grid grid-cols-3 gap-4">
            <div className={`p-3 rounded-lg border ${tripleColors[0]}`}>
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1 line-clamp-2">{item.label}</p>
              <p className={`text-xs ${textColors[0]} break-words`}>{item.optionA || '-'}</p>
            </div>
            <div className={`p-3 rounded-lg border ${tripleColors[1]}`}>
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1 line-clamp-2">{item.label}</p>
              <p className={`text-xs ${textColors[1]} break-words`}>{item.optionB || '-'}</p>
            </div>
            <div className={`p-3 rounded-lg border ${tripleColors[2]}`}>
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1 line-clamp-2">{item.label}</p>
              <p className={`text-xs ${textColors[2]} break-words`}>{item.optionC || '-'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
