/**
 * SequenceSnake - Snake/S-curve layout with alternating sides
 * Used by: sequence-snake-steps
 */

import React from 'react';
import { VisualProps } from '../shared/types';
import { DataPlaceholder } from '../shared/shared';

interface SequenceItem {
  label: string;
  desc: string;
}

export const SequenceSnake: React.FC<VisualProps> = ({ section, isLoading = false }) => {
  const snakeData = section.data as { title?: string; items?: SequenceItem[] };

  if (!snakeData?.items || snakeData.items.length === 0) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="Sequence" />;
  }

  const colors = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-emerald-500 to-teal-500',
    'from-orange-500 to-amber-500',
    'from-red-500 to-rose-500',
    'from-indigo-500 to-violet-500',
  ];

  return (
    <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">{section.title}</h3>
      {snakeData.title && <p className="text-center text-gray-500 dark:text-zinc-500 text-sm mb-6">{snakeData.title}</p>}

      <div className="max-w-3xl mx-auto">
        {snakeData.items.map((item, index) => {
          const isLeft = index % 2 === 0;
          const color = colors[index % colors.length];
          const hasNext = index < snakeData.items.length - 1;

          return (
            <div key={index} className="relative">
              {/* Step */}
              <div className={`flex items-center gap-6 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
                {/* Node */}
                <div className={`flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-lg shadow-lg z-10`}>
                  {index + 1}
                </div>

                {/* Content */}
                <div className={`flex-1 p-4 bg-gradient-to-br from-gray-50 to-white dark:from-zinc-800 dark:to-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm hover:shadow-md transition-shadow ${isLeft ? 'text-left' : 'text-right'}`}>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1">{item.label}</h4>
                  <p className="text-sm text-gray-600 dark:text-zinc-400">{item.desc}</p>
                </div>
              </div>

              {/* Connection to next step */}
              {hasNext && (
                <div className={`flex justify-center py-2 ${isLeft ? 'pr-20' : 'pl-20'}`}>
                  <div className={`w-1 h-8 bg-gradient-to-b ${color} rounded-full`} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
