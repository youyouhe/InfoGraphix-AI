import React from 'react';
import { Plus, Minus } from 'lucide-react';

interface ZoomControlsProps {
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
}

export const ZoomControls: React.FC<ZoomControlsProps> = ({
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onZoomReset,
}) => {
  const canZoomIn = zoomLevel < 200;
  const canZoomOut = zoomLevel > 50;

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={onZoomOut}
        disabled={!canZoomOut}
        className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg text-gray-500 dark:text-zinc-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        title="Zoom Out (Ctrl + -)"
      >
        <Minus size={16} />
      </button>

      <button
        onClick={onZoomReset}
        className="px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg text-gray-600 dark:text-zinc-400 text-sm font-mono min-w-[60px] text-center transition-colors"
        title="Reset Zoom (Ctrl + 0)"
      >
        {zoomLevel}%
      </button>

      <button
        onClick={onZoomIn}
        disabled={!canZoomIn}
        className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg text-gray-500 dark:text-zinc-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        title="Zoom In (Ctrl + +)"
      >
        <Plus size={16} />
      </button>
    </div>
  );
};
