import { UILanguage } from './locales';

export type TranslationKey = keyof typeof translations.en;

interface Translations {
  en: Record<string, string>;
  zh: Record<string, string>;
}

export const translations: Translations = {
  en: {
    // App
    appName: 'InfoGraphix AI',
    appTagline: 'Enter a complex topic to generate a beautiful, data-driven infographic report powered by AI.',

    // Sidebar
    history: 'History',
    noHistory: 'No history yet.',
    noHistoryHint: 'Start a new research topic.',
    newChat: 'New Chat',
    clearHistory: 'Clear History',

    // Input
    placeholder: 'Tell me your topic, I will generate an infographic report...',
    send: 'Send',
    cmdEnter: 'CMD + Enter to send',

    // Providers
    provider: 'AI Provider',
    model: 'Model',
    settings: 'Settings',
    apiKeyRequired: 'API Key Required',
    apiKeyStatus: 'API Key Status',

    // Display Mode
    displayMode: 'Display Mode',
    modeVertical: 'Vertical Scroll',
    modeHorizontal: 'Horizontal Scroll',
    modePagination: 'Page Mode',

    // Loading
    loading: 'Streaming...',
    previewMode: 'Preview Mode',
    synthesizing: 'Synthesizing Research...',
    gatheringData: 'Gathering data from valid sources',

    // Errors
    generationFailed: 'Generation Failed',
    retry: 'Retry',
    apiKeyMissing: 'API key is missing',
    enterApiKey: 'Enter API Key',
    apiKeyDesc: '{provider} API Key is required',
    saveAndGenerate: 'Save & Generate',
    cancel: 'Cancel',
    close: 'Close',
    manageInSettings: 'Manage in Settings',
    apiKeyCopied: 'API Key copied to clipboard!',
    clickToViewKey: 'Click to view API Key',
    noApiKeyHint: 'No API Key - add in Settings',

    // Export
    exportCurrent: 'Export This Page (PNG)',
    exportAll: 'Export All Pages (PNG)',
    exportTitle: 'Export PNG',
    exportSuccess: 'PNG exported successfully!',

    // Debug
    debugView: 'Toggle Debug View',
    liveOutput: 'Live LLM Output',
    noReportData: 'No active report data',

    // Theme
    toggleTheme: 'Toggle Theme',
    showSidebar: 'Show Sidebar',
    hideSidebar: 'Hide Sidebar',

    // Sources
    sources: 'Sources & References',

    // Pagination
    previous: 'Previous',
    next: 'Next',
    summary: 'Summary',
    page: 'Page',
    sections: 'sections',

    // Suggestions
    suggestion1: 'Evolution of AI models from 2020 to 2024',
    suggestion2: 'Comparison between React and Vue ecosystems',
    suggestion3: 'Global EV Market Analysis Q3 2024',
    suggestion4: 'Lifecycle of a Star: From Nebula to Black Hole',
  },

  zh: {
    // App
    appName: 'InfoGraphix AI',
    appTagline: '输入一个复杂的话题，生成由 AI 驱动的精美数据可视化信息图报告。',

    // Sidebar
    history: '历史记录',
    noHistory: '暂无历史记录',
    noHistoryHint: '开始一个新的研究话题',
    newChat: '新对话',
    clearHistory: '清空历史',

    // Input
    placeholder: '告诉我你感兴趣的话题，我会生成信息图报告...',
    send: '发送',
    cmdEnter: 'CMD + Enter 发送',

    // Providers
    provider: 'AI 提供者',
    model: '模型',
    settings: '设置',
    apiKeyRequired: '需要 API 密钥',
    apiKeyStatus: 'API 密钥状态',

    // Display Mode
    displayMode: '显示模式',
    modeVertical: '垂直滚动',
    modeHorizontal: '水平滚动',
    modePagination: '分页模式',

    // Loading
    loading: '生成中...',
    previewMode: '预览模式',
    synthesizing: '正在合成研究...',
    gatheringData: '从有效来源收集数据',

    // Errors
    generationFailed: '生成失败',
    retry: '重试',
    apiKeyMissing: 'API 密钥缺失',
    enterApiKey: '输入 API 密钥',
    apiKeyDesc: '需要 {provider} API 密钥',
    saveAndGenerate: '保存并生成',
    cancel: '取消',
    close: '关闭',
    manageInSettings: '在设置中管理',
    apiKeyCopied: 'API 密钥已复制到剪贴板！',
    clickToViewKey: '点击查看 API 密钥',
    noApiKeyHint: '无 API 密钥 - 在设置中添加',

    // Export
    exportCurrent: '导出当前页 (PNG)',
    exportAll: '导出所有页 (PNG)',
    exportTitle: '导出 PNG',
    exportSuccess: 'PNG 导出成功！',

    // Debug
    debugView: '切换调试视图',
    liveOutput: '实时 LLM 输出',
    noReportData: '无活动报告数据',

    // Theme
    toggleTheme: '切换主题',
    showSidebar: '显示侧边栏',
    hideSidebar: '隐藏侧边栏',

    // Sources
    sources: '来源与参考',

    // Pagination
    previous: '上一页',
    next: '下一页',
    summary: '摘要',
    page: '页面',
    sections: '节',

    // Suggestions
    suggestion1: '2020-2024年 AI 模型演进史',
    suggestion2: 'React 与 Vue 生态系统对比',
    suggestion3: '2024年第三季度全球电动汽车市场分析',
    suggestion4: '恒星的生命周期：从星云到黑洞',
  },
};

/**
 * Get translation for a key
 */
export function t(key: TranslationKey, language: UILanguage = 'en'): string {
  return translations[language]?.[key] || translations.en[key] || key;
}

/**
 * Get translation with parameters
 */
export function tp(key: TranslationKey, params: Record<string, string>, language: UILanguage = 'en'): string {
  let text = t(key, language);
  Object.entries(params).forEach(([param, value]) => {
    text = text.replace(`{${param}}`, value);
  });
  return text;
}
