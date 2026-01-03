/**
 * SequenceZigzagUnderline - Zigzag with text on underlined connections
 * Used by: sequence-zigzag-steps-underline-text
 */

import React from 'react';
import { VisualProps } from '../shared/types';
import { DataPlaceholder } from '../shared/shared';

interface SequenceItem {
  label: string;
  desc: string;
}

export const SequenceZigzagUnderline: React.FC<VisualProps> = ({ section, isLoading = false }) => {
  const zigzagData = section.data as { title?: string; items?: SequenceItem[] };

  if (!zigzagData?.items || zigzagData.items.length === 0) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="Sequence" />;
  }

  const colors = [
    { bg: 'bg-blue-500', text: 'text-blue-600', border: 'border-blue-300' },
    { bg: 'bg-purple-500', text: 'text-purple-600', border: 'border-purple-300' },
    { bg: 'bg-emerald-500', text: 'text-emerald-600', border: 'border-emerald-300' },
    { bg: 'bg-amber-500', text: 'text-amber-600', border: 'border-amber-300' },
    { bg: 'bg-rose-500', text: 'text-rose-600', border: 'border-rose-300' },
    { bg: 'bg-indigo-500', text: 'text-indigo-600', border: 'border-indigo-300' },
  ];

  return (
    <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">{section.title}</h3>
      {zigzagData.title && <p className="text-center text-gray-500 dark:text-zinc-500 text-sm mb-6">{zigzagData.title}</p>}

      <div className="space-y-8">
        {zigzagData.items.map((item, index) => {
          const isLeft = index % 2 === 0;
          const color = colors[index % colors.length];

          return (
            <div key={index} className="relative">
              {/* Zigzag line with label */}
              <div className="flex items-center gap-4">
                {isLeft ? (
                  <>
                    <div className="flex-1 text-right pr-4">
                      <span className={`inline-block px-4 py-2 ${color.bg} text-white font-bold rounded-lg shadow-md`}>
                        {index + 1}. {item.label}
                      </span>
                    </div>
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white dark:bg-zinc-900 border-4 border-gray-300 dark:border-zinc-600" />
                  </>
                ) : (
                  <>
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white dark:bg-zinc-900 border-4 border-gray-300 dark:border-zinc-600" />
                    <div className="flex-1 pl-4">
                      <span className={`inline-block px-4 py-2 ${color.bg} text-white font-bold rounded-lg shadow-md`}>
                        {index + 1}. {item.label}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Underline */}
              <div className={`mt-3 h-1 bg-gradient-to-r ${color.bg} rounded-full ${isLeft ? 'mr-auto ml-12' : 'ml-auto mr-12'}`} style={{ width: '60%' }} />

              {/* Description */}
              <div className={`mt-3 text-sm text-gray-600 dark:text-zinc-400 ${isLeft ? 'text-right pr-12' : 'text-left pl-12'}`}>
                {item.desc}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
