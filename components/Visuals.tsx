import React, { useMemo, useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, 
  PieChart, Pie, Legend 
} from 'recharts';
import { ArrowUp, ArrowDown, Minus, Activity, Layers, ArrowRight, AlertCircle } from 'lucide-react';
import { SectionType, InfographicSection } from '../types';

// --- Colors ---
const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6'];

// --- Custom Tooltip ---
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0];
    const name = label || item.name || item.payload.name;
    const value = item.value;

    return (
      <div className="bg-white/95 dark:bg-zinc-900/95 border border-zinc-200 dark:border-zinc-700 p-3 rounded-lg shadow-xl backdrop-blur-sm min-w-[120px]">
        <p className="text-zinc-500 dark:text-zinc-400 text-xs font-medium uppercase tracking-wider mb-1">{name}</p>
        <p className="text-zinc-900 dark:text-white font-bold text-lg">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
      </div>
    );
  }
  return null;
};

interface VisualProps {
  section: InfographicSection;
  isDark?: boolean;
  isLoading?: boolean;
}

// --- Shared Loading/Empty State Component ---
const DataPlaceholder: React.FC<{ 
  isLoading: boolean; 
  title?: string; 
  content?: string;
  type: 'Chart' | 'Comparison' | 'Process' 
}> = ({ isLoading, title, content, type }) => (
  <div className="mb-8 p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-lg min-h-[300px] flex items-center justify-center relative">
    {title && <h3 className="text-lg font-bold text-gray-900 dark:text-white absolute top-6">{title}</h3>}
    
    {isLoading ? (
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
        <p className="text-zinc-400 text-xs animate-pulse">Generating {type}...</p>
      </div>
    ) : (
      <div className="flex flex-col items-center gap-3 text-zinc-400">
        <AlertCircle size={32} className="opacity-50" />
        <p className="text-sm">{type} data unavailable.</p>
      </div>
    )}
    
    {content && <p className="absolute bottom-6 px-6 text-center text-gray-500 dark:text-zinc-500 text-sm italic">{content}</p>}
  </div>
);

// --- Text Section ---
export const TextSection: React.FC<VisualProps & { content?: string; title?: string }> = ({ content, title }) => (
  <div className="mb-8 p-6 bg-white dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700/50 shadow-sm dark:shadow-none">
    {title && <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><div className="w-2 h-6 bg-indigo-500 rounded-full"/>{title}</h3>}
    <p className="text-gray-600 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap text-base">{content}</p>
  </div>
);

