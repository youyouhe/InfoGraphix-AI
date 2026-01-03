/**
 * TextSection - Simple text content with title
 * Originally: TextSection
 */

import React from 'react';
import { VisualProps } from '../shared/types';

export const TextSection: React.FC<VisualProps & { content?: string; title?: string }> = ({ content, title }) => (
  <div className="mb-8 p-6 bg-white dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700/50 shadow-sm dark:shadow-none">
    {title && <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><div className="w-2 h-6 bg-indigo-500 rounded-full"/>{title}</h3>}
    <p className="text-gray-600 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap text-base">{content}</p>
  </div>
);
