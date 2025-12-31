import React, { FormEvent, useState } from 'react';
import { HistoryItem, DisplayMode } from '../types';
import { History, Plus, MessageSquare, Trash2, Settings, Command, Cpu, Key, Check, Monitor } from 'lucide-react';
import { LLMServiceFactory, getStoredApiKey } from '../services/factory';

interface SidebarProps {
  history: HistoryItem[];
  onSelectHistory: (id: string) => void;
  onClearHistory: () => void;
  onNewChat: () => void;
  onGenerate: (topic: string) => void;
  isLoading: boolean;
  provider: string;
  onProviderChange: (provider: string) => void;
  model: string;
  onModelChange: (model: string) => void;
  displayMode: DisplayMode;
  onDisplayModeChange: (mode: DisplayMode) => void;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  totalPages?: number;
  onSettingsClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  history,
  onSelectHistory,
  onClearHistory,
  onNewChat,
  onGenerate,
  isLoading,
  provider,
  onProviderChange,
  model,
  onModelChange,
  displayMode,
  onDisplayModeChange,
  currentPage = 0,
  onPageChange,
  totalPages = 0,
  onSettingsClick
}) => {
  const [input, setInput] = useState('');

  // Get available providers and models
  const availableProviders = LLMServiceFactory.getAvailableProviders();
  const availableModels = LLMServiceFactory.getAvailableModels(provider);
  const currentProvider = availableProviders.find(p => p.id === provider) || availableProviders[0];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onGenerate(input);
      setInput('');
    }
  };

  const suggestions = [
    "Evolution of AI models from 2020 to 2024",
    "Comparison between React and Vue ecosystems",
    "Global EV Market Analysis Q3 2024",
    "Lifecycle of a Star: From Nebula to Black Hole"
  ];

  return (
    <div className="w-full md:w-[400px] flex flex-col h-screen bg-gray-50 dark:bg-[#1f2125] border-r border-gray-200 dark:border-zinc-800 flex-shrink-0 transition-colors duration-300">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-zinc-800">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">生成记录</h1>
        <div className="flex gap-2">
           <button onClick={onNewChat} className="p-2 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-lg text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            <Plus size={18} />
          </button>
           <button onClick={onClearHistory} className="p-2 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-lg text-gray-500 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {history.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-zinc-500 mt-10">
            <p>No history yet.</p>
            <p className="text-xs mt-2">Start a new research topic.</p>
          </div>
        ) : (
          history.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectHistory(item.id)}
              className="w-full text-left p-3 rounded-xl bg-white dark:bg-zinc-800/40 hover:bg-gray-100 dark:hover:bg-zinc-800 border border-gray-200 dark:border-transparent hover:border-gray-300 dark:hover:border-zinc-700 transition-all group flex items-center justify-between shadow-sm dark:shadow-none"
            >
              <div className="truncate text-gray-700 dark:text-zinc-300 text-sm font-medium pr-2">{item.query}</div>
              <MessageSquare size={14} className="text-gray-400 dark:text-zinc-600 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all" />
            </button>
          ))
        )}
      </div>

      {/* Suggestions */}
      <div className="p-4 bg-gray-50 dark:bg-[#1f2125] border-t border-gray-200 dark:border-zinc-800">
        <div className="mb-4 flex flex-wrap gap-2">
          {suggestions.map((s, i) => (
            <button 
              key={i} 
              onClick={() => !isLoading && onGenerate(s)}
              className="text-xs bg-white dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white px-3 py-1.5 rounded-full border border-gray-200 dark:border-zinc-700 transition-colors text-left truncate max-w-full shadow-sm dark:shadow-none"
            >
              {s}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if(e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Tell me your topic, I will generate an infographic report..."
            className="w-full bg-white dark:bg-[#2a2b30] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 text-sm rounded-xl p-4 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 border border-gray-300 dark:border-zinc-700 h-24 shadow-sm dark:shadow-none transition-colors"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute bottom-3 right-3 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
          >
            {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Command size={16} />}
          </button>
        </form>
        <div className="mt-3 flex flex-col gap-2">
          {/* Provider and Model Selectors */}
          <div className="flex items-center gap-2">
            {/* Provider Selector */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700 flex-1">
              <Cpu size={12} className="text-zinc-400" />
              <select
                value={provider}
                onChange={(e) => onProviderChange(e.target.value)}
                className="bg-transparent text-xs font-medium outline-none cursor-pointer text-gray-600 dark:text-zinc-400 flex-1"
                disabled={isLoading}
              >
                {availableProviders.map(p => (
                  <option key={p.id} value={p.id} className="text-gray-900 dark:text-white bg-white dark:bg-zinc-900">
                    {p.name}
                  </option>
                ))}
              </select>
              {/* API Key Status Indicator */}
              {getStoredApiKey(provider) ? (
                <Check size={12} className="text-green-500" title="API Key configured" />
              ) : (
                <Key size={12} className="text-orange-500 cursor-pointer" title="No API Key - click to add" />
              )}
            </div>

            {/* Model Selector */}
            {availableModels.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700 flex-1">
                <select
                  value={model}
                  onChange={(e) => onModelChange(e.target.value)}
                  className="bg-transparent text-xs font-medium outline-none cursor-pointer text-gray-600 dark:text-zinc-400 flex-1"
                  disabled={isLoading}
                >
                  {availableModels.map(m => (
                    <option key={m.id} value={m.id} className="text-gray-900 dark:text-white bg-white dark:bg-zinc-900">
                      {m.free ? '🆓 ' : ''}{m.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Display Mode Selector */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700">
            <Monitor size={12} className="text-zinc-400" />
            <select
              value={displayMode}
              onChange={(e) => onDisplayModeChange(e.target.value as DisplayMode)}
              className="bg-transparent text-xs font-medium outline-none cursor-pointer text-gray-600 dark:text-zinc-400 flex-1"
              disabled={isLoading}
            >
              <option value="scroll-vertical">竖屏滚动</option>
              <option value="scroll-horizontal">横屏滚动</option>
              <option value="pagination">翻页模式</option>
            </select>
          </div>

          {/* Pagination Controls (only show in pagination mode) */}
          {displayMode === 'pagination' && totalPages > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg text-gray-500 dark:text-zinc-400 disabled:opacity-50 transition-colors"
                title="Previous page"
              >
                <span className="text-xs">←</span>
              </button>
              <span className="text-xs text-gray-500 dark:text-zinc-400">
                {currentPage === 0
                  ? 'Summary'
                  : currentPage === totalPages - 1
                    ? 'Sources'
                    : `${currentPage}/${totalPages - 2}`}
              </span>
              <button
                onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
                disabled={currentPage >= totalPages - 1}
                className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg text-gray-500 dark:text-zinc-400 disabled:opacity-50 transition-colors"
                title="Next page"
              >
                <span className="text-xs">→</span>
              </button>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-zinc-500 px-1">
            <span className="flex items-center gap-1">
              CMD + Enter to send
            </span>
            {onSettingsClick && (
              <button
                onClick={onSettingsClick}
                className="p-1.5 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded text-gray-500 dark:text-zinc-400 transition-colors"
                title="Settings"
              >
                <Settings size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;