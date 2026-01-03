/**
 * QuadrantIllustrated - Fun illustrated quadrants with emoji/icons
 * Used by: quadrant-simple-illus
 */

import React from 'react';
import { VisualProps } from '../shared/types';
import { DataPlaceholder } from '../shared/shared';

interface QuadrantItem {
  label: string;
  desc: string;
  illus?: string;
}

export const QuadrantIllustrated: React.FC<VisualProps> = ({ section, isLoading = false }) => {
  const quadrantData = section.data as { title?: string; desc?: string; items?: QuadrantItem[] };

  if (!quadrantData?.items || quadrantData.items.length === 0) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="Quadrant" />;
  }

  return (
    <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">{section.title}</h3>
      {quadrantData.title && <p className="text-center text-gray-500 dark:text-zinc-500 text-sm mb-2">{quadrantData.title}</p>}
      {quadrantData.desc && <p className="text-center text-gray-600 dark:text-zinc-400 text-sm mb-6 max-w-2xl mx-auto">{quadrantData.desc}</p>}

      <div className="grid grid-cols-2 gap-4">
        {quadrantData.items.map((item, index) => (
          <IllustratedQuadrant key={index} item={item} index={index} />
        ))}
      </div>
    </div>
  );
};

interface IllustratedQuadrantProps {
  item: QuadrantItem;
  index: number;
}

const IllustratedQuadrant: React.FC<IllustratedQuadrantProps> = ({ item, index }) => {
  // Extract emoji from label if present
  const emojiMatch = item.label.match(/^(\p{Emoji}+)\s/u);
  const emoji = emojiMatch ? emojiMatch[1] : ['🎯', '💡', '🔧', '🏆', '⭐', '🚀', '💎', '🎨'][index % 8];
  const labelWithoutEmoji = item.label.replace(/^\p{Emoji}+\s/u, '');

  const bgColors = [
    'bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 border-pink-200 dark:border-pink-800',
    'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800',
    'bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-amber-200 dark:border-amber-800',
    'bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-200 dark:border-emerald-800',
  ];

  return (
    <div className={`relative p-6 rounded-xl border-2 ${bgColors[index % 4]} hover:shadow-lg transition-all`}>
      {/* Large emoji background */}
      <div className="absolute top-4 right-4 text-6xl opacity-20">
        {emoji}
      </div>

      {/* Emoji icon */}
      <div className="text-center mb-4">
        <span className="text-5xl">{emoji}</span>
      </div>

      {/* Content */}
      <div className="text-center">
        <h4 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">{labelWithoutEmoji || item.label}</h4>
        <p className="text-sm text-gray-600 dark:text-zinc-400 whitespace-pre-line leading-relaxed">{item.desc}</p>
      </div>

      {/* Decorative dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
        {[0, 1, 2].map(i => (
          <div key={i} className={`w-2 h-2 rounded-full ${i === index % 3 ? 'bg-current' : 'bg-gray-300 dark:bg-zinc-600'}`} />
        ))}
      </div>
    </div>
  );
};
