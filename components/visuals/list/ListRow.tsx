/**
 * ListRow - Horizontal row list with arrows
 * Originally: ListRow (for list-row-horizontal-icon-arrow, list-row-simple-illus)
 */

import React from 'react';
import { VisualProps } from '../shared/types';
import { DataPlaceholder } from '../shared/shared';
import { ArrowRight } from 'lucide-react';

export const ListRow: React.FC<VisualProps> = ({ section, isLoading = false }) => {
  const listData = section.data as { title?: string; items?: { label: string; desc?: string }[] };

  if (!listData?.items || listData.items.length === 0) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="Chart" />;
  }

  return (
    <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">{section.title}</h3>
      {listData.title && <p className="text-center text-gray-500 dark:text-zinc-500 text-sm mb-6">{listData.title}</p>}

      <div className="space-y-3">
        {listData.items.map((item, index) => (
          <div key={index} className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white dark:from-zinc-800 dark:to-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:border-indigo-500/50 transition-colors">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm">
              {index + 1}
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 dark:text-white">{item.label}</h4>
              {item.desc && <p className="text-sm text-gray-600 dark:text-zinc-400 mt-1">{item.desc}</p>}
            </div>
            <ArrowRight size={20} className="text-indigo-500 flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
};
