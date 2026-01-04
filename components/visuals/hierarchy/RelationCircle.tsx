/**
 * RelationCircle - Central node with surrounding relations
 * Originally: RelationCircle (for relation-circle-icon-badge, relation-circle-circular-progress)
 */

import React from 'react';
import { VisualProps } from '../shared/types';
import { DataPlaceholder } from '../shared/shared';

export const RelationCircle: React.FC<VisualProps> = ({ section, isLoading = false }) => {
  const relationData = section.data as { title?: string; center?: string; relations?: { label: string; desc?: string }[] };

  if (!relationData?.relations || relationData.relations.length === 0) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="Chart" />;
  }

  return (
    <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">{section.title}</h3>

      <div className="flex flex-col items-center justify-center py-8">
        {/* Center Circle */}
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-center p-4 shadow-lg mb-8">
          <p className="text-sm font-bold">{relationData.center || 'Center'}</p>
        </div>

        {/* Relations */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {relationData.relations.map((rel, index) => (
            <div key={index} className="p-4 bg-gradient-to-br from-gray-50 to-white dark:from-zinc-800 dark:to-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 text-center">
              <div className="text-2xl mb-2">🔗</div>
              <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">{rel.label}</h4>
              {rel.desc && <p className="text-xs text-gray-600 dark:text-zinc-400">{rel.desc}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
