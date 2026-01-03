/**
 * SequenceTimeline - Timeline visualization with alternating layout
 * Originally: SequenceTimeline (for sequence-timeline-simple)
 */

import React from 'react';
import { VisualProps } from '../shared/types';
import { DataPlaceholder } from '../shared/shared';

export const SequenceTimeline: React.FC<VisualProps> = ({ section, isLoading = false }) => {
  const timelineData = section.data as { title?: string; items?: { label: string; desc: string }[] };

  if (!timelineData?.items || timelineData.items.length === 0) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="Process" />;
  }

  return (
    <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">{section.title}</h3>
      {timelineData.title && <p className="text-center text-gray-500 dark:text-zinc-500 text-sm mb-6">{timelineData.title}</p>}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500"></div>

        <div className="space-y-6">
          {timelineData.items.map((item, index) => (
            <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
              {/* Timeline dot */}
              <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-white dark:bg-zinc-900 border-4 border-indigo-500 z-10"></div>

              {/* Content card */}
              <div className="ml-12 md:ml-0 md:w-5/12 bg-gradient-to-br from-gray-50 to-white dark:from-zinc-800 dark:to-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-full">
                    {item.label}
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-zinc-300 leading-relaxed">{item.desc}</p>
              </div>

              {/* Spacer for alternating layout */}
              <div className="hidden md:block md:w-5/12"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
