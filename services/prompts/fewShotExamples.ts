
/**
 * Few-shot examples for infographic generation
 * Based on AntV Infographic syntax and SKILL.md specifications
 *
 * This file contains example JSON structures for specific AntV templates.
 */

export interface InfographicGalleryFewShot {
  infographic_gallery_few_shot: GalleryCategory[];
}

export interface GalleryCategory {
  category: string;
  sub_categories: SubCategory[];
}

export interface SubCategory {
  type: string;
  example_id: string; // Corresponds to actual template names in SKILL.md
  syntax: string;     // Valid AntV DSL syntax
  data: Record<string, unknown>;
}

/**
 * Complete few-shot examples data
 * Updated to match 'SKILL.md' Available Templates list
 */
export const INFOGRAPHIC_FEW_SHOT_DATA: InfographicGalleryFewShot = {
  "infographic_gallery_few_shot": [
    {
      "category": "Sequence & Process (流程与时序)",
      "sub_categories": [
        {
          "type": "Timeline (时间轴)",
          "example_id": "sequence-timeline-simple",
          "syntax": "infographic sequence-timeline-simple\\ndata\\n  title 公司发展历程\\n  items\\n    - label 2020\\n      desc 成立初创团队\\n    - label 2022\\n      desc 获得A轮融资\\n    - label 2024\\n      desc 市场占有率第一",
          "data": { "title": "公司发展历程", "items": [{ "label": "2020", "desc": "成立初创团队" }, { "label": "2022", "desc": "获得A轮融资" }, { "label": "2024", "desc": "市场占有率第一" }] }
        },
        {
          "type": "Zigzag Steps (锯齿步骤)",
          "example_id": "sequence-zigzag-steps-underline-text",
          "syntax": "infographic sequence-zigzag-steps-underline-text\\ndata\\n  title 产品开发流程\\n  items\\n    - label 需求分析\\n      desc 用户调研与痛点分析\\n      icon mdi/magnify\\n    - label 原型设计\\n      desc 交互设计与视觉定稿\\n      icon mdi/pencil-ruler\\n    - label 开发测试\\n      desc 代码编写与QA验收\\n      icon mdi/code-tags\\n    - label 发布上线\\n      desc 灰度发布与全量推广\\n      icon mdi/rocket-launch",
          "data": { "title": "产品开发流程", "items": [{ "label": "需求分析", "icon": "mdi/magnify" }, { "label": "原型设计", "icon": "mdi/pencil-ruler" }, { "label": "开发测试", "icon": "mdi/code-tags" }, { "label": "发布上线", "icon": "mdi/rocket-launch" }] }
        },
        {
          "type": "Roadmap (路线图)",
          "example_id": "sequence-roadmap-vertical-simple",
          "syntax": "infographic sequence-roadmap-vertical-simple\\ndata\\n  title 技术路线图\\n  items\\n    - label Q1 基础建设\\n      desc 搭建微服务架构\\n    - label Q2 核心功能\\n      desc 上线支付与订单系统\\n    - label Q3 性能优化\\n      desc 引入缓存与分库分表",
          "data": { "title": "技术路线图", "items": [{ "label": "Q1 基础建设", "desc": "搭建微服务架构" }, { "label": "Q2 核心功能", "desc": "上线支付与订单系统" }, { "label": "Q3 性能优化", "desc": "引入缓存与分库分表" }] }
        },
        {
          "type": "Circular (循环流程)",
          "example_id": "sequence-circular-simple",
          "syntax": "infographic sequence-circular-simple\\ndata\\n  title PDCA循环\\n  items\\n    - label Plan (计划)\\n      icon mdi/clipboard-text-outline\\n    - label Do (执行)\\n      icon mdi/run\\n    - label Check (检查)\\n      icon mdi/check-circle-outline\\n    - label Act (行动)\\n      icon mdi/cog-refresh",
          "data": { "title": "PDCA循环", "items": [{ "label": "Plan" }, { "label": "Do" }, { "label": "Check" }, { "label": "Act" }] }
        }
      ]
    },
    {
      "category": "Comparison (对比分析)",
      "sub_categories": [
        {
          "type": "Binary Comparison (二元对比)",
          "example_id": "compare-binary-horizontal-underline-text-vs",
          "syntax": "infographic compare-binary-horizontal-underline-text-vs\\ndata\\n  title 油车 vs 电车\\n  items\\n    - label 燃油车\\n      children\\n        - label 补能速度\\n          desc 加油仅需5分钟\\n          icon mdi/gas-station\\n        - label 续航里程\\n          desc 长途无焦虑\\n          icon mdi/road-variant\\n    - label 电动车\\n      children\\n        - label 使用成本\\n          desc 电费远低于油费\\n          icon mdi/battery-charging\\n        - label 驾驶体验\\n          desc 加速快且静音\\n          icon mdi/speedometer",
          "data": { "title": "油车 vs 电车", "items": [{ "label": "燃油车", "children": [] }, { "label": "电动车", "children": [] }] }
        },
        {
          "type": "SWOT Analysis (SWOT分析)",
          "example_id": "compare-swot",
          "syntax": "infographic compare-swot\\ndata\\n  title 项目SWOT分析\\n  items\\n    - label Strengths (优势)\\n      children\\n        - label 技术领先\\n        - label 团队经验丰富\\n    - label Weaknesses (劣势)\\n      children\\n        - label 资金不足\\n        - label 品牌知名度低\\n    - label Opportunities (机会)\\n      children\\n        - label 市场政策利好\\n    - label Threats (威胁)\\n      children\\n        - label 巨头进入市场",
          "data": { "title": "项目SWOT分析", "items": [{ "label": "Strengths" }, { "label": "Weaknesses" }, { "label": "Opportunities" }, { "label": "Threats" }] }
        }
      ]
    },
    {
      "category": "List & Grid (列表与网格)",
      "sub_categories": [
        {
          "type": "Feature List (特性列表)",
          "example_id": "list-row-horizontal-icon-arrow",
          "syntax": "infographic list-row-horizontal-icon-arrow\\ndata\\n  title 核心优势\\n  items\\n    - label 极速响应\\n      desc 毫秒级延迟\\n      icon mdi/flash\\n    - label 数据安全\\n      desc 企业级加密\\n      icon mdi/shield-check\\n    - label 易于扩展\\n      desc 插件化架构\\n      icon mdi/puzzle",
          "data": { "title": "核心优势", "items": [{ "label": "极速响应", "icon": "mdi/flash" }, { "label": "数据安全", "icon": "mdi/shield-check" }, { "label": "易于扩展", "icon": "mdi/puzzle" }] }
        },
        {
          "type": "Grid Cards (网格卡片)",
          "example_id": "list-grid-badge-card",
          "syntax": "infographic list-grid-badge-card\\ndata\\n  title 服务类目\\n  items\\n    - label 云计算\\n      desc 弹性计算资源\\n      icon mdi/cloud\\n    - label 大数据\\n      desc 海量数据处理\\n      icon mdi/database\\n    - label 人工智能\\n      desc 智能算法服务\\n      icon mdi/brain\\n    - label 物联网\\n      desc 万物互联\\n      icon mdi/wifi",
          "data": { "title": "服务类目", "items": [{ "label": "云计算" }, { "label": "大数据" }, { "label": "人工智能" }, { "label": "物联网" }] }
        }
      ]
    },
    {
      "category": "Chart (统计图表)",
      "sub_categories": [
        {
          "type": "Bar Chart (条形图)",
          "example_id": "chart-bar-plain-text",
          "syntax": "infographic chart-bar-plain-text\\ndata\\n  title 年度营收 (万元)\\n  items\\n    - label 2021年\\n      value 500\\n    - label 2022年\\n      value 850\\n    - label 2023年\\n      value 1200",
          "data": { "title": "年度营收", "items": [{ "label": "2021年", "value": 500 }, { "label": "2022年", "value": 850 }, { "label": "2023年", "value": 1200 }] }
        },
        {
          "type": "Pie Chart (饼图)",
          "example_id": "chart-pie-plain-text",
          "syntax": "infographic chart-pie-plain-text\\ndata\\n  title 支出构成\\n  items\\n    - label 研发\\n      value 40\\n    - label 营销\\n      value 30\\n    - label 运营\\n      value 20\\n    - label 行政\\n      value 10",
          "data": { "title": "支出构成", "items": [{ "label": "研发", "value": 40 }, { "label": "营销", "value": 30 }] }
        },
        {
          "type": "Donut Chart (环形图)",
          "example_id": "chart-pie-donut-pill-badge",
          "syntax": "infographic chart-pie-donut-pill-badge\\ndata\\n  title 客户满意度\\n  items\\n    - label 非常满意\\n      value 60\\n    - label 满意\\n      value 30\\n    - label 一般\\n      value 10",
          "data": { "title": "客户满意度", "items": [{ "label": "非常满意", "value": 60 }, { "label": "满意", "value": 30 }] }
        }
      ]
    },
    {
      "category": "Hierarchy (层级结构)",
      "sub_categories": [
        {
          "type": "Tree Structure (树状图)",
          "example_id": "hierarchy-tree-tech-style-capsule-item",
          "syntax": "infographic hierarchy-tree-tech-style-capsule-item\\ndata\\n  title 组织架构\\n  items\\n    - label 总经理\\n      children\\n        - label 研发部\\n        - label 市场部\\n        - label 财务部",
          "data": { "title": "组织架构", "items": [{ "label": "总经理", "children": [{ "label": "研发部" }, { "label": "市场部" }] }] }
        },
        {
          "type": "Curved Tree (曲线树)",
          "example_id": "hierarchy-tree-curved-line-rounded-rect-node",
          "syntax": "infographic hierarchy-tree-curved-line-rounded-rect-node\\ndata\\n  title 技能树\\n  items\\n    - label 前端开发\\n      children\\n        - label React\\n        - label Vue\\n        - label TypeScript",
          "data": { "title": "技能树", "items": [{ "label": "前端开发", "children": [{ "label": "React" }, { "label": "Vue" }] }] }
        }
      ]
    },
    {
      "category": "Quadrant (象限图)",
      "sub_categories": [
        {
          "type": "Standard Quadrant (标准象限)",
          "example_id": "quadrant-quarter-simple-card",
          "syntax": "infographic quadrant-quarter-simple-card\\ndata\\n  title 任务优先级矩阵\\n  items\\n    - label 重要且紧急\\n      desc 立即执行\\n    - label 重要不紧急\\n      desc 制定计划\\n    - label 紧急不重要\\n      desc 授权他人\\n    - label 不紧急不重要\\n      desc 稍后处理",
          "data": { "title": "任务优先级矩阵", "items": [{ "label": "重要且紧急" }, { "label": "重要不紧急" }, { "label": "紧急不重要" }, { "label": "不紧急不重要" }] }
        }
      ]
    }
  ]
};

