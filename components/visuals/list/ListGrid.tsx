/**
 * ListGrid - Grid-based card list with icons
 * Originally: ListGrid (for list-grid-badge-card, list-grid-candy-card)
 */

import React from 'react';
import { VisualProps } from '../shared/types';
import { DataPlaceholder } from '../shared/shared';
import { IconBadge } from '../../Icon';

export const ListGrid: React.FC<VisualProps> = ({ section, isLoading = false }) => {
  const listData = section.data as { title?: string; items?: { label: string; desc?: string; icon?: string }[] };

  if (!listData?.items || listData.items.length === 0) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="Chart" />;
  }

  return (
    <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">{section.title}</h3>
      {listData.title && <p className="text-center text-gray-500 dark:text-zinc-500 text-sm mb-6">{listData.title}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {listData.items.map((item, index) => (
          <div key={index} className="p-5 bg-gradient-to-br from-gray-50 to-white dark:from-zinc-800 dark:to-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-indigo-500/50 hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-3">
              <IconBadge icon={item.icon} size="md" />
              <h4 className="font-bold text-gray-900 dark:text-white">{item.label}</h4>
            </div>
            {item.desc && <p className="text-sm text-gray-600 dark:text-zinc-400">{item.desc}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};
