/**
 * ComparisonSection - Table-based comparison for metric vs option A/B
 * Originally: ComparisonSection
 */

import React from 'react';
import { VisualProps } from '../shared/types';
import { DataPlaceholder } from '../shared/shared';

export const ComparisonSection: React.FC<VisualProps> = ({ section, isLoading = false }) => {
  if (!section.comparisonItems || section.comparisonItems.length === 0) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="Comparison" />;
  }

  return (
    <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">{section.title}</h3>
      <div className="w-full overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
        <table className="w-full text-sm text-left text-gray-600 dark:text-zinc-400">
          <thead className="text-xs uppercase bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-zinc-200">
            <tr>
              <th scope="col" className="px-6 py-3 text-center">Metric</th>
              <th scope="col" className="px-6 py-3 text-center text-indigo-600 dark:text-indigo-400">Option A</th>
              <th scope="col" className="px-6 py-3 text-center text-pink-600 dark:text-pink-400">Option B</th>
            </tr>
          </thead>
          <tbody>
            {section.comparisonItems?.map((item, idx) => (
              <tr key={idx} className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white text-center border-r border-gray-200 dark:border-zinc-800/50">{item.label}</td>
                <td className="px-6 py-4 text-center border-r border-gray-200 dark:border-zinc-800/50">{item.left}</td>
                <td className="px-6 py-4 text-center">{item.right}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
