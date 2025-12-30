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