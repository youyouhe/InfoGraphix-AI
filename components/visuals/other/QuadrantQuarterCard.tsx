/**
 * QuadrantQuarterCard - Four-quadrant grid with colored cards
 * Originally: QuadrantQuarterCard (for quadrant-quarter-simple-card)
 */

import React from 'react';
import { VisualProps } from '../shared/types';
import { DataPlaceholder } from '../shared/shared';
import { Icon } from '../../Icon';

export const QuadrantQuarterCard: React.FC<VisualProps> = ({ section, isLoading = false }) => {
  // Support both new format (items) and legacy format (quadrants)
  const quadrantData = section.data as {
    title?: string;
    desc?: string;
    items?: { label: string; desc: string; icon?: string; illus?: string }[];
    quadrants?: { label: string; content: string }[];
  };

  // Check if data exists
  if (!quadrantData) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="Chart" />;
  }

  // Use items if available, otherwise fall back to quadrants
  const quadrants = quadrantData.items?.map(item => ({
    label: item.label,
    content: item.desc,
    icon: item.icon,
    illus: item.illus
  })) || quadrantData.quadrants;

  if (!quadrants || quadrants.length === 0) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="Chart" />;
  }

  const getQuadrantColor = (index: number) => {
    const colors = [
      'bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800 text-blue-700 dark:text-blue-400',
      'bg-red-50 dark:bg-red-900/20 dark:border-red-800 text-red-700 dark:text-red-400',
      'bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400',
      'bg-green-50 dark:bg-green-900/20 dark:border-green-800 text-green-700 dark:text-green-400'
    ];
    return colors[index % 4];
  };

  return (
    <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">{section.title}</h3>
      {quadrantData.title && <p className="text-center text-gray-500 dark:text-zinc-500 text-sm mb-2">{quadrantData.title}</p>}
      {quadrantData.desc && <p className="text-center text-gray-600 dark:text-zinc-400 text-sm mb-6 max-w-2xl mx-auto">{quadrantData.desc}</p>}

      <div className="grid grid-cols-2 gap-4">
        {quadrants.map((quadrant, index) => (
          <div key={index} className={`p-6 rounded-xl border ${getQuadrantColor(index)} relative`}>
            {/* Icon at top right if exists */}
            {'icon' in quadrant && quadrant.icon && (
              <div className="absolute top-4 right-4 opacity-20">
                <Icon name={quadrant.icon as string} size={32} />
              </div>
            )}

            {/* Illustration emoji/icon if exists */}
            {'illus' in quadrant && quadrant.illus && (
              <div className="text-center mb-3">
                <Icon name={quadrant.illus} size={28} />
              </div>
            )}

            <h4 className="text-center font-bold text-lg mb-3 whitespace-pre-line">{quadrant.label}</h4>
            <p className="text-sm leading-relaxed">{quadrant.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
