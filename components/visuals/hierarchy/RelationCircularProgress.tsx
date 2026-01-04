/**
 * RelationCircularProgress - Central node with surrounding relations showing circular progress
 * Used by: relation-circle-circular-progress
 */

import React from 'react';
import { VisualProps } from '../shared/types';
import { DataPlaceholder } from '../shared/shared';

interface RelationItem {
  label: string;
  desc?: string;
  value?: number;
}

export const RelationCircularProgress: React.FC<VisualProps> = ({ section, isLoading = false }) => {
  const relationData = section.data as { title?: string; center?: string; relations?: RelationItem[] };

  if (!relationData?.relations || relationData.relations.length === 0) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="Relation" />;
  }

  const colors = [
    { stroke: '#8b5cf6', bg: 'from-violet-500 to-purple-500', text: 'text-violet-600' },
    { stroke: '#3b82f6', bg: 'from-blue-500 to-cyan-500', text: 'text-blue-600' },
    { stroke: '#22c55e', bg: 'from-green-500 to-emerald-500', text: 'text-green-600' },
    { stroke: '#f97316', bg: 'from-orange-500 to-amber-500', text: 'text-orange-600' },
    { stroke: '#ef4444', bg: 'from-red-500 to-rose-500', text: 'text-red-600' },
    { stroke: '#ec4899', bg: 'from-pink-500 to-fuchsia-500', text: 'text-pink-600' },
    { stroke: '#06b6d4', bg: 'from-cyan-500 to-teal-500', text: 'text-cyan-600' },
    { stroke: '#8b5cf6', bg: 'from-indigo-500 to-violet-500', text: 'text-indigo-600' },
  ];

  return (
    <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">{section.title}</h3>

      <div className="flex flex-col items-center justify-center py-8">
        {/* Center Circle */}
        <div className="relative z-10 w-36 h-36 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-center p-4 shadow-xl mb-10">
          <p className="text-base font-bold">{relationData.center || 'Center'}</p>
        </div>

        {/* Relations with Progress */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {relationData.relations.map((rel, index) => {
            const hasValue = rel.value !== undefined;
            const colorSet = colors[index % colors.length];
            const progress = hasValue ? Math.min(100, Math.max(0, rel.value || 0)) : 100;

            return (
              <div key={index} className="flex flex-col items-center gap-3">
                {/* SVG Progress Circle */}
                <div className="relative">
                  <svg width="80" height="80" className="transform">
                    {/* Background circle */}
                    <circle
                      cx="40"
                      cy="40"
                      r="32"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-gray-200 dark:text-zinc-700"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="40"
                      cy="40"
                      r="32"
                      fill="none"
                      stroke={colorSet.stroke}
                      strokeWidth="8"
                      strokeDasharray={2 * Math.PI * 32}
                      strokeDashoffset={2 * Math.PI * 32 * (1 - progress / 100)}
                      strokeLinecap="round"
                      transform="rotate(-90 40 40)"
                      className="transition-all duration-500 ease-out"
                    />
                    {/* Center text */}
                    <text
                      x="40"
                      y="40"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className={`text-sm font-bold ${colorSet.text}`}
                      fill="currentColor"
                    >
                      {hasValue ? `${progress}%` : (index + 1)}
                    </text>
                  </svg>

                  {/* Connecting line to center */}
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-gradient-to-b from-gray-300 to-gray-400 dark:from-zinc-600 dark:to-zinc-500" />
                </div>

                {/* Card */}
                <div className="p-3 bg-gradient-to-br from-gray-50 to-white dark:from-zinc-800 dark:to-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 text-center w-28">
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1 truncate">{rel.label}</h4>
                  {rel.desc && !hasValue && <p className="text-xs text-gray-600 dark:text-zinc-400 truncate">{rel.desc}</p>}
                  {hasValue && rel.desc && <p className="text-xs text-gray-600 dark:text-zinc-400 truncate">{rel.desc}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
