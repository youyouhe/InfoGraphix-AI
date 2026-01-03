/**
 * HierarchyRibbon - Ribbon/folded card style hierarchy
 * Used by: hierarchy-tree-*-ribbon-card
 */

import React from 'react';
import { VisualProps, HierarchyNode } from '../shared/types';
import { DataPlaceholder } from '../shared/shared';

export const HierarchyRibbon: React.FC<VisualProps> = ({ section, isLoading = false }) => {
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
          <RibbonNode key={idx} node={node} level={0} index={idx} />
        ))}
      </div>
    </div>
  );
};

const RibbonNode: React.FC<{ node: HierarchyNode; level: number; index: number }> = ({ node, level, index }) => {
  const hasChildren = node.children && node.children.length > 0;
  const indent = level * 24;

  // Ribbon colors based on index
  const ribbonColors = [
    { bg: 'from-rose-500 to-pink-500', text: 'text-rose-500' },
    { bg: 'from-amber-500 to-orange-500', text: 'text-amber-500' },
    { bg: 'from-emerald-500 to-teal-500', text: 'text-emerald-500' },
    { bg: 'from-violet-500 to-purple-500', text: 'text-violet-500' },
    { bg: 'from-sky-500 to-blue-500', text: 'text-sky-500' },
  ];
  const ribbon = ribbonColors[index % ribbonColors.length];

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-3" style={{ marginLeft: `${indent}px` }}>
        {/* Ribbon Tag */}
        <div className="relative flex-shrink-0">
          <div className={`px-3 py-1 bg-gradient-to-r ${ribbon.bg} text-white text-xs font-bold rounded-br-lg rounded-tl-lg`}>
            {String(index + 1).padStart(2, '0')}
          </div>
          {/* Ribbon fold effect */}
          <div className={`absolute bottom-0 right-0 w-2 h-2 ${ribbon.bg.replace('to-', 'to-700/30').replace('from-', 'from-600/30')} transform translate-x-1 translate-y-1 rotate-45`} />
        </div>

        {/* Card with Ribbon decoration */}
        <div className="flex-1 p-4 bg-gradient-to-br from-white to-gray-50 dark:from-zinc-900 dark:to-zinc-800 rounded-lg border-l-4 shadow-sm relative overflow-hidden"
             style={{ borderColor: ribbon.text.replace('text-', '').replace('-500', '') }}>
          {/* Decorative corner */}
          <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${ribbon.bg} opacity-10 rounded-bl-full`} />
          <span className="relative font-semibold text-gray-900 dark:text-white">{node.label}</span>
          {node.value !== undefined && (
            <span className={`ml-3 px-2 py-0.5 bg-gradient-to-r ${ribbon.bg} text-white text-sm rounded-full`}>
              {node.value}
            </span>
          )}
        </div>
      </div>
      {hasChildren && (
        <div className="ml-16 space-y-2">
          {node.children!.map((child, idx) => (
            <RibbonNode key={idx} node={child} level={level + 1} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
};
