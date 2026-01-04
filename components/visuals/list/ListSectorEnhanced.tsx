/**
 * ListSectorEnhanced - Enhanced sector/pie chart visualization
 * Used by: list-sector-*
 */

import React from 'react';
import { VisualProps } from '../shared/types';
import { DataPlaceholder } from '../shared/shared';

interface ListItem {
  label: string;
  value: number;
  desc?: string;
}

export const ListSectorEnhanced: React.FC<VisualProps> = ({ section, isLoading = false }) => {
  const listData = section.data as { title?: string; items?: ListItem[] };

  if (!listData?.items || listData.items.length === 0) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="List" />;
  }

  // Determine if half circle or full circle
  const isHalfCircle = section.type?.includes('half');

  return (
    <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">{section.title}</h3>
      {listData.title && <p className="text-center text-gray-500 dark:text-zinc-500 text-sm mb-6">{listData.title}</p>}

      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Sector Chart */}
        <div className="flex-shrink-0">
          <SectorChart items={listData.items} isHalf={isHalfCircle} />
        </div>

        {/* Legend */}
        <div className="flex-1 grid grid-cols-2 gap-3">
          {listData.items.map((item, index) => {
            const color = getSectorColor(index);
            return (
              <div key={index} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800">
                <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${color}`} />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 dark:text-white text-sm truncate">{item.label}</div>
                  <div className="text-xs text-gray-500 dark:text-zinc-500">{item.value}{isHalfCircle ? '%' : ''}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface SectorChartProps {
  items: ListItem[];
  isHalf: boolean;
}

const SectorChart: React.FC<SectorChartProps> = ({ items, isHalf }) => {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  const size = isHalf ? 200 : 220;
  const radius = size / 2;
  const center = radius;
  const strokeWidth = 40;

  let currentAngle = isHalf ? 180 : 0; // Start from bottom for half circle, top for full

  // For half circle, we want to start from left (180°) and go to right (0°)
  // For full circle, we start from top (0°)

  return (
    <svg width={size} height={isHalf ? size / 2 + 20 : size} viewBox={`0 0 ${size} ${isHalf ? size / 2 + 20 : size}`}>
      {items.map((item, index) => {
        const percentage = item.value / total;
        const angle = isHalf ? percentage * 180 : percentage * 360;

        const startAngle = currentAngle;
        const endAngle = isHalf ? currentAngle - angle : currentAngle + angle;

        // Convert to radians
        const startRad = (startAngle - 90) * (Math.PI / 180);
        const endRad = (endAngle - 90) * (Math.PI / 180);

        // Calculate coordinates
        const x1 = center + radius * Math.cos(startRad);
        const y1 = center + radius * Math.sin(startRad);
        const x2 = center + radius * Math.cos(endRad);
        const y2 = center + radius * Math.sin(endRad);

        // Large arc flag
        const largeArc = angle > 180 ? 1 : 0;

        // SVG path
        const d = isHalf
          ? `M ${center} ${size / 2 + 20} L ${x1} ${Math.min(y1, size / 2)} A ${radius} ${radius} 0 ${largeArc} 0 ${x2} ${Math.min(y2, size / 2)} Z`
          : `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

        currentAngle = endAngle;

        const color = getSectorColor(index);

        return (
          <g key={index}>
            <path
              d={d}
              fill={`url(#gradient-${index})`}
              stroke="white"
              strokeWidth="2"
              className="hover:opacity-90 transition-opacity cursor-pointer"
            >
              <title>{item.label}: {item.value} ({Math.round(percentage * 100)}%)</title>
            </path>
          </g>
        );
      })}

      {/* Gradients */}
      <defs>
        {items.map((_, index) => {
          const color = getSectorColor(index);
          const colors = color.replace('from-', '').replace('to-', ' ').split(' ');
          return (
            <linearGradient key={index} id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors[0]} />
              <stop offset="100%" stopColor={colors[1]} />
            </linearGradient>
          );
        })}
      </defs>
    </svg>
  );
};

function getSectorColor(index: number): string {
  const colors = [
    'from-violet-500 to-purple-500',
    'from-blue-500 to-cyan-500',
    'from-emerald-500 to-green-500',
    'from-amber-500 to-orange-500',
    'from-rose-500 to-pink-500',
    'from-fuchsia-500 to-pink-500',
    'from-sky-500 to-blue-500',
    'from-teal-500 to-emerald-500',
  ];
  return colors[index % colors.length];
}
