/**
 * SequenceSteps - Numbered steps with circular indicators
 * Originally: SequenceSteps (for sequence-zigzag-steps, sequence-ascending-steps)
 */

import React from 'react';
import { VisualProps } from '../shared/types';
import { DataPlaceholder } from '../shared/shared';

export const SequenceSteps: React.FC<VisualProps> = ({ section, isLoading = false }) => {
  const stepsData = section.data as { title?: string; items?: { label: string; desc: string }[] };

  if (!stepsData?.items || stepsData.items.length === 0) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="Process" />;
  }

  return (
    <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-8 text-center">{section.title}</h3>
      {stepsData.title && <p className="text-center text-gray-500 dark:text-zinc-500 text-sm mb-8">{stepsData.title}</p>}

      <div className="space-y-6">
        {stepsData.items.map((item, index) => (
          <div key={index} className="flex items-start gap-4">
            {/* Step Number */}
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {index + 1}
            </div>

            {/* Step Content */}
            <div className="flex-1 bg-gradient-to-br from-gray-50 to-white dark:from-zinc-800 dark:to-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm">
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">{item.label}</h4>
              <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
