/**
 * ListSector - Enhanced sector-based nested list with visual improvements
 * Used by: list-sector-plain-text
 */

import React from 'react';
import { VisualProps } from '../shared/types';
import { DataPlaceholder } from '../shared/shared';

interface SectorItem {
  label: string;
  items?: string[];
}

export const ListSector: React.FC<VisualProps> = ({ section, isLoading = false }) => {
  const sectorData = section.data as { title?: string; items?: SectorItem[] };

  if (!sectorData?.items || sectorData.items.length === 0) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="Chart" />;
  }

  return (
    <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">{section.title}</h3>
      {sectorData.title && <p className="text-center text-gray-500 dark:text-zinc-500 text-sm mb-6">{sectorData.title}</p>}

      <div className="space-y-5">
        {sectorData.items.map((sector, index) => {
          const theme = getTheme(index);
          return (
            <SectorCard key={index} sector={sector} theme={theme} index={index} />
          );
        })}
      </div>
    </div>
  );
};

interface SectorCardProps {
  sector: SectorItem;
  theme: ThemeConfig;
  index: number;
}

const SectorCard: React.FC<SectorCardProps> = ({ sector, theme, index }) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl border-2 ${theme.border} ${theme.bgLight} ${theme.bgDark} p-5 hover:shadow-lg hover:scale-[1.01] transition-all duration-300`}>
      {/* Decorative background elements */}
      <div className={`absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br ${theme.gradient} opacity-10 rounded-full blur-2xl`} />
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${theme.gradient}`} />

      {/* Header with icon and title */}
      <div className="relative flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center shadow-md`}>
          <span className="text-white font-bold text-lg">{index + 1}</span>
        </div>
        <h4 className={`flex-1 font-bold text-lg ${theme.text}`}>{sector.label}</h4>
      </div>

      {/* Items list */}
      <ul className="relative space-y-2.5 ml-1">
        {sector.items?.map((item, i) => (
          <li key={i} className={`flex items-start gap-3 text-sm ${theme.textMuted} group/item`}>
            <span className={`mt-1 w-5 h-5 rounded-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center flex-shrink-0 shadow-sm`}>
              <span className="text-white text-xs font-bold">{i + 1}</span>
            </span>
            <span className="flex-1 group-hover/item:text-gray-900 dark:group-hover/item:text-white transition-colors">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

interface ThemeConfig {
  gradient: string;
  border: string;
  bgLight: string;
  bgDark: string;
  text: string;
  textMuted: string;
}

function getTheme(index: number): ThemeConfig {
  const themes: ThemeConfig[] = [
    {
      gradient: 'from-violet-500 to-purple-500',
      border: 'border-violet-200 dark:border-violet-800',
      bgLight: 'bg-violet-50/50',
      bgDark: 'dark:bg-violet-950/30',
      text: 'text-violet-900 dark:text-violet-100',
      textMuted: 'text-violet-700/80 dark:text-violet-300/70',
    },
    {
      gradient: 'from-blue-500 to-cyan-500',
      border: 'border-blue-200 dark:border-blue-800',
      bgLight: 'bg-blue-50/50',
      bgDark: 'dark:bg-blue-950/30',
      text: 'text-blue-900 dark:text-blue-100',
      textMuted: 'text-blue-700/80 dark:text-blue-300/70',
    },
    {
      gradient: 'from-emerald-500 to-green-500',
      border: 'border-emerald-200 dark:border-emerald-800',
      bgLight: 'bg-emerald-50/50',
      bgDark: 'dark:bg-emerald-950/30',
      text: 'text-emerald-900 dark:text-emerald-100',
      textMuted: 'text-emerald-700/80 dark:text-emerald-300/70',
    },
    {
      gradient: 'from-amber-500 to-orange-500',
      border: 'border-amber-200 dark:border-amber-800',
      bgLight: 'bg-amber-50/50',
      bgDark: 'dark:bg-amber-950/30',
      text: 'text-amber-900 dark:text-amber-100',
      textMuted: 'text-amber-700/80 dark:text-amber-300/70',
    },
    {
      gradient: 'from-rose-500 to-pink-500',
      border: 'border-rose-200 dark:border-rose-800',
      bgLight: 'bg-rose-50/50',
      bgDark: 'dark:bg-rose-950/30',
      text: 'text-rose-900 dark:text-rose-100',
      textMuted: 'text-rose-700/80 dark:text-rose-300/70',
    },
    {
      gradient: 'from-fuchsia-500 to-pink-500',
      border: 'border-fuchsia-200 dark:border-fuchsia-800',
      bgLight: 'bg-fuchsia-50/50',
      bgDark: 'dark:bg-fuchsia-950/30',
      text: 'text-fuchsia-900 dark:text-fuchsia-100',
      textMuted: 'text-fuchsia-700/80 dark:text-fuchsia-300/70',
    },
  ];
  return themes[index % themes.length];
}
