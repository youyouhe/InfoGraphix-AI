/**
 * CompareBinary - Binary comparison with two sides
 * Originally: CompareBinary (for compare-binary-horizontal-*-*, compare-binary-*-badge-card)
 */

import React from 'react';
import { VisualProps } from '../shared/types';
import { DataPlaceholder } from '../shared/shared';

export const CompareBinary: React.FC<VisualProps> = ({ section, isLoading = false }) => {
  // Support both legacy format { items: [{ label, left, right }] } and few-shot format { items: [{ label, children: [{ label, desc }] }] }
  const compareData = section.data as { title?: string; items?: any[]; left?: any; right?: any };

  if (!compareData) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="Comparison" />;
  }

  // Handle { left: { title, items }, right: { title, items } } format (LLM output)
  if (compareData.left && compareData.right) {
    return (
      <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">{section.title}</h3>
        <div className="space-y-6">
          {/* Left side */}
          <div className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-zinc-900 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
            <h4 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-4 text-center">{compareData.left.title || 'Left'}</h4>
            <div className="space-y-3">
              {(compareData.left.items || []).map((item: any, idx: number) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-200 dark:bg-blue-700 flex items-center justify-center text-blue-800 dark:text-blue-100 font-bold text-sm">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 dark:text-white">{item.label}</p>
                    <p className="text-sm text-gray-600 dark:text-zinc-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Right side */}
          <div className="bg-gradient-to-br from-pink-50 to-white dark:from-pink-900/20 dark:to-zinc-900 rounded-xl border border-pink-200 dark:border-pink-800 p-6">
            <h4 className="text-lg font-bold text-pink-900 dark:text-pink-100 mb-4 text-center">{compareData.right.title || 'Right'}</h4>
            <div className="space-y-3">
              {(compareData.right.items || []).map((item: any, idx: number) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pink-200 dark:bg-pink-700 flex items-center justify-center text-pink-800 dark:text-pink-100 font-bold text-sm">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 dark:text-white">{item.label}</p>
                    <p className="text-sm text-gray-600 dark:text-zinc-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!compareData.items || compareData.items.length === 0) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="Comparison" />;
  }

  // Detect format: legacy has 'left'/'right', few-shot has 'children'
  const isLegacyFormat = compareData.items[0]?.left !== undefined;

  return (
    <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">{section.title}</h3>
      {compareData.title && <p className="text-center text-gray-500 dark:text-zinc-500 text-sm mb-6">{compareData.title}</p>}

      {isLegacyFormat ? (
        // Legacy format: { items: [{ label, left, right }] }
        <div className="space-y-4">
          {(compareData.items as { label: string; left: string; right: string }[]).map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center gap-4">
                <div className="flex-1 p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30 rounded-xl border border-blue-200 dark:border-blue-800">
                  <p className="font-bold text-blue-900 dark:text-blue-100 text-center mb-2">{item.left}</p>
                </div>
                <div className="flex-shrink-0 font-bold text-gray-400 dark:text-zinc-500">VS</div>
                <div className="flex-1 p-4 bg-gradient-to-r from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/30 rounded-xl border border-pink-200 dark:border-pink-800">
                  <p className="font-bold text-pink-900 dark:text-pink-100 text-center mb-2">{item.right}</p>
                </div>
              </div>
              <div className="text-center">
                <span className="px-3 py-1 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 text-sm rounded-full">
                  {item.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Few-shot format: { items: [{ label, children: [{ label, desc }] }] }
        <div className="space-y-6">
          {(compareData.items as { label: string; children?: { label: string; desc: string; icon?: string }[] }[]).map((side) => (
            <div key={side.label} className="bg-gradient-to-br from-gray-50 to-white dark:from-zinc-800 dark:to-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 text-center">{side.label}</h4>
              <div className="space-y-3">
                {(side.children || []).map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 dark:text-white">{item.label}</p>
                      <p className="text-sm text-gray-600 dark:text-zinc-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
