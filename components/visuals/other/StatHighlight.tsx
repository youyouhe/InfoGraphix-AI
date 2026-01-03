/**
 * StatHighlight - Large stat display with trend indicator
 * Originally: StatHighlight
 */

import React from 'react';
import { VisualProps } from '../shared/types';
import { ArrowUp, ArrowDown, Activity } from 'lucide-react';

export const StatHighlight: React.FC<VisualProps> = ({ section }) => {
  const isUp = section.statTrend === 'up';

  return (
    <div className="mb-8 p-8 bg-gradient-to-br from-gray-50 to-white dark:from-zinc-800 dark:to-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-zinc-900 dark:text-white">
        <Activity size={120} />
      </div>
      <h4 className="text-zinc-500 dark:text-zinc-400 text-sm uppercase tracking-widest font-semibold mb-2">{section.statLabel}</h4>
      <div className="flex items-baseline gap-4">
        <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500 dark:from-indigo-400 dark:to-pink-400">
          {section.statValue}
        </span>
        {section.statTrend && section.statTrend !== 'neutral' && (
          <div className={`flex items-center px-3 py-1 rounded-full text-sm font-bold ${isUp ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'}`}>
            {isUp ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
            <span className="ml-1">Trend</span>
          </div>
        )}
      </div>
      {section.content && <p className="mt-4 text-gray-600 dark:text-zinc-400 text-sm max-w-md">{section.content}</p>}
    </div>
  );
};
