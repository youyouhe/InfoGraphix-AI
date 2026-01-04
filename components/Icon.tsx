/**
 * Icon Component for Infographic Sections
 * Renders lucide-react icons based on icon name string
 */

import React from 'react';
import { getIconComponent, normalizeIconName } from './iconMapping';
import { LucideIcon } from 'lucide-react';

export interface IconProps {
  /** Icon name (supports 'mdi/robot', 'lucide/brain', 'robot' formats) */
  name: string;
  /** CSS class name */
  className?: string;
  /** Icon size */
  size?: number;
  /** Default fallback icon if name not found */
  fallback?: React.ReactNode;
}

/**
 * Icon component that renders lucide-react icons from string names
 *
 * @example
 * <Icon name="mdi/robot" size={24} />
 * <Icon name="brain" className="text-indigo-500" />
 * <Icon name="unknown-icon" fallback="✓" />
 */
export const Icon: React.FC<IconProps> = ({
  name,
  className = '',
  size = 20,
  fallback = '✓'
}) => {
  const IconComponent = getIconComponent(name);

  if (!IconComponent) {
    // Return fallback if icon not found
    return <span className={className} style={{ fontSize: size }}>{fallback}</span>;
  }

  return <IconComponent className={className} size={size} />;
};

/**
 * Simple icon display component for cards and badges
 * Shows icon with a colored background
 */
export interface IconBadgeProps {
  icon?: string;
  size?: 'sm' | 'md' | 'lg';
  fallback?: string;
  color?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'cyan' | 'violet';
}

const colorClasses = {
  indigo: 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400',
  emerald: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
  amber: 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400',
  rose: 'bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400',
  cyan: 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400',
  violet: 'bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400',
};

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
};

export const IconBadge: React.FC<IconBadgeProps> = ({
  icon,
  size = 'md',
  fallback = '✓',
  color = 'indigo'
}) => {
  const sizeClass = sizeClasses[size];
  const colorClass = colorClasses[color];

  return (
    <div className={`rounded-lg flex items-center justify-center ${sizeClass} ${colorClass}`}>
      <Icon name={icon || fallback} size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />
    </div>
  );
};

export default Icon;
