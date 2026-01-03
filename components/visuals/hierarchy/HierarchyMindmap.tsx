/**
 * HierarchyMindmap - Mindmap style with radial branches and gradient connections
 * Used by: hierarchy-mindmap-branch-gradient-*
 */

import React from 'react';
import { VisualProps, HierarchyNode } from '../shared/types';
import { DataPlaceholder } from '../shared/shared';

export const HierarchyMindmap: React.FC<VisualProps> = ({ section, isLoading = false }) => {
  const hierarchyData = section.data as { title?: string; desc?: string; items?: HierarchyNode[] };

  if (!hierarchyData?.items || hierarchyData.items.length === 0) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="Mindmap" />;
  }

  return (
    <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">{section.title}</h3>
      {hierarchyData.desc && <p className="text-center text-gray-500 dark:text-zinc-500 text-sm mb-6">{hierarchyData.desc}</p>}
      <div className="flex justify-center">
        <MindmapRoot node={hierarchyData.items[0]} />
      </div>
    </div>
  );
};

const MindmapRoot: React.FC<{ node: HierarchyNode }> = ({ node }) => {
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="relative">
      {/* Central Node */}
      <div className="relative z-10 px-6 py-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-lg">
        <span className="text-white font-bold text-lg">{node.label}</span>
      </div>

      {/* Branches */}
      {hasChildren && (
        <div className="flex justify-center gap-8 mt-8">
          {node.children!.map((child, idx) => (
            <MindmapBranch key={idx} node={child} index={idx} total={node.children!.length} />
          ))}
        </div>
      )}
    </div>
  );
};

const MindmapBranch: React.FC<{ node: HierarchyNode; index: number; total: number }> = ({ node, index, total }) => {
  const hasChildren = node.children && node.children.length > 0;

  // Calculate gradient based on position
  const gradients = [
    'from-blue-500 to-cyan-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-amber-500',
    'from-red-500 to-rose-500',
    'from-indigo-500 to-violet-500',
    'from-pink-500 to-fuchsia-500',
  ];
  const gradient = gradients[index % gradients.length];

  return (
    <div className="flex flex-col items-center">
      {/* Vertical connection line */}
      <div className={`w-0.5 h-8 bg-gradient-to-b ${gradient}`} />

      {/* Branch Node */}
      <div className={`relative z-10 px-4 py-2 bg-gradient-to-r ${gradient} rounded-full shadow-md`}>
        <span className="text-white font-semibold text-sm">{node.label}</span>
      </div>

      {/* Sub-branches */}
      {hasChildren && (
        <div className="flex flex-col gap-2 mt-3">
          {node.children!.map((child, childIdx) => (
            <div key={childIdx} className="flex items-center gap-2">
              <div className={`w-0.5 h-3 bg-gradient-to-b ${gradient}`} />
              <div className={`px-3 py-1.5 bg-gradient-to-r ${gradient} rounded-full`}>
                <span className="text-white text-xs font-medium">{child.label}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
