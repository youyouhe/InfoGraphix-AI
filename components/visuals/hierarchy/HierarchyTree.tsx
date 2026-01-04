/**
 * HierarchyTree - Hierarchical tree with nested nodes
 * Originally: HierarchyTree (for hierarchy-tree-*, hierarchy-mindmap-*)
 */

import React from 'react';
import { VisualProps, HierarchyNode } from '../shared/types';
import { DataPlaceholder } from '../shared/shared';
import { Icon } from '../../Icon';

export const HierarchyTree: React.FC<VisualProps> = ({ section, isLoading = false }) => {
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
          <HierarchyNodeItem key={idx} node={node} level={0} />
        ))}
      </div>
    </div>
  );
};

const HierarchyNodeItem: React.FC<{ node: HierarchyNode; level: number }> = ({ node, level }) => {
  const indent = level * 24;
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2" style={{ marginLeft: `${indent}px` }}>
        {node.icon && (
          <div className="flex-shrink-0">
            <Icon name={node.icon} size={18} className="text-indigo-500 dark:text-indigo-400" />
          </div>
        )}
        <div className="flex-1 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-lg border border-indigo-200 dark:border-indigo-800">
          <span className="font-medium text-gray-900 dark:text-white">{node.label}</span>
          {node.value !== undefined && (
            <span className="ml-2 text-sm text-indigo-600 dark:text-indigo-400">({node.value})</span>
          )}
        </div>
      </div>
      {hasChildren && (
        <div className="ml-4 space-y-2">
          {node.children!.map((child, idx) => (
            <HierarchyNodeItem key={idx} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};
