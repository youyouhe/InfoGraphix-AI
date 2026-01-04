/**
 * HierarchyCircleProgress - Circular progress indicators on nodes
 * Used by: hierarchy-mindmap-branch-gradient-circle-progress
 */

import React from 'react';
import { VisualProps, HierarchyNode } from '../shared/types';
import { DataPlaceholder } from '../shared/shared';

export const HierarchyCircleProgress: React.FC<VisualProps> = ({ section, isLoading = false }) => {
  const hierarchyData = section.data as { title?: string; desc?: string; items?: HierarchyNode[] };

  if (!hierarchyData?.items || hierarchyData.items.length === 0) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="Mindmap" />;
  }

  return (
    <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">{section.title}</h3>
      {hierarchyData.desc && <p className="text-center text-gray-500 dark:text-zinc-500 text-sm mb-6">{hierarchyData.desc}</p>}
      <div className="flex justify-center">
        <CircleProgressRoot node={hierarchyData.items[0]} />
      </div>
    </div>
  );
};

const CircleProgressRoot: React.FC<{ node: HierarchyNode }> = ({ node }) => {
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="relative">
      {/* Central Node with Progress */}
      <ProgressCircle label={node.label} value={node.value || 100} size="large" color="purple" />

      {/* Branches */}
      {hasChildren && (
        <div className="flex justify-center gap-10 mt-8">
          {node.children!.map((child, idx) => (
            <CircleProgressBranch key={idx} node={child} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
};

const CircleProgressBranch: React.FC<{ node: HierarchyNode; index: number }> = ({ node, index }) => {
  const hasChildren = node.children && node.children.length > 0;

  const colors = [
    'blue', 'green', 'orange', 'red', 'indigo', 'pink'
  ];
  const color = colors[index % colors.length];

  return (
    <div className="flex flex-col items-center">
      {/* Vertical connection line with gradient */}
      <div className={`w-1 h-10 bg-gradient-to-b from-${color}-500 to-${color}-300 rounded-full`} />

      {/* Branch Node with Progress */}
      <ProgressCircle label={node.label} value={node.value || 75} size="medium" color={color} />

      {/* Sub-branches */}
      {hasChildren && (
        <div className="flex flex-col gap-3 mt-4">
          {node.children!.map((child, childIdx) => (
            <div key={childIdx} className="flex items-center gap-2">
              <div className={`w-0.5 h-4 bg-gradient-to-b ${color === 'purple' ? 'from-purple-400' : `from-${color}-400`} to-transparent`} />
              <ProgressCircle label={child.label} value={child.value || 50} size="small" color={color} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface ProgressCircleProps {
  label: string;
  value: number;
  size: 'large' | 'medium' | 'small';
  color: string;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({ label, value, size, color }) => {
  const sizes = {
    large: { width: 120, strokeWidth: 10, fontSize: 'text-lg' },
    medium: { width: 80, strokeWidth: 7, fontSize: 'text-sm' },
    small: { width: 60, strokeWidth: 5, fontSize: 'text-xs' },
  };

  const { width, strokeWidth, fontSize } = sizes[size];
  const radius = (width - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  const colorClasses = {
    purple: { stroke: '#a855f7', bg: 'from-purple-500 to-fuchsia-500', text: 'text-purple-600' },
    blue: { stroke: '#3b82f6', bg: 'from-blue-500 to-cyan-500', text: 'text-blue-600' },
    green: { stroke: '#22c55e', bg: 'from-green-500 to-emerald-500', text: 'text-green-600' },
    orange: { stroke: '#f97316', bg: 'from-orange-500 to-amber-500', text: 'text-orange-600' },
    red: { stroke: '#ef4444', bg: 'from-red-500 to-rose-500', text: 'text-red-600' },
    indigo: { stroke: '#6366f1', bg: 'from-indigo-500 to-violet-500', text: 'text-indigo-600' },
    pink: { stroke: '#ec4899', bg: 'from-pink-500 to-fuchsia-500', text: 'text-pink-600' },
  };

  const colorClass = colorClasses[color as keyof typeof colorClasses] || colorClasses.purple;

  return (
    <div className="flex flex-col items-center gap-2">
      {/* SVG Progress Circle */}
      <svg width={width} height={width} className="transform">
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
          stroke={colorClass.stroke}
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
          className={`${fontSize} font-bold ${colorClass.text}`}
          fill="currentColor"
        >
          {value}%
        </text>
      </svg>
      {/* Label */}
      <span className={`px-3 py-1 bg-gradient-to-r ${colorClass.bg} text-white text-sm font-medium rounded-full`}>
        {label}
      </span>
    </div>
  );
};
