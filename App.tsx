import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import SettingsModal from './components/SettingsModal';
import { LLMServiceFactory, saveApiKey, getStoredApiKey } from './services/factory';
import { HistoryItem, InfographicReport, SectionType, DisplayMode } from './types';
import { TextSection, StatHighlight, ChartSection, ProcessFlow, ComparisonSection } from './components/Visuals';
import { VisualTypesGallery } from './components/VisualTypesGallery';
import { Share2, Download, ExternalLink, Sparkles, ArrowDown, Loader2, Moon, Sun, Bug, X, Key, Monitor, Settings, PanelLeftClose, PanelLeftOpen, Languages, Grid3x3 } from 'lucide-react';
import { t, tp } from './i18n';
import { registerCoreSectionTypes } from './services/registry/coreSections';
import { sectionRegistry } from './services/registry/sectionRegistry';
import { ImageExporter } from './services/export/svgExporter';
import { loadHistory, saveHistory, clearHistoryStorage } from './services/historyStorage';
import { Language, getInitialLanguage, saveLanguage, UILanguage, getInitialUILanguage, saveUILanguage } from './i18n';
import { debugStore } from './services/debugStore';

export default function App() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentReport, setCurrentReport] = useState<InfographicReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showDebug, setShowDebug] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [debugMode, setDebugMode] = useState<'report' | 'fewshot' | 'recommended'>('report');
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [provider, setProvider] = useState(() => LLMServiceFactory.getDefaultProvider());
  const [model, setModel] = useState(() => {
    const providers = LLMServiceFactory.getAvailableProviders();
    const defaultProvider = providers.find(p => p.id === LLMServiceFactory.getDefaultProvider());
    return defaultProvider?.defaultModel || '';
  });
  // UI language for interface (en/zh only)
  const [uiLanguage, setUiLanguage] = useState<UILanguage>(() => getInitialUILanguage());
  // Output language for LLM (8 languages)
  const [language, setLanguage] = useState<Language>(() => getInitialLanguage());
  // Section count for generated output
  const [sectionCount, setSectionCount] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('infographix_section_count');
      if (saved) return parseInt(saved);
    }
    return 5; // Default
  });

  // Display Mode state
  const [displayMode, setDisplayMode] = useState<DisplayMode>('scroll-vertical');
  const [currentPage, setCurrentPage] = useState(0);

  // API Key Modal state
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [apiKeyProvider, setApiKeyProvider] = useState('');

  // Settings Modal state
  const [showSettings, setShowSettings] = useState(false);

  // Track if history has been loaded from storage
  const historyLoadedRef = useRef(false);

  // Initialize core section types on mount
  useEffect(() => {
    registerCoreSectionTypes();
  }, []);

  // Load history from localStorage on mount (only once)
  useEffect(() => {
    if (!historyLoadedRef.current) {
      const savedHistory = loadHistory();
      if (savedHistory.length > 0) {
        setHistory(savedHistory);
      }
      historyLoadedRef.current = true;
    }
  }, []);

  // Save history to localStorage whenever it changes (after initial load)
  useEffect(() => {
    if (historyLoadedRef.current) {
      saveHistory(history);
    }
  }, [history]);

  // Update model when provider changes
  useEffect(() => {
    const providers = LLMServiceFactory.getAvailableProviders();
    const currentProvider = providers.find(p => p.id === provider);
    if (currentProvider) {
      setModel(currentProvider.defaultModel);
    }
  }, [provider]);

  // Save language to localStorage when it changes
  useEffect(() => {
    saveLanguage(language);
  }, [language]);

  // Save UI language to localStorage when it changes
  useEffect(() => {
    saveUILanguage(uiLanguage);
  }, [uiLanguage]);

  const contentRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const horizontalScrollRef = useRef<HTMLDivElement>(null);
  const captureContainerRef = useRef<HTMLDivElement>(null);
  const prevSectionCount = useRef(0);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Smooth scroll to bottom (vertical) or right (horizontal) when new sections are added during streaming
  useEffect(() => {
    if (!currentReport) {
      prevSectionCount.current = 0;
      return;
    }

    const currentCount = currentReport.sections?.length || 0;

    if (loading && currentCount > prevSectionCount.current) {
      // Small timeout to allow render
      setTimeout(() => {
        if (displayMode === 'scroll-horizontal') {
          // Use horizontal scroll ref for horizontal mode
          if (horizontalScrollRef.current) {
            horizontalScrollRef.current.scrollTo({
              left: horizontalScrollRef.current.scrollWidth,
              behavior: 'smooth'
            });
          }
        } else {
          // Use main scroll ref for vertical mode
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
              top: scrollContainerRef.current.scrollHeight,
              behavior: 'smooth'
            });
          }
        }
      }, 100);
    }

    prevSectionCount.current = currentCount;
  }, [currentReport?.sections?.length, loading, displayMode]);

  const handleGenerate = async (topic: string) => {
    // Check if API key is available, if not, show modal
    if (!getStoredApiKey(provider)) {
      setApiKeyProvider(provider);
      setApiKeyInput('');
      setShowApiKeyModal(true);
      return;
    }

    setLoading(true);
    setError(null);
    setCurrentReport(null);

    try {
      // Create provider instance using factory
      const llmService = LLMServiceFactory.create(provider);

      const report = await llmService.generateInfographic(topic, (partialReport) => {
        // Stream update: only update if we have meaningful content
        if (partialReport.title || (partialReport.sections && partialReport.sections.length > 0)) {
          const normalized = normalizeReport(partialReport);
          setCurrentReport(prev => ({
            ...normalized,
            // Defensive: ensure sections is always an array
            sections: normalized.sections || [],
            // Keep sources if we already had them (though usually sources come last)
            sources: prev?.sources || normalized.sources
          }));
        }
      }, { model, language, sectionCount });  // Pass the selected model, language, and section count

      // Normalize final report
      const normalizedReport = normalizeReport(report);

      // Final success state
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        query: topic,
        timestamp: Date.now(),
        report: normalizedReport
      };

      setHistory(prev => [newHistoryItem, ...prev]);
      setCurrentReport(normalizedReport);
    } catch (err: any) {
      setError(err.message || "Failed to generate infographic. Please check your API key.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHistory = (id: string) => {
    const item = history.find(h => h.id === id);
    if (item && item.report) {
      setCurrentReport(normalizeReport(item.report));
      setError(null);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    setCurrentReport(null);
    clearHistoryStorage();
  };

  const handleNewChat = () => {
    setCurrentReport(null);
    setError(null);
  };

  // Handle API Key submission
  const handleApiKeySubmit = async () => {
    const trimmedKey = apiKeyInput.trim();
    if (!trimmedKey) {
      setError('API key cannot be empty');
      return;
    }

    // Save to both localStorage and Tauri store (if available)
    await saveApiKey(apiKeyProvider, trimmedKey);

    // Close modal
    setShowApiKeyModal(false);
    setApiKeyInput('');
    setApiKeyProvider('');

    // Auto-trigger generation
    // Get the last input from history or use a placeholder
    const lastInput = history.length > 0 ? history[0].query : '';
    if (lastInput) {
      handleGenerate(lastInput);
    }
  };

  // Handle API Key modal cancellation
  const handleApiKeyCancel = () => {
    setShowApiKeyModal(false);
    setApiKeyInput('');
    setApiKeyProvider('');
    setError(null);
  };

  // Check if provider has API key (for UI display)
  const hasApiKey = (providerId: string): boolean => {
    return !!getStoredApiKey(providerId);
  };

  // Get total pages count for pagination
  const getTotalPages = (report: InfographicReport | null): number => {
    if (!report || !report.sections) return 0;
    // 1 for summary + sections + 1 for sources (if exists)
    return 1 + report.sections.length + (report.sources && report.sources.length > 0 ? 1 : 0);
  };

  // Normalize report fields - handle field name variations from LLM
  const normalizeReport = (report: any): InfographicReport => {
    if (!report) return report;

    // Handle wrapped response: { infographic_report: { title, summary, sections }, title, summary }
    if (report.infographic_report) {
      report = report.infographic_report;
    }

    return {
      ...report,
      // Map reportTitle/reportSummary to title/summary
      title: report.title || report.reportTitle || '',
      summary: report.summary || report.reportSummary || '',
      // Normalize sections data - handle nested data objects from LLM
      sections: report.sections?.map((section: any) => {
        if (!section) return section;
        // Handle nested data object: { title: "...", data: [...], unit: "..." }
        // Only extract nestedData.data if it exists (for legacy format)
        // Otherwise keep the original data object (for { title, items } format used by chart-column-simple, etc.)
        if (section.data && typeof section.data === 'object' && !Array.isArray(section.data)) {
          const nestedData = section.data;
          // Only restructure if there's a 'data' property (legacy format)
          // Otherwise keep the data object as-is (new format with items/relations/etc.)
          if (nestedData.data && Array.isArray(nestedData.data)) {
            return {
              ...section,
              title: nestedData.title || section.title,
              data: nestedData.data,
            };
          }
          // For new format { title, items, relations, etc. }, keep data intact
          // but extract the title if it exists
          if (nestedData.title) {
            return {
              ...section,
              title: nestedData.title,
            };
          }
        }
        return section;
      }),
    };
  };

  // Handle PNG export - export current page or all pages
  const handleExportJpg = async (mode: 'current' | 'all' = 'current') => {
    if (!currentReport || !captureContainerRef.current) return;

    try {
      const exporter = new ImageExporter();

      // Helper function to get section elements from capture container
      const getSectionElement = (type: 'title' | 'section' | 'sources', index?: number) => {
        if (!captureContainerRef.current) return null;

        if (type === 'title') {
          return captureContainerRef.current.querySelector('[data-export-page="title"]') as HTMLElement;
        }
        if (type === 'section' && index !== undefined) {
          return captureContainerRef.current.querySelector(`[data-export-page="section-${index}"]`) as HTMLElement;
        }
        if (type === 'sources') {
          return captureContainerRef.current.querySelector('[data-export-page="sources"]') as HTMLElement;
        }
        return null;
      };

      // Sanitize filename
      const sanitizedTitle = currentReport.title
        .replace(/[<>:"/\\|?*]/g, '')
        .substring(0, 50);

      if (mode === 'current') {
        // Export current page only
        await exporter.exportSinglePage(currentReport, currentPage, getSectionElement, sanitizedTitle, isDarkMode);
      } else {
        // Export all pages
        await exporter.exportAllPages(currentReport, getSectionElement, sanitizedTitle, isDarkMode);
      }
    } catch (err: any) {
      console.error('PNG export failed:', err);
      setError('Failed to export PNG. Please try again.');
    }
  };

  // Render a specific section based on its type (dynamic from registry)
  const renderSection = (section: any, index: number) => {
    // Defensive check for null/undefined section
    if (!section) {
      return (
        <div key={index} className="mb-8 p-6 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
          <h3 className="text-lg font-bold text-red-800 dark:text-red-200 mb-2">Section Error</h3>
          <p className="text-sm text-red-700 dark:text-red-300">Section data is missing at index {index}.</p>
        </div>
      );
    }

    const props = { ...section, isDark: isDarkMode, isLoading: loading };

    // Try to get component from registry
    const sectionDef = sectionRegistry.get(section.type);
    if (sectionDef) {
      const Component = sectionDef.component;
      return <Component key={index} {...props} section={section} />;
    }

    // Fallback to switch statement for core types (backwards compatibility)
    switch (section.type) {
      case 'text':
        return <TextSection key={index} {...props} />;
      case 'stat_highlight':
        return <StatHighlight key={index} section={section} isDark={isDarkMode} isLoading={loading} />;
      case 'bar_chart':
      case 'pie_chart':
        return <ChartSection key={index} section={section} isDark={isDarkMode} isLoading={loading} />;
      case 'process_flow':
        return <ProcessFlow key={index} section={section} isDark={isDarkMode} isLoading={loading} />;
      case 'comparison':
        return <ComparisonSection key={index} section={section} isDark={isDarkMode} isLoading={loading} />;
      default:
        // Unknown section type - render a placeholder
        return (
          <div key={index} className="mb-8 p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
            <h3 className="text-lg font-bold text-yellow-800 dark:text-yellow-200 mb-2">Unknown Section Type: {section.type}</h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">This section type is not registered.</p>
            <pre className="text-xs bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded mt-2 overflow-auto">
              {JSON.stringify(section, null, 2)}
            </pre>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-gray-50 dark:bg-[#161618] overflow-hidden text-gray-900 dark:text-white transition-colors duration-300">
      {/* Left Sidebar */}
      {sidebarVisible && <Sidebar
        history={history}
        onSelectHistory={handleSelectHistory}
        onClearHistory={handleClearHistory}
        onNewChat={handleNewChat}
        onGenerate={handleGenerate}
        isLoading={loading}
        provider={provider}
        onProviderChange={setProvider}
        model={model}
        onModelChange={setModel}
        displayMode={displayMode}
        onDisplayModeChange={setDisplayMode}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        totalPages={getTotalPages(currentReport)}
        onSettingsClick={() => setShowSettings(true)}
        uiLanguage={uiLanguage}
        language={language}
        onLanguageChange={setLanguage}
        sectionCount={sectionCount}
        onSectionCountChange={(count) => {
          setSectionCount(count);
          if (typeof window !== 'undefined') {
            localStorage.setItem('infographix_section_count', count.toString());
          }
        }}
      />}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Top Bar */}
        <div className="h-16 bg-white dark:bg-[#1a1b1e] border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between px-6 flex-shrink-0 transition-colors duration-300">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarVisible(!sidebarVisible)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg text-gray-500 dark:text-zinc-400 transition-colors"
              title={sidebarVisible ? t('hideSidebar', uiLanguage) : t('showSidebar', uiLanguage)}
            >
              {sidebarVisible ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
            </button>
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div className="bg-gray-100 dark:bg-black/30 px-4 py-1.5 rounded-full text-xs font-mono text-gray-600 dark:text-zinc-500 flex items-center gap-2">
             <span className={`w-2 h-2 rounded-full bg-indigo-500 ${loading ? 'animate-ping' : ''}`}></span>
             {loading ? t('loading', uiLanguage) : t('previewMode', uiLanguage)}
          </div>
          <div className="flex gap-2 items-center">
             <button
              onClick={() => setShowGallery(!showGallery)}
              className={`p-2 rounded-lg transition-colors ${showGallery ? 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400' : 'hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 dark:text-zinc-400'}`}
              title="可视化类型库"
            >
              <Grid3x3 size={18} />
            </button>
            <button
              onClick={() => setShowDebug(!showDebug)}
              className={`p-2 rounded-lg transition-colors ${showDebug ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400' : 'hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 dark:text-zinc-400'}`}
              title={t('debugView', uiLanguage)}
            >
              <Bug size={18} />
            </button>
            <div className="w-px h-4 bg-gray-300 dark:bg-zinc-700 mx-1"></div>
             <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg text-gray-500 dark:text-zinc-400 transition-colors"
              title={t('toggleTheme', uiLanguage)}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setUiLanguage(uiLanguage === 'en' ? 'zh' : 'en')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg text-gray-500 dark:text-zinc-400 transition-colors text-sm font-medium"
              title={uiLanguage === 'en' ? '中文' : 'English'}
            >
              <Languages size={18} />
              <span className="ml-1">{uiLanguage === 'en' ? 'EN' : '中'}</span>
            </button>
            {displayMode === 'pagination' && (
              <>
                <div className="w-px h-4 bg-gray-300 dark:bg-zinc-700 mx-1"></div>
                <button
                  onClick={() => handleExportJpg('current')}
                  disabled={!currentReport}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg text-gray-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Export current page as PNG"
                >
                  <Download size={18} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Scrollable Content */}
        <div
          ref={scrollContainerRef}
          className={`flex-1 p-4 md:p-8 relative bg-dot-pattern scroll-smooth ${
            displayMode === 'scroll-vertical' ? 'overflow-y-auto' : 'overflow-hidden'
          }`}
        >
          {/* Initial Loading State (Before any content) */}
          {loading && !currentReport && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 dark:bg-[#161618] z-50">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles size={20} className="text-indigo-500 dark:text-indigo-400 animate-pulse" />
                </div>
              </div>
              <h2 className="mt-8 text-xl font-light text-gray-900 dark:text-white">{t('synthesizing', uiLanguage)}</h2>
              <p className="text-gray-500 dark:text-zinc-500 mt-2 text-sm">{t('gatheringData', uiLanguage)}</p>
            </div>
          )}

          {/* Empty State */}
          {!currentReport && !loading && !error && (
            <div className="h-full flex flex-col items-center justify-center opacity-30 select-none pointer-events-none">
               <div className="w-64 h-64 rounded-full bg-gradient-to-t from-indigo-500/20 to-transparent blur-3xl absolute" />
               <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 z-10">{t('appName', uiLanguage)}</h1>
               <p className="text-gray-500 dark:text-zinc-400 max-w-md text-center z-10">
                 {t('appTagline', uiLanguage)}
               </p>
            </div>
          )}

          {/* Error State */}
          {error && (
             <div className="flex flex-col items-center justify-center h-full text-red-500 dark:text-red-400">
               <div className="bg-red-50 dark:bg-red-500/10 p-6 rounded-xl border border-red-200 dark:border-red-500/20 max-w-lg text-center">
                  <h3 className="text-lg font-bold mb-2">{t('generationFailed', uiLanguage)}</h3>
                  <p>{error}</p>
               </div>
             </div>
          )}

          {/* Content Render */}
          {currentReport && (
            <>
              {/* Vertical Scroll Mode */}
              {displayMode === 'scroll-vertical' && (
                <div ref={contentRef} className="max-w-4xl mx-auto space-y-8 pb-20 animate-fade-in">
              {/* Report Header */}
              <div className="text-center mb-16 relative">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-500/5 dark:bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />
                 <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-indigo-600 to-indigo-800 dark:from-white dark:via-indigo-200 dark:to-indigo-400 mb-6 relative z-10">
                   {currentReport.title || <span className="animate-pulse bg-gray-200 dark:bg-zinc-800 rounded h-16 w-3/4 inline-block"></span>}
                 </h1>
                 <div className="max-w-2xl mx-auto bg-white/50 dark:bg-zinc-900/80 backdrop-blur border border-gray-200 dark:border-zinc-700 p-6 rounded-2xl relative z-10 shadow-xl dark:shadow-2xl">
                    <p className="text-lg text-gray-700 dark:text-zinc-300 leading-relaxed font-light">
                      {currentReport.summary || <span className="animate-pulse bg-gray-200 dark:bg-zinc-800 rounded h-20 w-full inline-block"></span>}
                    </p>
                 </div>
              </div>

              {/* Sections */}
              <div className="flex flex-col gap-2">
                {currentReport.sections && currentReport.sections.map((section, idx) => (
                  <React.Fragment key={idx}>
                    <div className="relative transition-all duration-500 hover:translate-y-[-2px]">
                      {/* Subtle background glow for visual variation on even items */}
                      {idx % 2 === 1 && (
                        <div className="absolute -inset-4 bg-gradient-to-b from-transparent via-gray-200/50 dark:via-zinc-800/20 to-transparent rounded-[2rem] -z-10 blur-xl opacity-50" />
                      )}
                      
                      {renderSection(section, idx)}
                    </div>

                    {/* Divider / Flow Connector */}
                    {idx < currentReport.sections.length - 1 && (
                      <div className="flex flex-col items-center justify-center py-4 opacity-30 gap-1">
                         <div className="h-6 w-px bg-gradient-to-b from-gray-300 dark:from-zinc-700 to-transparent" />
                         <ArrowDown size={14} className="text-gray-400 dark:text-zinc-500" />
                      </div>
                    )}
                  </React.Fragment>
                ))}
                
                {/* Streaming Indicator at bottom of content */}
                {loading && (
                   <div className="flex justify-center py-8">
                      <Loader2 className="animate-spin text-indigo-500" size={24} />
                   </div>
                )}
              </div>

              {/* Footer Sources */}
              {currentReport.sources && currentReport.sources.length > 0 && !loading && (
                <div className="mt-16 pt-8 border-t border-gray-200 dark:border-zinc-800 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <h4 className="text-xs uppercase tracking-widest text-gray-500 dark:text-zinc-500 mb-4">{t('sources', uiLanguage)}</h4>
                  <div className="flex flex-wrap gap-3">
                    {currentReport.sources.map((source, i) => (
                      <a
                        key={i}
                        href={source.uri}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 hover:border-indigo-500/50 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors text-xs text-gray-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-300 shadow-sm dark:shadow-none"
                      >
                        <ExternalLink size={12} />
                        <span className="truncate max-w-[200px]">{source.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
              </div>
            )}
              {/* End Vertical Scroll Mode */}

              {/* Horizontal Scroll Mode */}
              {displayMode === 'scroll-horizontal' && (
                <div ref={horizontalScrollRef} className="flex overflow-x-auto gap-8 p-8 snap-x snap-mandatory h-full items-center">
                  {/* Summary Card */}
                  <div className="flex-shrink-0 w-[85vw] max-w-4xl snap-center">
                    <div className="text-center bg-white dark:bg-zinc-900/80 backdrop-blur border border-gray-200 dark:border-zinc-700 p-8 rounded-2xl shadow-xl">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-500/5 dark:bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />
                      <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-indigo-600 to-indigo-800 dark:from-white dark:via-indigo-200 dark:to-indigo-400 mb-6 relative z-10">
                        {currentReport.title || <span className="animate-pulse bg-gray-200 dark:bg-zinc-800 rounded h-12 w-3/4 inline-block"></span>}
                      </h1>
                      <p className="text-lg text-gray-700 dark:text-zinc-300 leading-relaxed font-light">
                        {currentReport.summary || <span className="animate-pulse bg-gray-200 dark:bg-zinc-800 rounded h-16 w-full inline-block"></span>}
                      </p>
                    </div>
                  </div>

                  {/* Section Cards */}
                  {currentReport.sections && currentReport.sections.map((section, idx) => (
                    <div key={idx} className="flex-shrink-0 w-[85vw] max-w-4xl snap-center">
                      {renderSection(section, idx)}
                    </div>
                  ))}

                  {/* Sources Card */}
                  {currentReport.sources && currentReport.sources.length > 0 && !loading && (
                    <div className="flex-shrink-0 w-[85vw] max-w-4xl snap-center bg-white dark:bg-zinc-900/80 backdrop-blur border border-gray-200 dark:border-zinc-700 p-8 rounded-2xl shadow-xl">
                      <h4 className="text-sm uppercase tracking-widest text-gray-500 dark:text-zinc-500 mb-4">{t('sources', uiLanguage)}</h4>
                      <div className="flex flex-wrap gap-3">
                        {currentReport.sources.map((source, i) => (
                          <a
                            key={i}
                            href={source.uri}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700 hover:border-indigo-500/50 transition-colors text-xs text-gray-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-300"
                          >
                            <ExternalLink size={12} />
                            <span className="truncate max-w-[200px]">{source.title}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {/* End Horizontal Scroll Mode */}

              {/* Pagination Mode */}
              {displayMode === 'pagination' && (
                <div className="flex flex-col h-full">
                  {/* Current Page Content */}
                  <div className="flex-1 flex items-center justify-center p-8">
                    {currentPage === 0 ? (
                      /* Summary Page */
                      <div className="w-full max-w-4xl text-center bg-white dark:bg-zinc-900/80 backdrop-blur border border-gray-200 dark:border-zinc-700 p-8 rounded-2xl shadow-xl animate-fade-in">
                        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-indigo-600 to-indigo-800 dark:from-white dark:via-indigo-200 dark:to-indigo-400 mb-6">
                          {currentReport.title || <span className="animate-pulse bg-gray-200 dark:bg-zinc-800 rounded h-12 w-3/4 inline-block"></span>}
                        </h1>
                        <p className="text-xl text-gray-700 dark:text-zinc-300 leading-relaxed font-light">
                          {currentReport.summary || <span className="animate-pulse bg-gray-200 dark:bg-zinc-800 rounded h-16 w-full inline-block"></span>}
                        </p>
                      </div>
                    ) : currentPage <= (currentReport.sections?.length ?? 0) ? (
                      /* Section Page */
                      <div className="w-full max-w-4xl animate-fade-in">
                        {renderSection(currentReport.sections?.[currentPage - 1], currentPage - 1)}
                      </div>
                    ) : (
                      /* Sources Page */
                      <div className="w-full max-w-4xl bg-white dark:bg-zinc-900/80 backdrop-blur border border-gray-200 dark:border-zinc-700 p-8 rounded-2xl shadow-xl animate-fade-in">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('sources', uiLanguage)}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {currentReport.sources?.map((source, i) => (
                            <a
                              key={i}
                              href={source.uri}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700 hover:border-indigo-500/50 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors text-sm text-gray-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-300"
                            >
                              <ExternalLink size={14} />
                              <span className="truncate">{source.title}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Pagination Navigation */}
                  <div className="flex justify-center items-center gap-4 p-4 bg-white dark:bg-[#1a1b1e] border-t border-gray-200 dark:border-zinc-800">
                    <button
                      onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                      disabled={currentPage === 0}
                      className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                      ← {t('previous', uiLanguage)}
                    </button>
                    <span className="text-sm text-gray-500 dark:text-zinc-400 min-w-[100px] text-center">
                      {currentPage === 0
                        ? t('summary', uiLanguage)
                        : currentPage === (currentReport.sections?.length ?? 0) + 1
                          ? t('sources', uiLanguage)
                          : `${currentPage}/${currentReport.sections?.length ?? 0}`}
                    </span>
                    <button
                      onClick={() => setCurrentPage(Math.min(getTotalPages(currentReport) - 1, currentPage + 1))}
                      disabled={currentPage === getTotalPages(currentReport) - 1}
                      className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                      {t('next', uiLanguage)} →
                    </button>

                    {/* Export Controls */}
                    <div className="w-px h-6 bg-gray-300 dark:bg-zinc-700 mx-2"></div>
                    <button
                      onClick={() => handleExportJpg('current')}
                      disabled={!currentReport}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm flex items-center gap-2"
                      title="Export current page as PNG"
                    >
                      <Download size={16} />
                      {t('exportCurrent', uiLanguage)}
                    </button>
                    <button
                      onClick={() => handleExportJpg('all')}
                      disabled={!currentReport}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm flex items-center gap-2"
                      title="Export all pages as PNG"
                    >
                      <Download size={16} />
                      {t('exportAll', uiLanguage)}
                    </button>
                  </div>
                </div>
              )}
              {/* End Pagination Mode */}
            </>
          )}

          {/* Debug Panel - Absolute positioned over content */}
        {showDebug && (
           <div className="absolute top-16 right-0 bottom-0 w-full md:w-[450px] bg-white/95 dark:bg-[#1a1b1e]/95 backdrop-blur-md border-l border-gray-200 dark:border-zinc-800 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-200">
             <div className="p-3 border-b border-gray-200 dark:border-zinc-800 flex justify-between items-center bg-gray-50/50 dark:bg-zinc-900/50">
               <div className="flex items-center gap-3">
                 <Bug size={14} className="text-indigo-500" />
                 <div className="flex gap-1 bg-gray-200 dark:bg-zinc-800 rounded-lg p-0.5">
                   <button
                     onClick={() => setDebugMode('report')}
                     className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                       debugMode === 'report'
                         ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm'
                         : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
                     }`}
                   >
                     Report
                   </button>
                   <button
                     onClick={() => setDebugMode('fewshot')}
                     className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                       debugMode === 'fewshot'
                         ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm'
                         : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
                     }`}
                   >
                     Few Shot
                   </button>
                   <button
                     onClick={() => setDebugMode('recommended')}
                     className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                       debugMode === 'recommended'
                         ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm'
                         : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
                     }`}
                   >
                     Recommended
                   </button>
                 </div>
               </div>
               <button
                 onClick={() => setShowDebug(false)}
                 className="p-1 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded text-gray-500 dark:text-zinc-400 transition-colors"
               >
                 <X size={16} />
               </button>
             </div>
             <div className="flex-1 overflow-auto p-4 bg-gray-50 dark:bg-[#0c0c0e]">
               {debugMode === 'report' ? (
                 currentReport ? (
                   <pre className="text-[10px] md:text-xs font-mono text-gray-600 dark:text-green-400 whitespace-pre-wrap break-all leading-relaxed">
                     {JSON.stringify(currentReport, null, 2)}
                   </pre>
                 ) : (
                   <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-zinc-600 italic gap-2">
                     <Bug size={32} className="opacity-20" />
                     <p>{t('noReportData', uiLanguage)}</p>
                   </div>
                 )
               ) : debugMode === 'fewshot' ? (
                 // Few Shot mode
                 (() => {
                   const fewShotParsed = debugStore.getFewShotPromptParsed();
                   return fewShotParsed ? (
                     <pre className="text-[10px] md:text-xs font-mono text-gray-600 dark:text-yellow-400 whitespace-pre-wrap break-all leading-relaxed">
                       {JSON.stringify(fewShotParsed, null, 2)}
                     </pre>
                   ) : (
                     <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-zinc-600 italic gap-2">
                       <Sparkles size={32} className="opacity-20" />
                       <p>No few shot prompt data available</p>
                       <p className="text-xs opacity-60">Generate a report to see the few shot prompt</p>
                     </div>
                   );
                 })()
               ) : (
                 // Recommended types mode
                 (() => {
                   const debugInfo = debugStore.get();
                   const recommendedTypes = debugInfo.recommendedTypes;
                   return recommendedTypes && recommendedTypes.length > 0 ? (
                     <div className="space-y-4">
                       <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                         <Sparkles size={16} />
                         <span className="text-sm font-semibold">Recommended Visual Types ({recommendedTypes.length})</span>
                       </div>
                       <div className="grid grid-cols-1 gap-2">
                         {recommendedTypes.map((type, idx) => {
                           // Extract category prefix for coloring
                           const category = type.split('-')[0];
                           const categoryColors: Record<string, string> = {
                             sequence: 'text-blue-600 dark:text-blue-400',
                             list: 'text-green-600 dark:text-green-400',
                             chart: 'text-purple-600 dark:text-purple-400',
                             compare: 'text-orange-600 dark:text-orange-400',
                             hierarchy: 'text-pink-600 dark:text-pink-400',
                             quadrant: 'text-cyan-600 dark:text-cyan-400',
                           };
                           const colorClass = categoryColors[category] || 'text-gray-600 dark:text-gray-400';
                           return (
                             <div key={idx} className={`text-xs font-mono ${colorClass} bg-white dark:bg-zinc-900 px-3 py-2 rounded-lg border border-gray-200 dark:border-zinc-800`}>
                               {type}
                             </div>
                           );
                         })}
                       </div>
                       <div className="pt-4 border-t border-gray-200 dark:border-zinc-800">
                         <p className="text-xs text-gray-500 dark:text-zinc-500 italic">
                           These types were extracted from the few-shot examples and are recommended for use in this session.
                         </p>
                       </div>
                     </div>
                   ) : (
                     <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-zinc-600 italic gap-2">
                       <Sparkles size={32} className="opacity-20" />
                       <p>No recommended types available</p>
                       <p className="text-xs opacity-60">Generate a report to see recommended types</p>
                     </div>
                   );
                 })()
               )}
             </div>
           </div>
        )}

        {/* Visual Types Gallery - Full screen overlay */}
        {showGallery && (
          <div className="fixed inset-0 z-50 animate-in fade-in duration-200">
            <VisualTypesGallery />
            <button
              onClick={() => setShowGallery(false)}
              className="fixed top-4 right-4 p-2 bg-white dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg shadow-lg text-gray-500 dark:text-zinc-400 transition-colors z-50"
              title="关闭"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* API Key Modal */}
        {showApiKeyModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-zinc-800 max-w-md w-full mx-4 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                  <Key size={24} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {t('enterApiKey', uiLanguage)}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-zinc-400">
                    {tp('apiKeyDesc', { provider: provider.toUpperCase() }, uiLanguage)}
                  </p>
                </div>
                <button
                  onClick={handleApiKeyCancel}
                  className="ml-auto p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg text-gray-500 dark:text-zinc-400 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <input
                type="text"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="sk-..."
                className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 text-sm mb-4"
                autoFocus
              />

              <div className="flex gap-2 justify-end">
                <button
                  onClick={handleApiKeyCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  {t('cancel', uiLanguage)}
                </button>
                <button
                  onClick={handleApiKeySubmit}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
                >
                  {t('saveAndGenerate', uiLanguage)}
                </button>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-500/10 rounded-lg border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs">
                  {error}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Settings Modal */}
        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          onSaveSuccess={() => {
            // Reload default provider from localStorage
            const savedProvider = localStorage.getItem('infographix_default_provider');
            if (savedProvider && savedProvider !== provider) {
              setProvider(savedProvider);
              // Also update model to the new provider's default
              const providers = LLMServiceFactory.getAvailableProviders();
              const newProvider = providers.find(p => p.id === savedProvider);
              if (newProvider) {
                setModel(newProvider.defaultModel);
              }
            }
          }}
        />

        {/* Hidden capture container for PNG export */}
        {currentReport && (
          <div
            ref={captureContainerRef}
            className="fixed left-0 top-0 pointer-events-none -z-50"
            style={{ visibility: 'hidden', width: 'fit-content', height: 'fit-content' }}
          >
            {/* Title + Summary Page */}
            <div
              data-export-page="title"
              className="bg-white dark:bg-[#161618]"
              style={{ padding: '60px', width: '1200px' }}
            >
              <div className="text-center relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-500/5 dark:bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />
                <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-indigo-600 to-indigo-800 dark:from-white dark:via-indigo-200 dark:to-indigo-400 mb-8 relative z-10">
                  {currentReport.title}
                </h1>
                <div className="max-w-5xl mx-auto bg-white/50 dark:bg-zinc-900/80 backdrop-blur border border-gray-200 dark:border-zinc-700 p-10 rounded-2xl relative z-10 shadow-xl dark:shadow-2xl">
                  <p className="text-2xl text-gray-700 dark:text-zinc-300 leading-relaxed font-light">
                    {currentReport.summary}
                  </p>
                </div>
              </div>
            </div>

            {/* Section Pages */}
            {currentReport.sections?.map((section, idx) => (
              <div
                key={idx}
                data-export-page={`section-${idx}`}
                className="bg-white dark:bg-[#161618] flex items-center justify-center"
                style={{ padding: '40px', width: '1200px' }}
              >
                {(() => {
                  const props = { ...section, isDark: isDarkMode, isLoading: false };
                  const sectionDef = sectionRegistry.get(section.type);
                  if (sectionDef) {
                    const Component = sectionDef.component;
                    return <Component key={idx} {...props} section={section} />;
                  }
                  // Fallback to switch statement
                  switch (section.type) {
                    case 'text':
                      return <TextSection key={idx} {...props} />;
                    case 'stat_highlight':
                      return <StatHighlight key={idx} section={section} isDark={isDarkMode} isLoading={false} />;
                    case 'bar_chart':
                    case 'pie_chart':
                      return <ChartSection key={idx} section={section} isDark={isDarkMode} isLoading={false} />;
                    case 'process_flow':
                      return <ProcessFlow key={idx} section={section} isDark={isDarkMode} isLoading={false} />;
                    case 'comparison':
                      return <ComparisonSection key={idx} section={section} isDark={isDarkMode} isLoading={false} />;
                    default:
                      return null;
                  }
                })()}
              </div>
            ))}

            {/* Sources Page */}
            {currentReport.sources && currentReport.sources.length > 0 && (
              <div
                data-export-page="sources"
                className="bg-white dark:bg-[#161618]"
                style={{ padding: '60px', width: '1200px' }}
              >
                <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-10">{t('sources', uiLanguage)}</h2>
                <div className="grid grid-cols-2 gap-6">
                  {currentReport.sources.map((source, i) => (
                    <a
                      key={i}
                      href={source.uri}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 px-6 py-4 bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 hover:border-indigo-500/50 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors text-base text-gray-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-300 shadow-sm dark:shadow-none"
                    >
                      <ExternalLink size={16} />
                      <span className="truncate">{source.title}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}