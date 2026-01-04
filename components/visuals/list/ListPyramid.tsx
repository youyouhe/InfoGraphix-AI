/**
 * ListPyramid - Pyramid/stacked layout with decreasing width
 * Used by: list-pyramid-*
 */

import React from 'react';
import { VisualProps } from '../shared/types';
import { DataPlaceholder } from '../shared/shared';

interface ListItem {
  label: string;
  desc?: string;
  value?: number;
}

export const ListPyramid: React.FC<VisualProps> = ({ section, isLoading = false }) => {
  const listData = section.data as { title?: string; items?: ListItem[] };

  if (!listData?.items || listData.items.length === 0) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="List" />;
  }

  const isCompact = section.type?.includes('compact');

  return (
    <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">{section.title}</h3>
      {listData.title && <p className="text-center text-gray-500 dark:text-zinc-500 text-sm mb-6">{listData.title}</p>}

      <div className="flex flex-col items-center gap-3">
        {listData.items.map((item, index) => {
          const level = listData.items!.length - index;
          const widthPercent = 50 + (level * 50 / listData.items!.length);
          const colors = [
            'from-amber-500 to-orange-500',
            'from-rose-500 to-pink-500',
            'from-emerald-500 to-teal-500',
            'from-violet-500 to-purple-500',
            'from-sky-500 to-blue-500',
            'from-fuchsia-500 to-pink-500',
          ];
          const gradient = colors[index % colors.length];

          return (
            <PyramidLevel
              key={index}
              item={item}
              widthPercent={widthPercent}
              gradient={gradient}
              level={index + 1}
              isCompact={isCompact}
            />
          );
        })}
      </div>
    </div>
  );
};

interface PyramidLevelProps {
  item: ListItem;
  widthPercent: number;
  gradient: string;
  level: number;
  isCompact: boolean;
}

const PyramidLevel: React.FC<PyramidLevelProps> = ({ item, widthPercent, gradient, level, isCompact }) => {
  return (
    <div
      className="relative flex items-center justify-center p-4 bg-gradient-to-r from-gray-50 to-white dark:from-zinc-800 dark:to-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:shadow-md transition-all"
      style={{ width: `${widthPercent}%` }}
    >
      {/* Level badge */}
      <div className={`absolute left-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-gradient-to-r ${gradient} text-white text-xs font-bold rounded-full`}>
        L{level}
      </div>

      {/* Content */}
      <div className="flex-1 text-center px-8">
        <h4 className={`font-bold text-gray-900 dark:text-white ${isCompact ? 'text-sm' : 'text-base'}`}>{item.label}</h4>
        {item.desc && !isCompact && <p className="text-xs text-gray-600 dark:text-zinc-400 mt-1">{item.desc}</p>}
        {item.value !== undefined && (
          <span className={`ml-2 inline-block px-2 py-0.5 bg-gradient-to-r ${gradient} text-white text-xs rounded-full`}>
            {item.value}
          </span>
        )}
      </div>

      {/* Decorative side border */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${gradient} rounded-l-lg`} />
    </div>
  );
};
