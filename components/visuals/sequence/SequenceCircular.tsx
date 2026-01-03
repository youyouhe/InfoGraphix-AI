/**
 * SequenceCircular - Circular sequence with numbered nodes
 * Originally: SequenceCircular (for sequence-circular-simple)
 */

import React from 'react';
import { VisualProps } from '../shared/types';
import { DataPlaceholder } from '../shared/shared';
import { Icon } from '../../Icon';

export const SequenceCircular: React.FC<VisualProps> = ({ section, isLoading = false }) => {
  const circularData = section.data as { title?: string; items?: { label: string; desc: string; icon?: string }[] };

  if (!circularData?.items || circularData.items.length === 0) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="Process" />;
  }

  return (
    <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">{section.title}</h3>
      {circularData.title && <p className="text-center text-gray-500 dark:text-zinc-500 text-sm mb-6">{circularData.title}</p>}

      <div className="flex flex-wrap justify-center gap-6">
        {circularData.items.map((item, index) => (
          <div key={index} className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
              {circularData.items.findIndex(i => i === item) + 1}
            </div>
            <div className="w-32 p-4 bg-gradient-to-br from-gray-50 to-white dark:from-zinc-800 dark:to-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm hover:shadow-md transition-shadow text-center">
              {item.icon && <div className="mb-2 flex justify-center"><Icon name={item.icon} size={24} /></div>}
              <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">{item.label}</h4>
              <p className="text-xs text-gray-600 dark:text-zinc-400">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
