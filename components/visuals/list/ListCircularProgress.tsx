/**
 * ListCircularProgress - List items with circular progress indicators
 * Used by: list-*-circular-progress
 */

import React from 'react';
import { VisualProps } from '../shared/types';
import { DataPlaceholder } from '../shared/shared';

interface ListItem {
  label: string;
  desc?: string;
  value: number; // 0-100
  color?: string;
}

export const ListCircularProgress: React.FC<VisualProps> = ({ section, isLoading = false }) => {
  const listData = section.data as { title?: string; items?: ListItem[] };

  if (!listData?.items || listData.items.length === 0) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="List" />;
  }

  const colors = [
    { stroke: '#8b5cf6', bg: 'from-violet-500 to-purple-500', text: 'text-violet-600' },
    { stroke: '#3b82f6', bg: 'from-blue-500 to-cyan-500', text: 'text-blue-600' },
    { stroke: '#22c55e', bg: 'from-green-500 to-emerald-500', text: 'text-green-600' },
    { stroke: '#f97316', bg: 'from-orange-500 to-amber-500', text: 'text-orange-600' },
    { stroke: '#ef4444', bg: 'from-red-500 to-rose-500', text: 'text-red-600' },
    { stroke: '#ec4899', bg: 'from-pink-500 to-fuchsia-500', text: 'text-pink-600' },
  ];

  // Determine if grid or row layout based on type name
  const isGridLayout = section.type?.includes('grid');

  return (
    <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">{section.title}</h3>
      {listData.title && <p className="text-center text-gray-500 dark:text-zinc-500 text-sm mb-6">{listData.title}</p>}

      <div className={isGridLayout ? "grid grid-cols-2 md:grid-cols-4 gap-6" : "space-y-4"}>
        {listData.items.map((item, index) => {
          const colorSet = item.color ? colors[0] : colors[index % colors.length];
          return (
            <CircularProgressItem
              key={index}
              item={item}
              colorSet={colorSet}
              size={isGridLayout ? 'medium' : 'small'}
            />
          );
        })}
      </div>
    </div>
  );
};

interface CircularProgressItemProps {
  item: ListItem;
  colorSet: { stroke: string; bg: string; text: string };
  size: 'small' | 'medium';
}

const CircularProgressItem: React.FC<CircularProgressItemProps> = ({ item, colorSet, size }) => {
  const sizes = {
    small: { width: 60, strokeWidth: 6, fontSize: 'text-xs' },
    medium: { width: 80, strokeWidth: 8, fontSize: 'text-sm' },
  };

  const { width, strokeWidth, fontSize } = sizes[size];
  const radius = (width - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(100, Math.max(0, item.value || 0));
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className={`flex ${size === 'small' ? 'items-center gap-4' : 'flex-col items-center gap-3'} p-4 bg-gradient-to-br from-gray-50 to-white dark:from-zinc-800 dark:to-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700`}>
      {/* SVG Progress Circle */}
      <svg width={width} height={width} className="flex-shrink-0">
        {/* Background circle */}
        <circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-200 dark:text-zinc-700"
        />
        {/* Progress circle */}
        <circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          fill="none"
          stroke={colorSet.stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${width / 2} ${width / 2})`}
          className="transition-all duration-500 ease-out"
        />
        {/* Center text */}
        <text
          x={width / 2}
          y={width / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          className={`${fontSize} font-bold ${colorSet.text}`}
          fill="currentColor"
        >
          {progress}%
        </text>
      </svg>

      {/* Label and description */}
      <div className={size === 'small' ? 'flex-1 min-w-0' : 'text-center'}>
        <h4 className={`font-bold text-gray-900 dark:text-white ${size === 'small' ? 'text-sm' : 'text-base'}`}>{item.label}</h4>
        {item.desc && <p className="text-xs text-gray-600 dark:text-zinc-400 mt-1">{item.desc}</p>}
      </div>
    </div>
  );
};
