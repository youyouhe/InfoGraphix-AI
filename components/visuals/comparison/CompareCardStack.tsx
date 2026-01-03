/**
 * CompareCardStack - Card stack comparison
 * Shows stacked cards with label, title, and items
 */

import React, { useState } from 'react';
import { VisualProps } from '../shared/types';
import { DataPlaceholder } from '../shared/shared';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const CompareCardStack: React.FC<VisualProps> = ({ section, isLoading = false }) => {
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set([0]));

  const compareData = section.data as {
    title?: string;
    stacks?: {
      label: string;
      title: string;
      items?: { label: string; value: string }[];
    }[];
  };

  if (!compareData?.stacks || compareData.stacks.length === 0) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="Comparison" />;
  }

  const toggleCard = (index: number) => {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const STACK_COLORS = [
    {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      label: 'text-blue-700 dark:text-blue-300',
      accent: 'bg-blue-500',
    },
    {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      border: 'border-purple-200 dark:border-purple-800',
      label: 'text-purple-700 dark:text-purple-300',
      accent: 'bg-purple-500',
    },
    {
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-200 dark:border-amber-800',
      label: 'text-amber-700 dark:text-amber-300',
      accent: 'bg-amber-500',
    },
    {
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      border: 'border-emerald-200 dark:border-emerald-800',
      label: 'text-emerald-700 dark:text-emerald-300',
      accent: 'bg-emerald-500',
    },
  ];

  return (
    <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">{section.title}</h3>
      {compareData.title && <p className="text-center text-gray-500 dark:text-zinc-500 text-sm mb-6">{compareData.title}</p>}

      <div className="space-y-4">
        {compareData.stacks.map((stack, stackIndex) => {
          const colors = STACK_COLORS[stackIndex % STACK_COLORS.length];
          const isExpanded = expandedCards.has(stackIndex);

          return (
            <div
              key={stackIndex}
              className={`rounded-lg border-2 ${colors.border} ${colors.bg} overflow-hidden`}
            >
              {/* Card Header - Always visible */}
              <button
                onClick={() => toggleCard(stackIndex)}
                className="w-full px-4 py-3 flex items-center justify-between hover:opacity-80 transition-opacity"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${colors.accent}`} />
                  <div className="text-left">
                    <p className={`text-sm font-bold ${colors.label}`}>{stack.label}</p>
                    <p className="text-xs text-gray-600 dark:text-zinc-400">{stack.title}</p>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className={`w-5 h-5 ${colors.label}`} />
                ) : (
                  <ChevronDown className={`w-5 h-5 ${colors.label}`} />
                )}
              </button>

              {/* Card Items - Expandable */}
              {isExpanded && stack.items && stack.items.length > 0 && (
                <div className="px-4 pb-4 space-y-2">
                  {stack.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex items-center justify-between p-2 bg-white/50 dark:bg-zinc-900/50 rounded border border-zinc-200 dark:border-zinc-700"
                    >
                      <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                        {item.label}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-zinc-500">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