// --- Stat Highlight ---
export const StatHighlight: React.FC<VisualProps> = ({ section }) => {
  const isUp = section.statTrend === 'up';
  
  return (
    <div className="mb-8 p-8 bg-gradient-to-br from-gray-50 to-white dark:from-zinc-800 dark:to-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-zinc-900 dark:text-white">
        <Activity size={120} />
      </div>
      <h4 className="text-zinc-500 dark:text-zinc-400 text-sm uppercase tracking-widest font-semibold mb-2">{section.statLabel}</h4>
      <div className="flex items-baseline gap-4">
        <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500 dark:from-indigo-400 dark:to-pink-400">
          {section.statValue}
        </span>
        {section.statTrend && section.statTrend !== 'neutral' && (
          <div className={`flex items-center px-3 py-1 rounded-full text-sm font-bold ${isUp ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'}`}>
            {isUp ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
            <span className="ml-1">Trend</span>
          </div>
        )}
      </div>
      {section.content && <p className="mt-4 text-gray-600 dark:text-zinc-400 text-sm max-w-md">{section.content}</p>}
    </div>
  );
};

// --- Chart Section ---
export const ChartSection: React.FC<VisualProps> = ({ section, isDark = true, isLoading = false }) => {
  const axisColor = isDark ? "#71717a" : "#4b5563"; // zinc-500 vs gray-600
  const cursorFill = isDark ? "#3f3f46" : "#e5e7eb"; // zinc-700 vs gray-200
  const [isMounted, setIsMounted] = useState(false);

  // Defer rendering until client-side hydration/layout is complete to prevent "width(-1)" errors
  useEffect(() => {
    const timer = requestAnimationFrame(() => setIsMounted(true));
    return () => cancelAnimationFrame(timer);
  }, []);

  // Robustly normalize data
  const chartData = useMemo(() => {
    if (!section.data || !Array.isArray(section.data) || section.data.length === 0) {
      return null;
    }

    return section.data.map((item: any) => {
      // Best effort to find name/value
      let name = item.name;
      let value = item.value;

      // Heuristic: If name/value missing, try to detect from types
      if (!name || value === undefined) {
         const keys = Object.keys(item);
         if (!name) name = item[keys.find(k => typeof item[k] === 'string') || ''] || 'Unknown';
         if (value === undefined) value = item[keys.find(k => typeof item[k] === 'number') || ''] || 0;
      }

      // Convert string values to numbers if necessary (e.g. "100" -> 100)
      if (typeof value === 'string') {
        value = parseFloat(value.replace(/[^0-9.-]+/g,""));
      }

      return { name: String(name), value: Number(value) || 0 };
    }).filter(item => item.value > 0);
  }, [section.data]);


  // Guard against empty or incomplete data during streaming
  if (!chartData || chartData.length === 0) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} content={section.content} type="Chart" />;
  }

  // Double guard: Ensure component is mounted before rendering Recharts
  if (!isMounted) {
    return (
       <div className="mb-8 p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-lg min-h-[300px] flex items-center justify-center">
         <div className="w-6 h-6 border-2 border-zinc-300 dark:border-zinc-700 border-t-transparent rounded-full animate-spin"></div>
       </div>
    );
  }

  return (
    <div className="mb-8 p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-lg">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 text-center">{section.title}</h3>
      {/* Explicit style dimensions to prevent layout shift and 0x0 errors */}
      <div className="h-[300px] w-full min-w-0" style={{ minHeight: '300px' }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          {section.type === 'bar_chart' ? (
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: cursorFill, opacity: 0.5 }} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <PieChart>
               <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                nameKey="name"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ color: axisColor, fontSize: '12px' }} />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
       {section.content && <p className="mt-4 text-center text-gray-500 dark:text-zinc-500 text-sm italic">{section.content}</p>}
    </div>
  );
};

