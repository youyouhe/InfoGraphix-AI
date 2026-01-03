/**
 * SequenceRoadmap - Vertical roadmap with gradient line
 * Originally: SequenceRoadmap (for sequence-roadmap-vertical-simple)
 */

import React from 'react';
import { VisualProps } from '../shared/types';
import { DataPlaceholder } from '../shared/shared';

export const SequenceRoadmap: React.FC<VisualProps> = ({ section, isLoading = false }) => {
  const roadmapData = section.data as { title?: string; items?: { label: string; desc: string }[] };

  if (!roadmapData?.items || roadmapData.items.length === 0) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="Process" />;
  }

  return (
    <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-8 text-center">{section.title}</h3>
      {roadmapData.title && <p className="text-center text-gray-500 dark:text-zinc-500 text-sm mb-8">{roadmapData.title}</p>}

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500"></div>

        <div className="space-y-8">
          {roadmapData.items.map((item, index) => (
            <div key={index} className="flex items-center gap-6">
              {/* Step Node */}
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg z-10">
                {index + 1}
              </div>

              {/* Content Card */}
              <div className="flex-1 p-5 bg-gradient-to-br from-gray-50 to-white dark:from-zinc-800 dark:to-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm hover:shadow-md transition-shadow">
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">{item.label}</h4>
                <p className="text-sm text-gray-600 dark:text-zinc-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