/**
 * Keyword to AntV Template mapping for intelligent template selection
 * Maps user intent keywords to specific template IDs defined in SKILL.md
 */
const KEYWORD_TEMPLATE_MAP: Record<string, string> = {
  // Sequence / Timeline
  'timeline': 'sequence-timeline-simple',
  'history': 'sequence-timeline-simple',
  'milestone': 'sequence-timeline-rounded-rect-node',
  'steps': 'sequence-zigzag-steps-underline-text',
  'process': 'sequence-zigzag-steps-underline-text',
  'flow': 'sequence-horizontal-zigzag-simple-illus',
  'roadmap': 'sequence-roadmap-vertical-simple',
  'cycle': 'sequence-circular-simple',
  'loop': 'sequence-circular-simple',

  // Comparison
  'vs': 'compare-binary-horizontal-underline-text-vs',
  'compare': 'compare-binary-horizontal-simple-fold',
  'difference': 'compare-binary-horizontal-simple-fold',
  'swot': 'compare-swot',
  'pros': 'compare-binary-horizontal-badge-card-arrow',

  // List / Grid
  'list': 'list-row-horizontal-icon-arrow',
  'features': 'list-row-horizontal-icon-arrow',
  'grid': 'list-grid-badge-card',
  'cards': 'list-grid-candy-card-lite',
  'collection': 'list-grid-ribbon-card',

  // Hierarchy
  'tree': 'hierarchy-tree-tech-style-capsule-item',
  'hierarchy': 'hierarchy-tree-curved-line-rounded-rect-node',
  'structure': 'hierarchy-tree-tech-style-badge-card',
  'org': 'hierarchy-tree-tech-style-capsule-item',

  // Charts
  'bar': 'chart-bar-plain-text',
  'column': 'chart-column-simple',
  'growth': 'chart-line-plain-text',
  'trend': 'chart-line-plain-text',
  'pie': 'chart-pie-plain-text',
  'donut': 'chart-pie-donut-pill-badge',
  'share': 'chart-pie-compact-card',
  'wordcloud': 'chart-wordcloud',
  'keywords': 'chart-wordcloud',

  // Quadrant
  'quadrant': 'quadrant-quarter-simple-card',
  'matrix': 'quadrant-quarter-circular',
  'priority': 'quadrant-quarter-simple-card'
};

