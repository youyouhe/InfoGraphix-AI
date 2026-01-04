/**
 * ListZigzag - Alternating left/right zigzag layout
 * Used by: list-zigzag-*
 */

import React from 'react';
import { VisualProps } from '../shared/types';
import { DataPlaceholder } from '../shared/shared';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ListItem {
  label: string;
  desc?: string;
  icon?: string;
}

export const ListZigzag: React.FC<VisualProps> = ({ section, isLoading = false }) => {
  const listData = section.data as { title?: string; items?: ListItem[] };

  if (!listData?.items || listData.items.length === 0) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="List" />;
  }

  // Determine direction from type name
  const isDownDirection = section.type?.includes('down');
  const isCompact = section.type?.includes('compact');

  return (
    <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">{section.title}</h3>
      {listData.title && <p className="text-center text-gray-500 dark:text-zinc-500 text-sm mb-6">{listData.title}</p>}

      <div className="space-y-2">
        {listData.items.map((item, index) => {
          const isLeft = index % 2 === 0;
          return (
            <ZigzagItem
              key={index}
              item={item}
              index={index}
              isLeft={isLeft}
              direction={isDownDirection ? 'down' : 'up'}
              isCompact={isCompact}
              total={listData.items!.length}
            />
          );
        })}
      </div>
    </div>
  );
};

interface ZigzagItemProps {
  item: ListItem;
  index: number;
  isLeft: boolean;
  direction: 'down' | 'up';
  isCompact: boolean;
  total: number;
}

const ZigzagItem: React.FC<ZigzagItemProps> = ({ item, index, isLeft, direction, isCompact, total }) => {
  const colors = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-amber-500',
    'from-red-500 to-rose-500',
    'from-indigo-500 to-violet-500',
  ];
  const gradient = colors[index % colors.length];
  const Icon = direction === 'down' ? ChevronDown : ChevronUp;

  // Calculate connecting line height
  const showConnector = index < total - 1;

  return (
    <div className="relative flex items-center gap-4">
      {/* Left side content */}
      {isLeft ? (
        <>
          <div className={`flex-1 ${isLeft ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block p-4 bg-gradient-to-br from-gray-50 to-white dark:from-zinc-800 dark:to-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 ${isCompact ? 'p-3' : 'p-4'}`}>
              <h4 className={`font-bold text-gray-900 dark:text-white ${isCompact ? 'text-sm' : 'text-base'}`}>{item.label}</h4>
              {item.desc && !isCompact && <p className="text-sm text-gray-600 dark:text-zinc-400 mt-1">{item.desc}</p>}
            </div>
          </div>
          {/* Center node */}
          <div className={`flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold shadow-md z-10`}>
            {index + 1}
          </div>
          <div className="flex-1" />
        </>
      ) : (
        <>
          <div className="flex-1" />
          {/* Center node */}
          <div className={`flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold shadow-md z-10`}>
            {index + 1}
          </div>
          <div className="flex-1">
            <div className={`inline-block p-4 bg-gradient-to-br from-gray-50 to-white dark:from-zinc-800 dark:to-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 ${isCompact ? 'p-3' : 'p-4'}`}>
              <h4 className={`font-bold text-gray-900 dark:text-white ${isCompact ? 'text-sm' : 'text-base'}`}>{item.label}</h4>
              {item.desc && !isCompact && <p className="text-sm text-gray-600 dark:text-zinc-400 mt-1">{item.desc}</p>}
            </div>
          </div>
        </>
      )}

      {/* Connecting line */}
      {showConnector && (
        <div className={`absolute ${direction === 'down' ? 'bottom-0' : 'top-0'} left-1/2 -translate-x-1/2 w-0.5 h-4 bg-gradient-to-b ${gradient}`} style={{ [direction === 'down' ? 'bottom' : 'top']: '-16px' }} />
      )}
    </div>
  );
};
