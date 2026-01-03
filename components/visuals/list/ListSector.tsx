/**
 * ListSector - Sector-based nested list
 * Originally: ListSector (for list-sector-plain-text)
 */

import React from 'react';
import { VisualProps } from '../shared/types';
import { DataPlaceholder } from '../shared/shared';

export const ListSector: React.FC<VisualProps> = ({ section, isLoading = false }) => {
  const sectorData = section.data as { title?: string; items?: { label: string; items?: string[] }[] };

  if (!sectorData?.items || sectorData.items.length === 0) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="Chart" />;
  }

  return (
    <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">{section.title}</h3>
      {sectorData.title && <p className="text-center text-gray-500 dark:text-zinc-500 text-sm mb-6">{sectorData.title}</p>}

      <div className="space-y-6">
        {sectorData.items.map((sector, index) => (
          <div key={index} className="p-5 bg-gradient-to-br from-gray-50 to-white dark:from-zinc-800 dark:to-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700">
            <h4 className="font-bold text-gray-900 dark:text-white mb-3">{sector.label}</h4>
            <ul className="space-y-2">
              {sector.items?.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-zinc-400">
                  <span className="text-indigo-500">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
