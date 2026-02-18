/**
 * TextSection - Simple text content with title
 * Originally: TextSection
 */

import React from 'react';
import { VisualProps } from '../shared/types';
import { BilingualText, getBilingualText, isBilingualText } from '../../../types';
import { BilingualSection } from '../../BilingualSection';

export const TextSection: React.FC<VisualProps> = ({ section, isLoading = false }) => {
  const content = section.content as BilingualText | undefined;
  const title = section.title as BilingualText | undefined;

  // Helper to render a single language version of the content
  const renderSingleLanguage = (lang: 'en' | 'zh') => (
    <div className="mb-8 p-6 bg-white dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700/50 shadow-sm dark:shadow-none">
      {title && (
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <div className="w-2 h-6 bg-indigo-500 rounded-full"/>
          {getBilingualText(title, lang)}
        </h3>
      )}
      <p className="text-gray-600 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap text-base">
        {content ? getBilingualText(content, lang) : ''}
      </p>
    </div>
  );

  // Check if this is bilingual content
  if (title && isBilingualText(title) && title.en && title.zh) {
    // Render both languages side-by-side
    return (
      <div className="mb-8">
        <BilingualSection
          en={renderSingleLanguage('en')}
          zh={renderSingleLanguage('zh')}
          layout="side-by-side"
        />
      </div>
    );
  }

  // Single language rendering
  return renderSingleLanguage('en');
};
