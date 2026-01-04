/**
 * HierarchyBadge - Card nodes with badge/label indicators
 * Used by: hierarchy-tree-*-badge-card
 */

import React from 'react';
import { VisualProps, HierarchyNode } from '../shared/types';
import { DataPlaceholder } from '../shared/shared';

export const HierarchyBadge: React.FC<VisualProps> = ({ section, isLoading = false }) => {
  const hierarchyData = section.data as { title?: string; desc?: string; items?: HierarchyNode[] };

  if (!hierarchyData?.items || hierarchyData.items.length === 0) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="Hierarchy" />;
  }

  return (
    <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">{section.title}</h3>
      {hierarchyData.desc && <p className="text-center text-gray-500 dark:text-zinc-500 text-sm mb-6">{hierarchyData.desc}</p>}
      <div className="space-y-4">
        {hierarchyData.items.map((node, idx) => (
          <BadgeNode key={idx} node={node} level={0} index={idx} />
        ))}
      </div>
    </div>
  );
};

const BadgeNode: React.FC<{ node: HierarchyNode; level: number; index: number }> = ({ node, level, index }) => {
  const hasChildren = node.children && node.children.length > 0;
  const indent = level * 24;

  // Badge colors based on level and index
  const badgeColors = [
    'bg-indigo-500',
    'bg-purple-500',
    'bg-blue-500',
    'bg-cyan-500',
    'bg-teal-500',
    'bg-emerald-500',
  ];
  const badgeColor = badgeColors[(level + index) % badgeColors.length];

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3" style={{ marginLeft: `${indent}px` }}>
        {/* Badge indicator */}
        <div className={`flex-shrink-0 w-8 h-8 ${badgeColor} rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
          {level + 1}
        </div>
        {/* Card Node */}
        <div className="flex-1 p-4 bg-gradient-to-r from-gray-50 to-white dark:from-zinc-800 dark:to-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 dark:text-white">{node.label}</span>
              {node.icon && (
                <span className={`px-2 py-0.5 ${badgeColor} text-white text-xs rounded-full`}>
                  {node.icon}
                </span>
              )}
            </div>
            {node.value !== undefined && (
              <span className={`px-3 py-1 ${badgeColor} text-white text-sm font-semibold rounded-lg`}>
                {node.value}
              </span>
            )}
          </div>
        </div>
      </div>
      {hasChildren && (
        <div className="ml-12 space-y-2">
          {node.children!.map((child, idx) => (
            <BadgeNode key={idx} node={child} level={level + 1} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
};
