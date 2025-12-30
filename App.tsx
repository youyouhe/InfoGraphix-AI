import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import { LLMServiceFactory, saveApiKey, getStoredApiKey } from './services/factory';
import { HistoryItem, InfographicReport, SectionType, DisplayMode } from './types';
import { TextSection, StatHighlight, ChartSection, ProcessFlow, ComparisonSection } from './components/Visuals';
import { Share2, Download, ExternalLink, Sparkles, ArrowDown, Loader2, Moon, Sun, Bug, X, Key, Monitor } from 'lucide-react';
import { registerCoreSectionTypes } from './services/registry/coreSections';
import { sectionRegistry } from './services/registry/sectionRegistry';
import { PptxExporter } from './services/export/pptxExporter';
import { PdfExporter } from './services/export/pdfExporter';

export default function App() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentReport, setCurrentReport] = useState<InfographicReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showDebug, setShowDebug] = useState(false);
  const [provider, setProvider] = useState(() => LLMServiceFactory.getDefaultProvider());
  const [model, setModel] = useState(() => {
    const providers = LLMServiceFactory.getAvailableProviders();
    const defaultProvider = providers.find(p => p.id === LLMServiceFactory.getDefaultProvider());
    return defaultProvider?.defaultModel || '';
  });

  // Display Mode state
  const [displayMode, setDisplayMode] = useState<DisplayMode>('scroll-vertical');
  const [currentPage, setCurrentPage] = useState(0);

  // API Key Modal state
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [apiKeyProvider, setApiKeyProvider] = useState('');

  // Initialize core section types on mount
  useEffect(() => {
    registerCoreSectionTypes();
  }, []);

  // Update model when provider changes
  useEffect(() => {
    const providers = LLMServiceFactory.getAvailableProviders();
    const currentProvider = providers.find(p => p.id === provider);
    if (currentProvider) {
      setModel(currentProvider.defaultModel);
    }
  }, [provider]);

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
          setCurrentReport(prev => ({
            ...partialReport,
            // Keep sources if we already had them (though usually sources come last)
            sources: prev?.sources || partialReport.sources
          }));
        }
      }, { model });  // Pass the selected model

      // Final success state
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        query: topic,
        timestamp: Date.now(),
        report: report
      };
      
      setHistory(prev => [newHistoryItem, ...prev]);
      setCurrentReport(report);
    } catch (err: any) {
      setError(err.message || "Failed to generate infographic. Please check your API key.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHistory = (id: string) => {
    const item = history.find(h => h.id === id);
    if (item && item.report) {
      setCurrentReport(item.report);
      setError(null);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    setCurrentReport(null);
  };

  const handleNewChat = () => {
    setCurrentReport(null);
    setError(null);
  };

  // Handle API Key submission
  const handleApiKeySubmit = () => {
    const trimmedKey = apiKeyInput.trim();
    if (!trimmedKey) {
      setError('API key cannot be empty');
      return;
    }

    // Save to localStorage
    saveApiKey(apiKeyProvider, trimmedKey);

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

  // Handle PDF export (using modern-screenshot for visual fidelity)
  const handleExportPPT = async () => {
    if (!currentReport || !captureContainerRef.current) return;

    try {
      const exporter = new PdfExporter();

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

      await exporter.export(currentReport, getSectionElement, `${sanitizedTitle}.pdf`, isDarkMode);
    } catch (err: any) {
      console.error('PDF export failed:', err);
      setError('Failed to export PDF. Please try again.');
    }
  };

  // Render a specific section based on its type (dynamic from registry)
  const renderSection = (section: any, index: number) => {
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
      <Sidebar
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
        totalPages={currentReport ? (currentReport.sections.length + 1) : 0}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Top Bar */}
        <div className="h-16 bg-white dark:bg-[#1a1b1e] border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between px-6 flex-shrink-0 transition-colors duration-300">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div className="bg-gray-100 dark:bg-black/30 px-4 py-1.5 rounded-full text-xs font-mono text-gray-600 dark:text-zinc-500 flex items-center gap-2">
             <span className={`w-2 h-2 rounded-full bg-indigo-500 ${loading ? 'animate-ping' : ''}`}></span>
             {loading ? 'Streaming...' : 'Preview Mode'}
          </div>
          <div className="flex gap-2 items-center">
             <button 
              onClick={() => setShowDebug(!showDebug)}
              className={`p-2 rounded-lg transition-colors ${showDebug ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400' : 'hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 dark:text-zinc-400'}`}
              title="Toggle Debug View"
            >
              <Bug size={18} />
            </button>
            <div className="w-px h-4 bg-gray-300 dark:bg-zinc-700 mx-1"></div>
             <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg text-gray-500 dark:text-zinc-400 transition-colors" 
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="w-px h-4 bg-gray-300 dark:bg-zinc-700 mx-1"></div>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg text-gray-500 dark:text-zinc-400 transition-colors" title="Copy Text">
              <Share2 size={18} />
            </button>
             <button
              onClick={handleExportPPT}
              disabled={!currentReport}
              className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg text-gray-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Export as PPT"
            >
              <Download size={18} />
            </button>
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
              <h2 className="mt-8 text-xl font-light text-gray-900 dark:text-white">Synthesizing Research...</h2>
              <p className="text-gray-500 dark:text-zinc-500 mt-2 text-sm">Gathering data from valid sources</p>
            </div>
          )}

          {/* Empty State */}
          {!currentReport && !loading && !error && (
            <div className="h-full flex flex-col items-center justify-center opacity-30 select-none pointer-events-none">
               <div className="w-64 h-64 rounded-full bg-gradient-to-t from-indigo-500/20 to-transparent blur-3xl absolute" />
               <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 z-10">InfoGraphix AI</h1>
               <p className="text-gray-500 dark:text-zinc-400 max-w-md text-center z-10">
                 Enter a complex topic on the left to generate a beautiful, data-driven infographic report powered by Gemini.
               </p>
            </div>
          )}

          {/* Error State */}
          {error && (
             <div className="flex flex-col items-center justify-center h-full text-red-500 dark:text-red-400">
               <div className="bg-red-50 dark:bg-red-500/10 p-6 rounded-xl border border-red-200 dark:border-red-500/20 max-w-lg text-center">
                  <h3 className="text-lg font-bold mb-2">Generation Failed</h3>
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
                  <h4 className="text-xs uppercase tracking-widest text-gray-500 dark:text-zinc-500 mb-4">Sources & References</h4>
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
                      <h4 className="text-sm uppercase tracking-widest text-gray-500 dark:text-zinc-500 mb-4">Sources & References</h4>
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
                    ) : (
                      /* Section Page */
                      <div className="w-full max-w-4xl animate-fade-in">
                        {renderSection(currentReport.sections[currentPage - 1], currentPage - 1)}
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
                      ← Previous
                    </button>
                    <span className="text-sm text-gray-500 dark:text-zinc-400 min-w-[100px] text-center">
                      {currentPage === 0
                        ? 'Summary'
                        : `${currentPage}/${currentReport.sections.length}`}
                    </span>
                    <button
                      onClick={() => setCurrentPage(Math.min(currentReport.sections.length, currentPage + 1))}
                      disabled={currentPage === currentReport.sections.length}
                      className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                      Next →
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
               <div className="flex items-center gap-2">
                 <Bug size={14} className="text-indigo-500" />
                 <span className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">Live LLM Output</span>
               </div>
               <button 
                 onClick={() => setShowDebug(false)}
                 className="p-1 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded text-gray-500 dark:text-zinc-400 transition-colors"
               >
                 <X size={16} />
               </button>
             </div>
             <div className="flex-1 overflow-auto p-4 bg-gray-50 dark:bg-[#0c0c0e]">
               {currentReport ? (
                 <pre className="text-[10px] md:text-xs font-mono text-gray-600 dark:text-green-400 whitespace-pre-wrap break-all leading-relaxed">
                   {JSON.stringify(currentReport, null, 2)}
                 </pre>
               ) : (
                 <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-zinc-600 italic gap-2">
                   <Bug size={32} className="opacity-20" />
                   <p>No active report data</p>
                 </div>
               )}
             </div>
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
                    Enter API Key
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-zinc-400">
                    {provider.toUpperCase()} API Key is required
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
                  Cancel
                </button>
                <button
                  onClick={handleApiKeySubmit}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
                >
                  Save & Generate
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

        {/* Hidden capture container for PDF export */}
        {currentReport && (
          <div
            ref={captureContainerRef}
            className="fixed -left-[9999px] top-0 pointer-events-none"
            style={{ width: 'fit-content', height: 'fit-content' }}
          >
            {/* Title + Summary Page */}
            <div
              data-export-page="title"
              className="bg-white dark:bg-[#161618]"
              style={{ padding: '60px', minWidth: '800px' }}
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
            {currentReport.sections.map((section, idx) => (
              <div
                key={idx}
                data-export-page={`section-${idx}`}
                className="bg-white dark:bg-[#161618] flex items-center justify-center"
                style={{ padding: '40px', minWidth: '800px' }}
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
                style={{ padding: '60px', minWidth: '800px' }}
              >
                <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-10">Sources & References</h2>
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