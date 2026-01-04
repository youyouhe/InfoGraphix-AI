/**
 * ProcessFlow - Horizontal process flow with numbered steps
 * Originally: ProcessFlow
 */

import React from 'react';
import { VisualProps } from '../shared/types';
import { DataPlaceholder } from '../shared/shared';
import { ArrowRight } from 'lucide-react';

export const ProcessFlow: React.FC<VisualProps> = ({ section, isLoading = false }) => {
  if (!section.steps || section.steps.length === 0) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="Process" />;
  }

  return (
    <div className="mb-8 p-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-8 text-center">{section.title}</h3>
      <div className="flex flex-col md:flex-row gap-4 items-stretch justify-center relative">
        {section.steps?.map((step, index) => (
          <div key={index} className="flex-1 flex flex-col items-center relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-white dark:bg-gradient-to-br dark:from-zinc-800 dark:to-black border border-zinc-200 dark:border-zinc-700 flex items-center justify-center mb-4 shadow-lg dark:shadow-[0_0_15px_rgba(99,102,241,0.3)]">
              <span className="text-2xl font-black text-indigo-600 dark:text-indigo-500">{step.step}</span>
            </div>
            <div className="text-center bg-white dark:bg-zinc-800/50 p-4 rounded-lg w-full h-full border border-zinc-200 dark:border-zinc-700/50 hover:border-indigo-500/50 transition-colors shadow-sm dark:shadow-none">
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">{step.title}</h4>
              <p className="text-xs text-gray-600 dark:text-zinc-400">{step.description}</p>
            </div>
            {index < (section.steps?.length || 0) - 1 && (
              <div className="hidden md:block absolute top-8 -right-[calc(50%-2rem)] text-gray-400 dark:text-zinc-600 z-0">
                <ArrowRight size={24} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
