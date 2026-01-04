/**
 * ListCandyCard - Candy-colored gradient cards with playful design
 * Used by: list-grid-candy-card-lite
 */

import React from 'react';
import { VisualProps } from '../shared/types';
import { DataPlaceholder } from '../shared/shared';

interface ListItem {
  label: string;
  desc?: string;
  icon?: string;
}

export const ListCandyCard: React.FC<VisualProps> = ({ section, isLoading = false }) => {
  const listData = section.data as { title?: string; items?: ListItem[] };

  if (!listData?.items || listData.items.length === 0) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="List" />;
  }

  // Candy color schemes - vibrant gradients
  const candyColors = [
    { gradient: 'from-pink-400 to-rose-500', border: 'border-pink-400', bg: 'bg-pink-50', darkBg: 'dark:bg-pink-900/20' },
    { gradient: 'from-violet-400 to-purple-500', border: 'border-violet-400', bg: 'bg-violet-50', darkBg: 'dark:bg-violet-900/20' },
    { gradient: 'from-cyan-400 to-blue-500', border: 'border-cyan-400', bg: 'bg-cyan-50', darkBg: 'dark:bg-cyan-900/20' },
    { gradient: 'from-emerald-400 to-green-500', border: 'border-emerald-400', bg: 'bg-emerald-50', darkBg: 'dark:bg-emerald-900/20' },
    { gradient: 'from-amber-400 to-orange-500', border: 'border-amber-400', bg: 'bg-amber-50', darkBg: 'dark:bg-amber-900/20' },
    { gradient: 'from-fuchsia-400 to-pink-500', border: 'border-fuchsia-400', bg: 'bg-fuchsia-50', darkBg: 'dark:bg-fuchsia-900/20' },
  ];

  return (
    <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">{section.title}</h3>
      {listData.title && <p className="text-center text-gray-500 dark:text-zinc-500 text-sm mb-6">{listData.title}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {listData.items.map((item, index) => {
          const colors = candyColors[index % candyColors.length];
          return (
            <CandyCard key={index} item={item} colors={colors} index={index} />
          );
        })}
      </div>
    </div>
  );
};

interface CandyCardProps {
  item: ListItem;
  colors: { gradient: string; border: string; bg: string; darkBg: string };
  index: number;
}

const CandyCard: React.FC<CandyCardProps> = ({ item, colors, index }) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl border-2 ${colors.border} ${colors.bg} ${colors.darkBg} p-5 hover:shadow-lg hover:scale-105 transition-all duration-300`}>
      {/* Decorative circle */}
      <div className={`absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br ${colors.gradient} opacity-20 rounded-full blur-xl`} />

      {/* Index badge */}
      <div className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
        {index + 1}
      </div>

      {/* Content */}
      <div className="relative">
        {/* Icon placeholder */}
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center mb-3 shadow-md`}>
          <span className="text-2xl">
            {['🍬', '🍭', '🍫', '🧁', '🍩', '🎪'][index % 6]}
          </span>
        </div>

        <h4 className="font-bold text-gray-900 dark:text-white mb-2">{item.label}</h4>
        {item.desc && <p className="text-sm text-gray-600 dark:text-zinc-400">{item.desc}</p>}
      </div>

      {/* Bottom accent */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${colors.gradient}`} />
    </div>
  );
};
