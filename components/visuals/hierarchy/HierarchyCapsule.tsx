/**
 * HierarchyCapsule - Capsule-shaped nodes with horizontal hierarchy
 * Used by: hierarchy-tree-*-capsule-item
 */

import React from 'react';
import { VisualProps, HierarchyNode } from '../shared/types';
import { DataPlaceholder } from '../shared/shared';

export const HierarchyCapsule: React.FC<VisualProps> = ({ section, isLoading = false }) => {
  const hierarchyData = section.data as { title?: string; desc?: string; items?: HierarchyNode[] };

  if (!hierarchyData?.items || hierarchyData.items.length === 0) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="Hierarchy" />;
  }

  return (
    <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">{section.title}</h3>
      {hierarchyData.desc && <p className="text-center text-gray-500 dark:text-zinc-500 text-sm mb-6">{hierarchyData.desc}</p>}
      <div className="space-y-3">
        {hierarchyData.items.map((node, idx) => (
          <CapsuleNode key={idx} node={node} level={0} />
        ))}
      </div>
    </div>
  );
};

const CapsuleNode: React.FC<{ node: HierarchyNode; level: number }> = ({ node, level }) => {
  const indent = level * 28;
  const hasChildren = node.children && node.children.length > 0;

  // Capsule gradient based on level
  const gradients = [
    'from-indigo-500 to-purple-500',
    'from-blue-500 to-cyan-500',
    'from-teal-500 to-emerald-500',
    'from-green-500 to-lime-500',
  ];
  const gradient = gradients[level % gradients.length];

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3" style={{ marginLeft: `${indent}px` }}>
        {/* Connection line */}
        {level > 0 && (
          <div className={`w-6 h-0.5 bg-gradient-to-r ${gradient}`} />
        )}
        {/* Capsule Node */}
        <div className={`flex-1 px-5 py-2.5 bg-gradient-to-r ${gradient} rounded-full shadow-sm`}>
          <span className="text-white font-medium">{node.label}</span>
          {node.value !== undefined && (
            <span className="ml-2 text-white/80 text-sm">({node.value})</span>
          )}
        </div>
      </div>
      {hasChildren && (
        <div className="ml-8 space-y-2">
          {node.children!.map((child, idx) => (
            <CapsuleNode key={idx} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};
