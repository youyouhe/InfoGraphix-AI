/**
 * SequenceAscending - Ascending stairs with increasing height
 * Used by: sequence-ascending-steps
 */

import React from 'react';
import { VisualProps } from '../shared/types';
import { DataPlaceholder } from '../shared/shared';

interface SequenceItem {
  label: string;
  desc: string;
}

export const SequenceAscending: React.FC<VisualProps> = ({ section, isLoading = false }) => {
  const ascendingData = section.data as { title?: string; items?: SequenceItem[] };

  if (!ascendingData?.items || ascendingData.items.length === 0) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="Sequence" />;
  }

  const colors = [
    'from-slate-400 to-slate-600',
    'from-blue-400 to-blue-600',
    'from-indigo-400 to-indigo-600',
    'from-purple-400 to-purple-600',
    'from-pink-400 to-pink-600',
    'from-rose-400 to-rose-600',
  ];

  return (
    <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">{section.title}</h3>
      {ascendingData.title && <p className="text-center text-gray-500 dark:text-zinc-500 text-sm mb-6">{ascendingData.title}</p>}

      <div className="flex items-end justify-center gap-4 h-80">
        {ascendingData.items.map((item, index) => {
          const heightPercent = 30 + (index * 15); // 30%, 45%, 60%, 75%, 90%
          const color = colors[index % colors.length];

          return (
            <div key={index} className="flex flex-col items-center gap-3" style={{ height: `${heightPercent}%` }}>
              {/* Step Card */}
              <div className="flex-1 w-full max-w-[160px] p-4 bg-gradient-to-br from-gray-50 to-white dark:from-zinc-800 dark:to-zinc-900 rounded-t-xl border-2 border-gray-200 dark:border-zinc-700 shadow-md hover:shadow-lg transition-all">
                {/* Number */}
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold mx-auto mb-3 shadow-md`}>
                  {index + 1}
                </div>

                {/* Content */}
                <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-2 text-center">{item.label}</h4>
                <p className="text-xs text-gray-600 dark:text-zinc-400 text-center leading-snug">{item.desc}</p>
              </div>

              {/* Base */}
              <div className={`w-full h-3 rounded-b-lg bg-gradient-to-r ${color} shadow-md`} />
            </div>
          );
        })}
      </div>

      {/* Arrow indicator */}
      <div className="flex justify-center mt-6 text-gray-400 dark:text-zinc-600">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 19V5M5 12l7 7 7-7" />
        </svg>
      </div>
    </div>
  );
};
