/**
 * ListRibbonCard - Grid cards with ribbon/folded decoration
 * Used by: list-grid-ribbon-card
 */

import React from 'react';
import { VisualProps } from '../shared/types';
import { DataPlaceholder } from '../shared/shared';

interface ListItem {
  label: string;
  desc?: string;
  icon?: string;
}

export const ListRibbonCard: React.FC<VisualProps> = ({ section, isLoading = false }) => {
  const listData = section.data as { title?: string; items?: ListItem[] };

  if (!listData?.items || listData.items.length === 0) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="List" />;
  }

  const ribbonColors = [
    { bg: 'from-rose-500 to-pink-600', border: 'border-rose-500', text: 'text-rose-500' },
    { bg: 'from-amber-500 to-orange-600', border: 'border-amber-500', text: 'text-amber-500' },
    { bg: 'from-emerald-500 to-teal-600', border: 'border-emerald-500', text: 'text-emerald-500' },
    { bg: 'from-violet-500 to-purple-600', border: 'border-violet-500', text: 'text-violet-500' },
    { bg: 'from-sky-500 to-blue-600', border: 'border-sky-500', text: 'text-sky-500' },
    { bg: 'from-fuchsia-500 to-pink-600', border: 'border-fuchsia-500', text: 'text-fuchsia-500' },
  ];

  return (
    <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">{section.title}</h3>
      {listData.title && <p className="text-center text-gray-500 dark:text-zinc-500 text-sm mb-6">{listData.title}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {listData.items.map((item, index) => {
          const ribbon = ribbonColors[index % ribbonColors.length];
          return (
            <RibbonCard key={index} item={item} ribbon={ribbon} index={index} />
          );
        })}
      </div>
    </div>
  );
};

interface RibbonCardProps {
  item: ListItem;
  ribbon: { bg: string; border: string; text: string };
  index: number;
}

const RibbonCard: React.FC<RibbonCardProps> = ({ item, ribbon, index }) => {
  return (
    <div className="relative pt-6">
      {/* Ribbon */}
      <div className="absolute top-0 left-4">
        <div className={`px-3 py-1 bg-gradient-to-r ${ribbon.bg} text-white text-xs font-bold rounded-br-lg rounded-tl-lg shadow-md`}>
          #{String(index + 1).padStart(2, '0')}
        </div>
        {/* Ribbon fold effect */}
        <div className={`w-2 h-2 ${ribbon.bg.replace('to-', 'to-700/30').replace('from-', 'from-600/30')} absolute top-full right-0 transform translate-x-1 rotate-45`} />
      </div>

      {/* Card */}
      <div className={`p-5 bg-gradient-to-br from-white to-gray-50 dark:from-zinc-900 dark:to-zinc-800 rounded-xl border-l-4 ${ribbon.border} shadow-sm hover:shadow-md transition-shadow`}>
        <h4 className="font-bold text-gray-900 dark:text-white mb-2">{item.label}</h4>
        {item.desc && <p className="text-sm text-gray-600 dark:text-zinc-400">{item.desc}</p>}

        {/* Decorative corner */}
        <div className={`absolute bottom-2 right-2 w-12 h-12 bg-gradient-to-br ${ribbon.bg} opacity-5 rounded-bl-full`} />
      </div>
    </div>
  );
};
