/**
 * SequenceHorizontalZigzag - Horizontal zigzag with alternating cards
 * Used by: sequence-horizontal-zigzag-underline-text
 */

import React from 'react';
import { VisualProps } from '../shared/types';
import { DataPlaceholder } from '../shared/shared';

interface SequenceItem {
  label: string;
  desc: string;
}

export const SequenceHorizontalZigzag: React.FC<VisualProps> = ({ section, isLoading = false }) => {
  const zigzagData = section.data as { title?: string; items?: SequenceItem[] };

  if (!zigzagData?.items || zigzagData.items.length === 0) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="Sequence" />;
  }

  const colors = [
    'from-cyan-400 to-blue-500',
    'from-violet-400 to-purple-500',
    'from-pink-400 to-rose-500',
    'from-emerald-400 to-green-500',
    'from-amber-400 to-orange-500',
    'from-sky-400 to-indigo-500',
  ];

  return (
    <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">{section.title}</h3>
      {zigzagData.title && <p className="text-center text-gray-500 dark:text-zinc-500 text-sm mb-6">{zigzagData.title}</p>}

      <div className="relative max-w-4xl mx-auto py-8">
        {/* Horizontal zigzag line */}
        <svg className="absolute top-1/2 left-0 right-0 -translate-y-1/2 w-full h-24" style={{ zIndex: 0 }}>
          <path
            d={`M 50 ${zigzagData.items.length % 2 === 0 ? '96' : '48'}
                    ${zigzagData.items.map((_, i) => {
                      const x = 100 + (i * 200);
                      const y = i % 2 === 0 ? 48 : 96;
                      return `L ${x} ${y}`;
                    }).join(' ')}`}
            fill="none"
            stroke="url(#zigzagGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="8 4"
          />
          <defs>
            <linearGradient id="zigzagGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>

        {/* Steps */}
        <div className="relative flex justify-between">
          {zigzagData.items.map((item, index) => {
            const isTop = index % 2 === 0;
            const color = colors[index % colors.length];

            return (
              <div key={index} className="flex flex-col items-center" style={{ marginLeft: index === 0 ? '0' : '-50px', marginRight: index === zigzagData.items.length - 1 ? '0' : '-50px' }}>
                {/* Node */}
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold shadow-lg z-10 ${isTop ? 'mb-4' : 'mb-2'}`}>
                  {index + 1}
                </div>

                {/* Card */}
                <div className={`p-4 bg-white dark:bg-zinc-800 rounded-xl border-2 shadow-md hover:shadow-lg transition-all w-40 ${isTop ? 'mb-4 -mt-8' : 'mt-2'} ${color.replace('from-', 'border-').split(' ')[0]}-300 dark:border-opacity-50`}>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-2 text-center">{item.label}</h4>
                  <p className="text-xs text-gray-600 dark:text-zinc-400 text-center leading-snug">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
