/**
 * QuadrantCircular - Four circular quadrants with arc connections
 * Used by: quadrant-quarter-circular
 */

import React from 'react';
import { VisualProps } from '../shared/types';
import { DataPlaceholder } from '../shared/shared';

interface QuadrantItem {
  label: string;
  desc: string;
  icon?: string;
}

export const QuadrantCircular: React.FC<VisualProps> = ({ section, isLoading = false }) => {
  const quadrantData = section.data as { title?: string; desc?: string; items?: QuadrantItem[] };

  if (!quadrantData?.items || quadrantData.items.length === 0) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="Quadrant" />;
  }

  const colors = [
    { bg: 'from-blue-400 to-blue-600', border: 'border-blue-500', text: 'text-blue-600' },
    { bg: 'from-emerald-400 to-emerald-600', border: 'border-emerald-500', text: 'text-emerald-600' },
    { bg: 'from-amber-400 to-amber-600', border: 'border-amber-500', text: 'text-amber-600' },
    { bg: 'from-rose-400 to-rose-600', border: 'border-rose-500', text: 'text-rose-600' },
  ];

  return (
    <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">{section.title}</h3>
      {quadrantData.title && <p className="text-center text-gray-500 dark:text-zinc-500 text-sm mb-2">{quadrantData.title}</p>}
      {quadrantData.desc && <p className="text-center text-gray-600 dark:text-zinc-400 text-sm mb-6 max-w-2xl mx-auto">{quadrantData.desc}</p>}

      <div className="grid grid-cols-2 gap-4">
        {quadrantData.items.map((item, index) => (
          <CircularQuadrant key={index} item={item} color={colors[index]} index={index} />
        ))}
      </div>
    </div>
  );
};

interface CircularQuadrantProps {
  item: QuadrantItem;
  color: { bg: string; border: string; text: string };
  index: number;
}

const CircularQuadrant: React.FC<CircularQuadrantProps> = ({ item, color, index }) => {
  const positions = [
    { arc: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2' },
    { arc: 'top-1/2 right-0 -translate-y-1/2 translate-x-1/2' },
    { arc: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2' },
    { arc: 'top-1/2 left-0 -translate-y-1/2 -translate-x-1/2' },
  ];

  return (
    <div className="relative p-6 bg-gray-50 dark:bg-zinc-800 rounded-xl border-2 border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600 transition-colors">
      {/* Arc indicator */}
      <div className={`absolute w-12 h-12 rounded-full bg-gradient-to-br ${color.bg} flex items-center justify-center text-white font-bold text-lg shadow-lg ${positions[index].arc}`}>
        {index + 1}
      </div>

      {/* Content */}
      <div className="pt-8 text-center">
        <h4 className={`font-bold text-lg mb-3 ${color.text}`}>{item.label}</h4>
        <p className="text-sm text-gray-600 dark:text-zinc-400 whitespace-pre-line leading-relaxed">{item.desc}</p>
      </div>

      {/* Decorative corner */}
      <div className={`absolute bottom-2 right-2 w-16 h-16 bg-gradient-to-br ${color.bg} opacity-10 rounded-full blur-xl`} />
    </div>
  );
};
