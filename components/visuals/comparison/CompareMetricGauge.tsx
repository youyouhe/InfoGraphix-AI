/**
 * CompareMetricGauge - Metric comparison with gauge/progress indicators
 * Each option has a metric with visual gauge showing the value
 */

import React, { useState, useEffect } from 'react';
import { VisualProps } from '../shared/types';
import { DataPlaceholder } from '../shared/shared';

export const CompareMetricGauge: React.FC<VisualProps> = ({ section, isLoading = false }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = requestAnimationFrame(() => setIsMounted(true));
    return () => cancelAnimationFrame(timer);
  }, []);

  const compareData = section.data as {
    title?: string;
    metrics?: {
      label: string;
      optionA?: number;
      optionB?: number;
    }[];
  };

  if (!compareData?.metrics || compareData.metrics.length === 0) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="Comparison" />;
  }

  if (!isMounted) {
    return (
      <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm min-h-[300px] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-zinc-300 dark:border-zinc-700 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">{section.title}</h3>
      {compareData.title && <p className="text-center text-gray-500 dark:text-zinc-500 text-sm mb-6">{compareData.title}</p>}

      <div className="space-y-6">
        {compareData.metrics.map((metric, index) => (
          <div key={index}>
            <p className="text-center font-medium text-gray-700 dark:text-zinc-300 mb-3">{metric.label}</p>

            <div className="grid grid-cols-2 gap-6">
              {/* Option A - Blue */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Option A</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {metric.optionA ?? 0}
                  </span>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-1000"
                    style={{
                      width: `${((metric.optionA ?? 0) / 100) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Option B - Pink */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-pink-600 dark:text-pink-400">Option B</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {metric.optionB ?? 0}
                  </span>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-pink-500 to-pink-600 rounded-full transition-all duration-1000"
                    style={{
                      width: `${((metric.optionB ?? 0) / 100) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
