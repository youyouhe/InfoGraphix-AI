/**
 * SWOTAnalysis - SWOT analysis grid with color-coded quadrants
 * Originally: SWOTAnalysis (for compare-swot)
 */

import React from 'react';
import { VisualProps } from '../shared/types';
import { DataPlaceholder } from '../shared/shared';

export const SWOTAnalysis: React.FC<VisualProps> = ({ section, isLoading = false }) => {
  // Handle both { items: [] } and direct array format
  const swotData = section.data as { title?: string; items?: { label: string; content: string }[] } | { label: string; content: string }[];
  const items = Array.isArray(swotData) ? swotData : swotData?.items;
  const title = !Array.isArray(swotData) ? swotData?.title : undefined;

  if (!items || items.length === 0) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="Comparison" />;
  }

  const getLabelColor = (label: string) => {
    const lowerLabel = (label || '').toLowerCase();
    if (lowerLabel.includes('strengths') || lowerLabel.includes('优势')) return 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400';
    if (lowerLabel.includes('weaknesses') || lowerLabel.includes('劣势')) return 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400';
    if (lowerLabel.includes('opportunities') || lowerLabel.includes('机会')) return 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400';
    if (lowerLabel.includes('threats') || lowerLabel.includes('威胁')) return 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400';
    return 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-400';
  };

  return (
    <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">{section.title}</h3>
      {title && <p className="text-center text-gray-500 dark:text-zinc-500 text-sm mb-6">{title}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item, index) => (
          <div key={index} className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm">
            <h4 className={`text-center font-bold mb-3 px-3 py-2 rounded-lg ${getLabelColor(item.label || item.name || '')}`}>
              {item.label || item.name || `Item ${index + 1}`}
            </h4>
            <p className="text-sm text-gray-700 dark:text-zinc-300 leading-relaxed">{item.content || item.desc || ''}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
