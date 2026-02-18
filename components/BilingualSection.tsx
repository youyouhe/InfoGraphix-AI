import React from 'react';
import { BilingualText, getBilingualText, isBilingualText } from '../types';

interface BilingualSectionProps {
  en: React.ReactNode;
  zh: React.ReactNode;
  layout: 'side-by-side' | 'stacked';
  className?: string;
  children?: React.ReactNode;
}

/**
 * BilingualSection - A wrapper component for displaying bilingual content
 *
 * @param en - English content
 * @param zh - Chinese content
 * @param layout - 'side-by-side' for horizontal layout, 'stacked' for vertical layout
 * @param className - Additional CSS classes
 */
export const BilingualSection: React.FC<BilingualSectionProps> = ({
  en,
  zh,
  layout,
  className = '',
  children
}) => {
  if (layout === 'side-by-side') {
    return (
      <div className={`flex gap-4 md:gap-8 ${className}`}>
        {/* English - Left */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded">
              EN
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-indigo-200 dark:from-indigo-800 to-transparent" />
          </div>
          <div className="text-gray-900 dark:text-white">
            {en}
          </div>
        </div>

        {/* Divider */}
        <div className="w-px bg-gray-200 dark:bg-zinc-700" />

        {/* Chinese - Right */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/30 px-2 py-1 rounded">
              中文
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-rose-200 dark:from-rose-800 to-transparent" />
          </div>
          <div className="text-gray-900 dark:text-white">
            {zh}
          </div>
        </div>

        {children}
      </div>
    );
  }

  // Stacked layout
  return (
    <div className={`space-y-6 ${className}`}>
      {/* English - Top */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded">
            EN
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-indigo-200 dark:from-indigo-800 to-transparent" />
        </div>
        <div className="text-gray-900 dark:text-white">
          {en}
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 dark:via-zinc-700 to-transparent" />
        <span className="text-xs text-gray-400 dark:text-zinc-600">⬍</span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 dark:via-zinc-700 to-transparent" />
      </div>

      {/* Chinese - Bottom */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/30 px-2 py-1 rounded">
            中文
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-rose-200 dark:from-rose-800 to-transparent" />
        </div>
        <div className="text-gray-900 dark:text-white">
          {zh}
        </div>
      </div>

      {children}
    </div>
  );
};

/**
 * Helper component to render bilingual text
 */
export const BilingualText: React.FC<{
  text: BilingualText;
  lang?: 'en' | 'zh';
  className?: string;
}> = ({ text, lang, className = '' }) => {
  if (isBilingualText(text)) {
    // If language is specified, only show that language
    if (lang) {
      return <span className={className}>{text[lang]}</span>;
    }
    // Otherwise show both with a separator
    return (
      <span className={className}>
        {text.en}
        <span className="text-gray-400 mx-1"> / </span>
        <span className="text-rose-600 dark:text-rose-400">{text.zh}</span>
      </span>
    );
  }
  return <span className={className}>{text}</span>;
};

/**
 * Helper to determine layout from display mode
 * scroll-horizontal / pagination → side-by-side
 * scroll-vertical → stacked
 */
export function getBilingualLayout(displayMode: 'scroll-vertical' | 'scroll-horizontal' | 'pagination'): 'side-by-side' | 'stacked' {
  return displayMode === 'scroll-vertical' ? 'stacked' : 'side-by-side';
}

export default BilingualSection;
