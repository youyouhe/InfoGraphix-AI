/**
 * WordCloudChart - Text-based word cloud visualization
 * Displays words with sizes proportional to their values/weights
 */

import React, { useState, useEffect, useMemo } from 'react';
import { VisualProps } from '../shared/types';
import { DataPlaceholder, normalizeChartData, COLORS } from '../shared/shared';

export interface WordCloudChartProps extends VisualProps {}

/**
 * Calculate font size based on value (normalized to range)
 */
function calculateFontSize(value: number, minValue: number, maxValue: number): number {
  const minSize = 12;
  const maxSize = 48;
  if (maxValue === minValue) return (minSize + maxSize) / 2;
  const ratio = (value - minValue) / (maxValue - minValue);
  return minSize + ratio * (maxSize - minSize);
}

/**
 * Simple word layout algorithm - places words in a spiral pattern
 */
interface PositionedWord {
  word: string;
  value: number;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  rotation: number;
}

function layoutWords(words: Array<{ name: string; value: number }>): PositionedWord[] {
  const positioned: PositionedWord[] = [];
  const centerX = 300;
  const centerY = 200;
  const spiralStep = 5;
  const angleStep = 0.5;

  // Sort by value (largest first)
  const sorted = [...words].sort((a, b) => b.value - a.value);
  const maxValue = sorted[0]?.value ?? 1;
  const minValue = sorted[sorted.length - 1]?.value ?? 1;

  for (let i = 0; i < sorted.length; i++) {
    const word = sorted[i];
    const fontSize = calculateFontSize(word.value, minValue, maxValue);
    const color = COLORS[i % COLORS.length];
    const rotation = Math.random() > 0.7 ? (Math.random() > 0.5 ? -90 : 90) : 0;

    // Simple spiral placement
    let angle = 0;
    let radius = 0;
    let x = centerX;
    let y = centerY;
    let placed = false;
    let attempts = 0;
    const maxAttempts = 500;

    while (!placed && attempts < maxAttempts) {
      x = centerX + radius * Math.cos(angle);
      y = centerY + radius * Math.sin(angle);

      // Simple collision detection (very basic)
      const wouldCollide = positioned.some(p => {
        const dx = p.x - x;
        const dy = p.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < (p.fontSize + fontSize) * 0.4;
      });

      if (!wouldCollide) {
        placed = true;
      }

      angle += angleStep;
      radius += (spiralStep * angleStep) / (2 * Math.PI);
      attempts++;
    }

    if (placed) {
      positioned.push({ word: word.name, value: word.value, x, y, fontSize, color, rotation });
    }
  }

  return positioned;
}

export const WordCloudChart: React.FC<WordCloudChartProps> = ({
  section,
  isLoading = false,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = requestAnimationFrame(() => setIsMounted(true));
    return () => cancelAnimationFrame(timer);
  }, []);

  // Normalize chart data
  const chartData = normalizeChartData(section.data);

  // Layout words (must be before early return to keep hooks order consistent)
  const positionedWords = useMemo(() => layoutWords(chartData?.items ?? []), [chartData?.items]);

  if (!chartData?.items || chartData.items.length === 0) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="Chart" />;
  }

  if (!isMounted) {
    return (
      <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm min-h-[300px] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-zinc-300 dark:border-zinc-700 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      {section.title && (
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
          {section.title}
        </h3>
      )}
      {chartData.desc && (
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
          {chartData.desc}
        </p>
      )}
      <div className="bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6">
        <svg
          viewBox="0 0 600 400"
          className="w-full"
          style={{ maxHeight: '350px' }}
        >
          <defs>
            <filter id="word-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          {positionedWords.map((pw, index) => (
            <g
              key={`${pw.word}-${index}`}
              transform={`translate(${pw.x}, ${pw.y}) rotate(${pw.rotation})`}
              style={{
                transition: 'all 0.3s ease',
              }}
            >
              <text
                textAnchor="middle"
                dominantBaseline="middle"
                fill={pw.color}
                fontSize={pw.fontSize}
                fontWeight={pw.value > (positionedWords[0]?.value ?? 1) * 0.7 ? '700' : '500'}
                opacity={0.9}
                style={{
                  cursor: 'pointer',
                  filter: pw.fontSize > 32 ? 'url(#word-glow)' : 'none',
                }}
              >
                {pw.word}
              </text>
              {pw.fontSize > 28 && (
                <title>
                  {pw.word}: {pw.value}
                </title>
              )}
            </g>
          ))}
        </svg>
        {/* Legend as a simple list */}
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {positionedWords.slice(0, 10).map((pw, index) => (
            <span
              key={`legend-${index}`}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800"
            >
              <span
                className="w-2 h-2 rounded-full mr-1"
                style={{ backgroundColor: pw.color }}
              />
              {pw.word}: {pw.value}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Simple variant - uses WordCloudChart as the default
 */
export const WordCloudSimple = WordCloudChart;
