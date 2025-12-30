/**
 * Example: Registering a Custom Section Type
 *
 * This file demonstrates how to add a new section type dynamically
 * without modifying the core codebase.
 */

import { registerSectionType } from '../services/registry/sectionRegistry';
import { CoreSectionTypes } from '../types';

// ============================================================
// STEP 1: Create your visual component
// ============================================================

import React from 'react';
import { Clock } from 'lucide-react';

interface TimelineSectionProps {
  section: any;
  isDark?: boolean;
  isLoading?: boolean;
}

const TimelineSection: React.FC<TimelineSectionProps> = ({ section, isDark }) => {
  // Timeline-specific data structure
  const events = section.events || [];

  return (
    <div className="mb-8 p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-lg">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 text-center">{section.title}</h3>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 to-pink-500"></div>

        <div className="space-y-6">
          {events.map((event: any, idx: number) => (
            <div key={idx} className="relative flex items-start gap-4">
              {/* Dot */}
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0 z-10">
                <span className="text-xs font-bold text-white">{idx + 1}</span>
              </div>

              {/* Content */}
              <div className="flex-1 pb-2">
                <div className="text-xs text-indigo-600 dark:text-indigo-400 font-mono mb-1">
                  {event.year}
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white">{event.title}</h4>
                <p className="text-sm text-gray-600 dark:text-zinc-400">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {section.content && <p className="mt-4 text-center text-gray-500 dark:text-zinc-500 text-sm italic">{section.content}</p>}
    </div>
  );
};

// ============================================================
// STEP 2: Define the section type structure (optional, for TypeScript)
// ============================================================

interface TimelineData {
  year: string;
  title: string;
  description: string;
}

// ============================================================
// STEP 3: Register your custom section type
// ============================================================

/**
 * Register the Timeline section type
 * Call this during app initialization (e.g., in App.tsx useEffect)
 */
export function registerTimelineSection() {
  registerSectionType({
    // Unique type identifier
    type: 'timeline',

    // Display name for UI
    displayName: 'Timeline',

    // Category for grouping
    category: 'sequence',

    // The React component
    component: TimelineSection,

    // Required fields (LLM must provide these)
    requiredFields: ['events'],

    // Optional fields
    optionalFields: ['content'],

    // Fields that should NOT be present for this type
    forbiddenFields: ['data', 'steps', 'statValue', 'statLabel', 'comparisonItems'],
  });
}

// ============================================================
// STEP 4: Update TypeScript types (optional)
// ============================================================

/**
 * Extend the InfographicSection interface to include your custom field
 * This is optional but provides better TypeScript support
 */
declare module '../types' {
  interface InfographicSection {
    events?: TimelineData[];
  }
}

// ============================================================
// USAGE EXAMPLE
// ============================================================

/**
 * In your App.tsx or initialization file:
 *
 * import { registerTimelineSection } from './examples/customSectionExample';
 *
 * useEffect(() => {
 *   registerTimelineSection();
 * }, []);
 *
 * Now the LLM can generate sections with type: 'timeline'
 */

// ============================================================
// HOW TO TEST YOUR CUSTOM TYPE
// ============================================================

/**
 * Create a test section to verify rendering:
 *
 * const testSection = {
 *   type: 'timeline',
 *   title: 'Company History',
 *   content: 'Our journey from startup to industry leader',
 *   events: [
 *     { year: '2020', title: 'Founded', description: 'Started in a garage' },
 *     { year: '2022', title: 'Series A', description: 'Raised $10M' },
 *     { year: '2024', title: 'IPO', description: 'Went public' }
 *   ]
 * };
 */

// Export for use
export default TimelineSection;
