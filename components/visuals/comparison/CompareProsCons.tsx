/**
 * CompareProsCons - Pros and Cons list comparison with color coding
 * Green for pros, red for cons
 */

import React from 'react';
import { VisualProps } from '../shared/types';
import { DataPlaceholder } from '../shared/shared';
import { Check, X } from 'lucide-react';

export const CompareProsCons: React.FC<VisualProps> = ({ section, isLoading = false }) => {
  const compareData = section.data as {
    title?: string;
    desc?: string;
    pros?: { label: string; desc?: string }[];
    cons?: { label: string; desc?: string }[];
  };

  if (!compareData) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="Comparison" />;
  }

  const hasPros = compareData.pros && compareData.pros.length > 0;
  const hasCons = compareData.cons && compareData.cons.length > 0;

  if (!hasPros && !hasCons) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="Comparison" />;
  }

  return (
    <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">{section.title}</h3>
      {compareData.title && <p className="text-center text-gray-500 dark:text-zinc-500 text-sm mb-6">{compareData.title}</p>}
      {compareData.desc && <p className="text-center text-gray-600 dark:text-zinc-400 text-sm mb-6 max-w-2xl mx-auto">{compareData.desc}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pros - Green */}
        {hasPros && (
          <div className="space-y-3">
            <h4 className="text-lg font-bold text-green-600 dark:text-green-400 flex items-center gap-2 mb-4">
              <Check size={20} />
              优势 Pros
            </h4>
            {compareData.pros!.map((item, index) => (
              <div key={index} className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="font-bold text-gray-900 dark:text-white mb-1">{item.label}</p>
                {item.desc && <p className="text-sm text-gray-600 dark:text-zinc-400">{item.desc}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Cons - Red */}
        {hasCons && (
          <div className="space-y-3">
            <h4 className="text-lg font-bold text-red-600 dark:text-red-400 flex items-center gap-2 mb-4">
              <X size={20} />
              劣势 Cons
            </h4>
            {compareData.cons!.map((item, index) => (
              <div key={index} className="p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <p className="font-bold text-gray-900 dark:text-white mb-1">{item.label}</p>
                {item.desc && <p className="text-sm text-gray-600 dark:text-zinc-400">{item.desc}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