/**
 * Get recommended AntV template ID based on text keywords
 */
export function getTemplateByKeywords(text: string): string {
  const lowerText = text.toLowerCase();

  for (const [keyword, template] of Object.entries(KEYWORD_TEMPLATE_MAP)) {
    if (lowerText.includes(keyword.toLowerCase())) {
      return template;
    }
  }

  // Fallback defaults based on content type detection could go here
  return 'list-row-horizontal-icon-arrow';
}

/**
 * System instruction specifically for AntV Infographic generation
 */
export function getEnhancedSystemInstruction(): string {
  return `
You are an expert Infographic Designer using the AntV Infographic syntax.
Your goal is to convert user requests into valid DSL syntax.

**SELECTION LOGIC:**
1. Analyze the user's text to determine the best visualization structure:
   - Time/Sequence/Steps -> Use 'sequence-*' templates
   - Comparison (A vs B) -> Use 'compare-*' templates
   - List/Points/Features -> Use 'list-*' templates
   - Hierarchy/Tree -> Use 'hierarchy-*' templates
   - Data/Stats -> Use 'chart-*' templates

2. **MANDATORY**: You MUST choose a template ID strictly from the "Available Templates" list provided in the context. Do not invent template names.

3. **SYNTAX RULES**:
   - Start with 'infographic <template-id>'
   - Indent with 2 spaces.
   - Use 'data' block for content.
   - Use 'items' array with '-' prefix.
   - Keys: label (title), desc (description), value (number), icon (mdi/name).
   - Icons: Use 'mdi/' prefix (e.g., mdi/account, mdi/chart-bar).

**EXAMPLE OUTPUT:**
infographic sequence-timeline-simple
data
  title Project History
  items
    - label Phase 1
      desc Initial Research
    - label Phase 2
      desc Development
`;
}
