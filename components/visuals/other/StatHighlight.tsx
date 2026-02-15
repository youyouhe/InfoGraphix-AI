/**
 * StatHighlight - Large stat display with trend indicator
 * Originally: StatHighlight
 */

import React from 'react';
import { VisualProps } from '../shared/types';
import { ArrowUp, ArrowDown, Activity } from 'lucide-react';

export const StatHighlight: React.FC<VisualProps> = ({ section }) => {
  const isUp = section.statTrend === 'up';
  const trendColor = isUp ? '#39ff14' : '#ff4500';

  return (
    <div className="mb-8 p-8 bg-gradient-to-br from-gray-50 to-white dark:from-zinc-800 dark:to-zinc-900 rounded-2xl border-2 border-indigo-300 dark:border-indigo-700 shadow-2xl relative overflow-hidden group card-neon-hover neon-border-purple">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-zinc-900 dark:text-white neon-icon" style={{ color: '#6366f1' }}>
        <Activity size={120} />
      </div>
      <h4 className="text-zinc-500 dark:text-zinc-400 text-sm uppercase tracking-widest font-semibold mb-2 neon-text-purple">{section.statLabel}</h4>
      <div className="flex items-baseline gap-4">
        <span className="text-6xl font-black gradient-neon-purple" style={{ filter: 'drop-shadow(0 0 20px #8b5cf6) drop-shadow(0 0 40px #6366f1)' }}>
          {section.statValue}
        </span>
        {section.statTrend && section.statTrend !== 'neutral' && (
          <div
            className={`flex items-center px-3 py-1 rounded-full text-sm font-bold neon-badge ${isUp ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'}`}
            style={{ color: trendColor, '--neon-color': trendColor } as React.CSSProperties}
          >
            {isUp ? <ArrowUp size={16} className="neon-icon" style={{ color: trendColor }} /> : <ArrowDown size={16} className="neon-icon" style={{ color: trendColor }} />}
            <span className="ml-1">Trend</span>
          </div>
        )}
      </div>
      {section.content && <p className="mt-4 text-gray-600 dark:text-zinc-400 text-sm max-w-md">{section.content}</p>}
    </div>
  );
};
