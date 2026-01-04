/**
 * ListColumn - Vertical column list with checkboxes
 * Originally: ListColumn (for list-column-done-list, list-column-vertical-icon-arrow)
 */

import React from 'react';
import { VisualProps } from '../shared/types';
import { DataPlaceholder } from '../shared/shared';

export const ListColumn: React.FC<VisualProps> = ({ section, isLoading = false }) => {
  const listData = section.data as { title?: string; items?: { label: string; desc?: string; done?: boolean }[] };

  if (!listData?.items || listData.items.length === 0) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="Chart" />;
  }

  return (
    <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">{section.title}</h3>
      {listData.title && <p className="text-center text-gray-500 dark:text-zinc-500 text-sm mb-6">{listData.title}</p>}

      <div className="space-y-3">
        {listData.items.map((item, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 ${item.done ? 'bg-green-500 border-green-500' : 'bg-gray-200 dark:bg-zinc-700'}`}></div>
            <div className="flex-1 p-3 bg-gradient-to-r from-gray-50 to-white dark:from-zinc-800 dark:to-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700">
              <p className="text-sm text-gray-900 dark:text-white">{item.label}</p>
              {item.desc && <p className="text-xs text-gray-500 dark:text-zinc-500 mt-1">{item.desc}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
