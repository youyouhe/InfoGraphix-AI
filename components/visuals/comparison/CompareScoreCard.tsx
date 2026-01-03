/**
 * CompareScoreCard - Comparison with rating scores (stars/numbers)
 * Each item has a visual score indicator
 */

import React from 'react';
import { VisualProps } from '../shared/types';
import { DataPlaceholder } from '../shared/shared';
import { Star, StarHalf } from 'lucide-react';

export const CompareScoreCard: React.FC<VisualProps> = ({ section, isLoading = false }) => {
  const compareData = section.data as {
    title?: string;
    items?: {
      label: string;
      leftScore?: number;
      rightScore?: number;
      leftDesc?: string;
      rightDesc?: string;
    }[];
  };

  if (!compareData?.items || compareData.items.length === 0) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="Comparison" />;
  }

  const renderStars = (score: number, maxScore: number = 5) => {
    const stars = [];
    const fullStars = Math.floor(score);
    const hasHalf = score % 1 >= 0.5;

    for (let i = 0; i < maxScore; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />);
      } else if (i === fullStars && hasHalf) {
        stars.push(<StarHalf key={i} size={16} className="fill-yellow-400 text-yellow-400" />);
      } else {
        stars.push(<Star key={i} size={16} className="text-gray-300 dark:text-zinc-600" />);
      }
    }
    return stars;
  };

  return (
    <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">{section.title}</h3>
      {compareData.title && <p className="text-center text-gray-500 dark:text-zinc-500 text-sm mb-6">{compareData.title}</p>}

      <div className="space-y-4">
        {compareData.items.map((item, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left side - Blue */}
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Option A</span>
                {item.leftScore !== undefined && (
                  <div className="flex items-center gap-1">
                    {renderStars(item.leftScore)}
                    <span className="ml-2 text-sm font-bold text-blue-900 dark:text-blue-100">{item.leftScore}/5</span>
                  </div>
                )}
              </div>
              <p className="font-bold text-gray-900 dark:text-white">{item.label}</p>
              {item.leftDesc && <p className="text-sm text-gray-600 dark:text-zinc-400 mt-1">{item.leftDesc}</p>}
            </div>

            {/* Right side - Pink */}
            <div className="p-4 bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/30 rounded-xl border border-pink-200 dark:border-pink-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-pink-900 dark:text-pink-100">Option B</span>
                {item.rightScore !== undefined && (
                  <div className="flex items-center gap-1">
                    {renderStars(item.rightScore)}
                    <span className="ml-2 text-sm font-bold text-pink-900 dark:text-pink-100">{item.rightScore}/5</span>
                  </div>
                )}
              </div>
              <p className="font-bold text-gray-900 dark:text-white">{item.label}</p>
              {item.rightDesc && <p className="text-sm text-gray-600 dark:text-zinc-400 mt-1">{item.rightDesc}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