// --- Process Flow ---
export const ProcessFlow: React.FC<VisualProps> = ({ section, isLoading = false }) => {
  if (!section.steps || section.steps.length === 0) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="Process" />;
  }

  return (
    <div className="mb-8 p-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-8 text-center">{section.title}</h3>
      <div className="flex flex-col md:flex-row gap-4 items-stretch justify-center relative">
        {section.steps?.map((step, index) => (
          <div key={index} className="flex-1 flex flex-col items-center relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-white dark:bg-gradient-to-br dark:from-zinc-800 dark:to-black border border-zinc-200 dark:border-zinc-700 flex items-center justify-center mb-4 shadow-lg dark:shadow-[0_0_15px_rgba(99,102,241,0.3)]">
              <span className="text-2xl font-black text-indigo-600 dark:text-indigo-500">{step.step}</span>
            </div>
            <div className="text-center bg-white dark:bg-zinc-800/50 p-4 rounded-lg w-full h-full border border-zinc-200 dark:border-zinc-700/50 hover:border-indigo-500/50 transition-colors shadow-sm dark:shadow-none">
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">{step.title}</h4>
              <p className="text-xs text-gray-600 dark:text-zinc-400">{step.description}</p>
            </div>
            {index < (section.steps?.length || 0) - 1 && (
              <div className="hidden md:block absolute top-8 -right-[calc(50%-2rem)] text-gray-400 dark:text-zinc-600 z-0">
                <ArrowRight size={24} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Comparison Table ---
export const ComparisonSection: React.FC<VisualProps> = ({ section, isLoading = false }) => {
  if (!section.comparisonItems || section.comparisonItems.length === 0) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="Comparison" />;
  }

  return (
    <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">{section.title}</h3>
      <div className="w-full overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
        <table className="w-full text-sm text-left text-gray-600 dark:text-zinc-400">
          <thead className="text-xs uppercase bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-zinc-200">
            <tr>
              <th scope="col" className="px-6 py-3 text-center">Metric</th>
              <th scope="col" className="px-6 py-3 text-center text-indigo-600 dark:text-indigo-400">Option A</th>
              <th scope="col" className="px-6 py-3 text-center text-pink-600 dark:text-pink-400">Option B</th>
            </tr>
          </thead>
          <tbody>
            {section.comparisonItems?.map((item, idx) => (
              <tr key={idx} className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white text-center border-r border-gray-200 dark:border-zinc-800/50">{item.label}</td>
                <td className="px-6 py-4 text-center border-r border-gray-200 dark:border-zinc-800/50">{item.left}</td>
                <td className="px-6 py-4 text-center">{item.right}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Sequence Timeline (for sequence-timeline-simple type) ---
export const SequenceTimeline: React.FC<VisualProps> = ({ section, isLoading = false }) => {
  const timelineData = section.data as { title?: string; items?: { label: string; desc: string }[] };

  if (!timelineData?.items || timelineData.items.length === 0) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="Process" />;
  }

  return (
    <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">{section.title}</h3>
      {timelineData.title && <p className="text-center text-gray-500 dark:text-zinc-500 text-sm mb-6">{timelineData.title}</p>}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500"></div>

        <div className="space-y-6">
          {timelineData.items.map((item, index) => (
            <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
              {/* Timeline dot */}
              <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-white dark:bg-zinc-900 border-4 border-indigo-500 z-10"></div>

              {/* Content card */}
              <div className="ml-12 md:ml-0 md:w-5/12 bg-gradient-to-br from-gray-50 to-white dark:from-zinc-800 dark:to-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-full">
                    {item.label}
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-zinc-300 leading-relaxed">{item.desc}</p>
              </div>

              {/* Spacer for alternating layout */}
              <div className="hidden md:block md:w-5/12"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Sequence Steps (for sequence-zigzag-steps, sequence-ascending-steps, etc.) ---
export const SequenceSteps: React.FC<VisualProps> = ({ section, isLoading = false }) => {
  const stepsData = section.data as { title?: string; items?: { label: string; desc: string }[] };

  if (!stepsData?.items || stepsData.items.length === 0) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="Process" />;
  }

  return (
    <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-8 text-center">{section.title}</h3>
      {stepsData.title && <p className="text-center text-gray-500 dark:text-zinc-500 text-sm mb-8">{stepsData.title}</p>}

      <div className="space-y-6">
        {stepsData.items.map((item, index) => (
          <div key={index} className="flex items-start gap-4">
            {/* Step Number */}
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {index + 1}
            </div>

            {/* Step Content */}
            <div className="flex-1 bg-gradient-to-br from-gray-50 to-white dark:from-zinc-800 dark:to-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm">
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">{item.label}</h4>
              <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- List Grid (for list-grid-badge-card, list-grid-candy-card, list-grid-ribbon-card) ---
export const ListGrid: React.FC<VisualProps> = ({ section, isLoading = false }) => {
  const listData = section.data as { title?: string; items?: { label: string; desc?: string; icon?: string }[] };

  if (!listData?.items || listData.items.length === 0) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="Chart" />;
  }

  return (
    <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">{section.title}</h3>
      {listData.title && <p className="text-center text-gray-500 dark:text-zinc-500 text-sm mb-6">{listData.title}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {listData.items.map((item, index) => (
          <div key={index} className="p-5 bg-gradient-to-br from-gray-50 to-white dark:from-zinc-800 dark:to-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-indigo-500/50 hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center">
                <span className="text-xl">{item.icon || '✓'}</span>
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white">{item.label}</h4>
            </div>
            {item.desc && <p className="text-sm text-gray-600 dark:text-zinc-400">{item.desc}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

// --- List Row (for list-row-horizontal-icon-arrow, list-row-simple-illus) ---
export const ListRow: React.FC<VisualProps> = ({ section, isLoading = false }) => {
  const listData = section.data as { title?: string; items?: { label: string; desc?: string }[] };

  if (!listData?.items || listData.items.length === 0) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="Chart" />;
  }

  return (
    <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">{section.title}</h3>
      {listData.title && <p className="text-center text-gray-500 dark:text-zinc-500 text-sm mb-6">{listData.title}</p>}

      <div className="space-y-3">
        {listData.items.map((item, index) => (
          <div key={index} className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white dark:from-zinc-800 dark:to-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:border-indigo-500/50 transition-colors">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm">
              {index + 1}
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 dark:text-white">{item.label}</h4>
              {item.desc && <p className="text-sm text-gray-600 dark:text-zinc-400 mt-1">{item.desc}</p>}
            </div>
            <ArrowRight size={20} className="text-indigo-500 flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Compare Binary (for compare-binary-horizontal, compare-binary-horizontal-badge-card) ---
export const CompareBinary: React.FC<VisualProps> = ({ section, isLoading = false }) => {
  const compareData = section.data as { title?: string; items?: { label: string; left: string; right: string }[] };

  if (!compareData?.items || compareData.items.length === 0) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="Comparison" />;
  }

  return (
    <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">{section.title}</h3>
      {compareData.title && <p className="text-center text-gray-500 dark:text-zinc-500 text-sm mb-6">{compareData.title}</p>}

      <div className="space-y-4">
        {compareData.items.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center gap-4">
              <div className="flex-1 p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30 rounded-xl border border-blue-200 dark:border-blue-800">
                <p className="font-bold text-blue-900 dark:text-blue-100 text-center mb-2">{item.left}</p>
              </div>
              <div className="flex-shrink-0 font-bold text-gray-400 dark:text-zinc-500">VS</div>
              <div className="flex-1 p-4 bg-gradient-to-r from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/30 rounded-xl border border-pink-200 dark:border-pink-800">
                <p className="font-bold text-pink-900 dark:text-pink-100 text-center mb-2">{item.right}</p>
              </div>
            </div>
            <div className="text-center">
              <span className="px-3 py-1 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 text-sm rounded-full">
                {item.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- SWOT Analysis (for compare-swot) ---
export const SWOTAnalysis: React.FC<VisualProps> = ({ section, isLoading = false }) => {
  const swotData = section.data as { title?: string; items?: { label: string; content: string }[] };

  if (!swotData?.items || swotData.items.length === 0) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="Comparison" />;
  }

  const getLabelColor = (label: string) => {
    const lowerLabel = label.toLowerCase();
    if (lowerLabel.includes('strengths') || lowerLabel.includes('优势')) return 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400';
    if (lowerLabel.includes('weaknesses') || lowerLabel.includes('劣势')) return 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400';
    if (lowerLabel.includes('opportunities') || lowerLabel.includes('机会')) return 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400';
    if (lowerLabel.includes('threats') || lowerLabel.includes('威胁')) return 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400';
    return 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-400';
  };

  return (
    <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">{section.title}</h3>
      {swotData.title && <p className="text-center text-gray-500 dark:text-zinc-500 text-sm mb-6">{swotData.title}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {swotData.items.map((item, index) => (
          <div key={index} className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm">
            <h4 className={`text-center font-bold mb-3 px-3 py-2 rounded-lg ${getLabelColor(item.label)}`}>
              {item.label}
            </h4>
            <p className="text-sm text-gray-700 dark:text-zinc-300 leading-relaxed">{item.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- List Column (for list-column-done-list, list-column-vertical-icon-arrow, list-column-simple-vertical-arrow) ---
export const ListColumn: React.FC<VisualProps> = ({ section, isLoading = false }) => {
  const listData = section.data as { title?: string; items?: { label: string; desc?: string; done?: boolean }[] };

  if (!listData?.items || listData.items.length === 0) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="Chart" />;
  }

  return (
    <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">{section.title}</h3>
      {listData.title && <p className="text-center text-gray-500 dark:text-zinc-500 text-sm mb-6">{listData.title}</p>}

      <div className="space-y-3">
        {listData.items.map((item, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 ${item.done ? 'bg-green-500 border-green-500' : 'bg-gray-200 dark:bg-zinc-700'}`}></div>
            <div className="flex-1 p-3 bg-gradient-to-r from-gray-50 to-white dark:from-zinc-800 dark:to-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700">
              <p className="text-sm text-gray-900 dark:text-white">{item.label}</p>
              {item.desc && <p className="text-xs text-gray-500 dark:text-zinc-500 mt-1">{item.desc}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Sequence Circular (for sequence-circular-simple) ---
export const SequenceCircular: React.FC<VisualProps> = ({ section, isLoading = false }) => {
  const circularData = section.data as { title?: string; items?: { label: string; desc: string; icon?: string }[] };

  if (!circularData?.items || circularData.items.length === 0) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="Process" />;
  }

  return (
    <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">{section.title}</h3>
      {circularData.title && <p className="text-center text-gray-500 dark:text-zinc-500 text-sm mb-6">{circularData.title}</p>}

      <div className="flex flex-wrap justify-center gap-6">
        {circularData.items.map((item, index) => (
          <div key={index} className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
              {circularData.items.findIndex(i => i === item) + 1}
            </div>
            <div className="w-32 p-4 bg-gradient-to-br from-gray-50 to-white dark:from-zinc-800 dark:to-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm hover:shadow-md transition-shadow text-center">
              {item.icon && <div className="text-2xl mb-2">{item.icon}</div>}
              <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">{item.label}</h4>
              <p className="text-xs text-gray-600 dark:text-zinc-400">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Chart Column Simple (for chart-column-simple) ---
export const ChartColumnSimple: React.FC<VisualProps> = ({ section, isLoading = false }) => {
  const chartData = section.data as { title?: string; items?: { label: string; value: number; color?: string }[] };

  if (!chartData?.items || chartData.items.length === 0) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="Chart" />;
  }

  const maxValue = Math.max(...chartData.items.map(d => d.value));

  return (
    <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">{section.title}</h3>
      {chartData.title && <p className="text-center text-gray-500 dark:text-zinc-500 text-sm mb-6">{chartData.title}</p>}

      <div className="h-64 flex items-end gap-2">
        {chartData.items.map((item, index) => {
          const height = (item.value / maxValue) * 100;
          const color = item.color || COLORS[index % COLORS.length];

          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-gradient-to-t from-indigo-500 to-indigo-600 rounded-t-lg"
                style={{ height: `${height}%`, backgroundColor: color }}
              ></div>
              <p className="text-xs text-gray-900 dark:text-white text-center mt-1 truncate w-full">{item.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- Chart Line Plain (for chart-line-plain-text) ---
export const ChartLinePlain: React.FC<VisualProps> = ({ section, isLoading = false }) => {
  const chartData = section.data as { title?: string; items?: { label: string; value: number }[] };

  if (!chartData?.items || chartData.items.length === 0) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="Chart" />;
  }

  const chartType = section.type as string;
  const isLineChart = chartType === 'chart-line-plain-text';

  return (
    <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">{section.title}</h3>
      {chartData.title && <p className="text-center text-gray-500 dark:text-zinc-500 text-sm mb-6">{chartData.title}</p>}

      <div className="h-64 flex items-center">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData.items} margin={{ top: 20, right:20, left:20, bottom:40 }}>
            <XAxis dataKey="label" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {chartData.items.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// --- Quadrant Quarter Card (for quadrant-quarter-simple-card) ---
export const QuadrantQuarterCard: React.FC<VisualProps> = ({ section, isLoading = false }) => {
  const quadrantData = section.data as { title?: string; quadrants?: { label: string; content: string }[] };

  if (!quadrantData?.quadrants || quadrantData.quadrants.length === 0) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="Chart" />;
  }

  const getQuadrantColor = (index: number) => {
    const colors = [
      'bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800 text-blue-700 dark:text-blue-400',
      'bg-red-50 dark:bg-red-900/20 dark:border-red-800 text-red-700 dark:text-red-400',
      'bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400',
      'bg-green-50 dark:bg-green-900/20 dark:border-green-800 text-green-700 dark:text-green-400'
    ];
    return colors[index % 4];
  };

  return (
    <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">{section.title}</h3>
      {quadrantData.title && <p className="text-center text-gray-500 dark:text-zinc-500 text-sm mb-6">{quadrantData.title}</p>}

      <div className="grid grid-cols-2 gap-4">
        {quadrantData.quadrants.map((quadrant, index) => (
          <div key={index} className={`p-6 rounded-xl border ${getQuadrantColor(index)}`}>
            <h4 className="text-center font-bold text-lg mb-3">{quadrant.label}</h4>
            <p className="text-sm leading-relaxed">{quadrant.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- List Sector (for list-sector-plain-text) ---
export const ListSector: React.FC<VisualProps> = ({ section, isLoading = false }) => {
  const sectorData = section.data as { title?: string; items?: { label: string; items?: string[] }[] };

  if (!sectorData?.items || sectorData.items.length === 0) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="Chart" />;
  }

  return (
    <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">{section.title}</h3>
      {sectorData.title && <p className="text-center text-gray-500 dark:text-zinc-500 text-sm mb-6">{sectorData.title}</p>}

      <div className="space-y-6">
        {sectorData.items.map((sector, index) => (
          <div key={index} className="p-5 bg-gradient-to-br from-gray-50 to-white dark:from-zinc-800 dark:to-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700">
            <h4 className="font-bold text-gray-900 dark:text-white mb-3">{sector.label}</h4>
            <ul className="space-y-2">
              {sector.items?.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-zinc-400">
                  <span className="text-indigo-500">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Relation Circle (for relation-circle-icon-badge, relation-circle-circular-progress) ---
export const RelationCircle: React.FC<VisualProps> = ({ section, isLoading = false }) => {
  const relationData = section.data as { title?: string; center?: string; relations?: { label: string; desc?: string }[] };

  if (!relationData?.relations || relationData.relations.length === 0) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="Chart" />;
  }

  return (
    <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">{section.title}</h3>

      <div className="flex flex-col items-center justify-center py-8">
        {/* Center Circle */}
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-center p-4 shadow-lg mb-8">
          <p className="text-sm font-bold">{relationData.center || 'Center'}</p>
        </div>

        {/* Relations */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {relationData.relations.map((rel, index) => (
            <div key={index} className="p-4 bg-gradient-to-br from-gray-50 to-white dark:from-zinc-800 dark:to-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 text-center">
              <div className="text-2xl mb-2">🔗</div>
              <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">{rel.label}</h4>
              {rel.desc && <p className="text-xs text-gray-600 dark:text-zinc-400">{rel.desc}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Sequence Roadmap (for sequence-roadmap-vertical-simple) ---
export const SequenceRoadmap: React.FC<VisualProps> = ({ section, isLoading = false }) => {
  const roadmapData = section.data as { title?: string; items?: { label: string; desc: string }[] };

  if (!roadmapData?.items || roadmapData.items.length === 0) {
    return <DataPlaceholder isLoading={isLoading} title={section.title} type="Process" />;
  }

  return (
    <div className="mb-8 p-6 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-8 text-center">{section.title}</h3>
      {roadmapData.title && <p className="text-center text-gray-500 dark:text-zinc-500 text-sm mb-8">{roadmapData.title}</p>}

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500"></div>

        <div className="space-y-8">
          {roadmapData.items.map((item, index) => (
            <div key={index} className="flex items-center gap-6">
              {/* Step Node */}
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg z-10">
                {index + 1}
              </div>

              {/* Content Card */}
              <div className="flex-1 p-5 bg-gradient-to-br from-gray-50 to-white dark:from-zinc-800 dark:to-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm hover:shadow-md transition-shadow">
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">{item.label}</h4>
                <p className="text-sm text-gray-600 dark:text-zinc-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};