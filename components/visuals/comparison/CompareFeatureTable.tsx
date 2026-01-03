/**
 * CompareFeatureTable - Feature comparison table with icons and checkmarks
 * Rows are features, columns are options, cells have check/cross/value
 */

import React from 'react';
import { VisualProps } from '../shared/types';
import { DataPlaceholder } from '../shared/shared';
import { Check, X, Minus } from 'lucide-react';
import { Icon } from '../../Icon';

export const CompareFeatureTable: React.FC<VisualProps> = ({ section, isLoading = false }) => {
  const compareData = section.data as {
    title?: string;
    features?: {
      label: string;
      icon?: string;
      optionA?: string | number | boolean;
      optionB?: string | number | boolean;
      optionC?: string | number | boolean;
    }[];
    options?: string[];
  };

  if (!compareData?.features || compareData.features.length === 0) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="Comparison" />;
  }

  const options = compareData.options || ['Option A', 'Option B'];

  const renderCell = (value: string | number | boolean | undefined) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check size={20} className="text-green-500" />
      ) : (
        <X size={20} className="text-red-500" />
      );
    }
    if (value === null || value === undefined) {
      return <Minus size={20} className="text-gray-400" />;
    }
    return <span className="text-sm text-gray-900 dark:text-white">{value}</span>;
  };

  return (
    <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">{section.title}</h3>
      {compareData.title && <p className="text-center text-gray-500 dark:text-zinc-500 text-sm mb-6">{compareData.title}</p>}

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-700">
              <th className="px-4 py-3 font-bold text-gray-700 dark:text-zinc-300 w-1/3">特性</th>
              {options.map((option, index) => (
                <th key={index} className="px-4 py-3 text-center font-bold text-indigo-600 dark:text-indigo-400">
                  {option}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {compareData.features.map((feature, index) => (
              <tr key={index} className="border-b border-zinc-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {feature.icon && <Icon name={feature.icon} size={18} />}
                    <span className="font-medium text-gray-900 dark:text-white">{feature.label}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">{renderCell(feature.optionA)}</td>
                <td className="px-4 py-3 text-center">{renderCell(feature.optionB)}</td>
                {feature.optionC !== undefined && <td className="px-4 py-3 text-center">{renderCell(feature.optionC)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
