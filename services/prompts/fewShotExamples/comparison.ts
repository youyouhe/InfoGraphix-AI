/**
 * Comparison Few-Shot Examples
 * Based on custom enhanced comparison components
 *
 * Component Types:
 * - CompareBinary: Two-side binary comparison
 * - CompareProsCons: Pros/Cons list with color coding
 * - CompareScoreCard: Comparison with star ratings
 * - CompareTriple: Three-way comparison
 * - CompareFeatureTable: Feature comparison with icons
 * - CompareTimeline: Before/After timeline
 * - CompareMetricGauge: Metric comparison with progress bars
 * - CompareCardStack: Stacked card comparison
 * - SWOTAnalysis: SWOT 2x2 grid
 */

import { CategoryExamples } from './types';

export const COMPARISON_EXAMPLES: CategoryExamples = {
  "category": "Comparison (对比分析)",
  "sub_categories": [
    // ============================================
    // PROS/CONS LIST
    // ============================================
    {
      "type": "Pros and Cons List (优缺点列表)",
      "example_id": "compare-pros-cons",
      "syntax": "infographic compare-pros-cons\\ndata\\n  title 方案评估\\n  pros\\n    - label 成本较低\\n      desc 无需额外设备投入\\n    - label 实施快速\\n      desc 2-3周即可上线\\n    - label 维护简单\\n      desc 现有团队可维护\\n  cons\\n    - label 功能有限\\n      desc 不支持高级功能\\n    - label 扩展性差\\n      desc 难以集成第三方系统",
      "data": { "title": "方案评估", "pros": [{ "label": "成本较低", "desc": "无需额外设备投入" }, { "label": "实施快速", "desc": "2-3周即可上线" }, { "label": "维护简单", "desc": "现有团队可维护" }], "cons": [{ "label": "功能有限", "desc": "不支持高级功能" }, { "label": "扩展性差", "desc": "难以集成第三方系统" }] }
    },

    // ============================================
    // SCORE CARD COMPARISON
    // ============================================
    {
      "type": "Score Card Comparison (打分卡对比)",
      "example_id": "compare-score-card",
      "syntax": "infographic compare-score-card\\ndata\\n  title 产品评分对比\\n  items\\n    - label 易用性\\n      leftScore 4\\n      leftDesc 界面简洁直观\\n      rightScore 3\\n      rightDesc 需要培训上手\\n    - label 性能\\n      leftScore 5\\n      leftDesc 处理速度快\\n      rightScore 4\\n      rightDesc 性能表现良好\\n    - label 性价比\\n      leftScore 4\\n      leftDesc 价格适中\\n      rightScore 5\\n      rightDesc 价格更具优势",
      "data": { "title": "产品评分对比", "items": [{ "label": "易用性", "leftScore": 4, "leftDesc": "界面简洁直观", "rightScore": 3, "rightDesc": "需要培训上手" }, { "label": "性能", "leftScore": 5, "leftDesc": "处理速度快", "rightScore": 4, "rightDesc": "性能表现良好" }, { "label": "性价比", "leftScore": 4, "leftDesc": "价格适中", "rightScore": 5, "rightDesc": "价格更具优势" }] }
    },

    // ============================================
    // TRIPLE COMPARISON
    // ============================================
    {
      "type": "Triple Comparison (三方对比)",
      "example_id": "compare-triple",
      "syntax": "infographic compare-triple\\ndata\\n  title 云服务商对比\\n  items\\n    - label 价格\\n      optionA $99/月\\n      optionB $149/月\\n      optionC $199/月\\n    - label 存储\\n      optionA 100GB\\n      optionB 500GB\\n      optionC 1TB\\n    - label 支持\\n      optionA 邮件\\n      optionB 邮件+电话\\n      optionC 24/7全支持",
      "data": { "title": "云服务商对比", "items": [{ "label": "价格", "optionA": "$99/月", "optionB": "$149/月", "optionC": "$199/月" }, { "label": "存储", "optionA": "100GB", "optionB": "500GB", "optionC": "1TB" }, { "label": "支持", "optionA": "邮件", "optionB": "邮件+电话", "optionC": "24/7全支持" }] }
    },

    // ============================================
    // FEATURE TABLE COMPARISON
    // ============================================
    {
      "type": "Feature Table Comparison (特征对比表)",
      "example_id": "compare-feature-table",
      "syntax": "infographic compare-feature-table\\ndata\\n  title 工具功能对比\\n  features\\n    - label AI助手\\n      icon lucide/sparkles\\n      optionA true\\n      optionB true\\n      optionC false\\n    - label 导出格式\\n      icon lucide/file-down\\n      optionA PDF/Word\\n      optionB PDF only\\n      optionC Multiple\\n    - label 协作功能\\n      icon lucide/users\\n      optionA 10人\\n      optionB 5人\\n      optionC Unlimited\\n    - label API支持\\n      icon lucide/code\\n      optionA true\\n      optionB false\\n      optionC true",
      "data": { "title": "工具功能对比", "features": [{ "label": "AI助手", "icon": "lucide/sparkles", "optionA": true, "optionB": true, "optionC": false }, { "label": "导出格式", "icon": "lucide/file-down", "optionA": "PDF/Word", "optionB": "PDF only", "optionC": "Multiple" }, { "label": "协作功能", "icon": "lucide/users", "optionA": "10人", "optionB": "5人", "optionC": "Unlimited" }, { "label": "API支持", "icon": "lucide/code", "optionA": true, "optionB": false, "optionC": true }] }
    },

    // ============================================
    // TIMELINE COMPARISON
    // ============================================
    {
      "type": "Timeline Comparison (时间线对比)",
      "example_id": "compare-timeline",
      "syntax": "infographic compare-timeline\\ndata\\n  title 版本更新对比\\n  items\\n    - label v1.0\\n      before 基础功能\\n      after 基础功能+UI优化\\n      change improvement\\n    - label v2.0\\n      before 基础功能+UI优化\\n      after 新增数据分析\\n      change improvement\\n    - label v3.0\\n      before 新增数据分析\\n      after 完整AI能力\\n      change improvement",
      "data": { "title": "版本更新对比", "items": [{ "label": "v1.0", "before": "基础功能", "after": "基础功能+UI优化", "change": "improvement" }, { "label": "v2.0", "before": "基础功能+UI优化", "after": "新增数据分析", "change": "improvement" }, { "label": "v3.0", "before": "新增数据分析", "after": "完整AI能力", "change": "improvement" }] }
    },

    // ============================================
    // METRIC GAUGE COMPARISON
    // ============================================
    {
      "type": "Metric Gauge Comparison (指标仪表盘对比)",
      "example_id": "compare-metric-gauge",
      "syntax": "infographic compare-metric-gauge\\ndata\\n  title KPI达成率对比\\n  metrics\\n    - label 营收目标\\n      optionA 85\\n      optionB 92\\n    - label 用户增长\\n      optionA 70\\n      optionB 88\\n    - label 客户满意度\\n      optionA 90\\n      optionB 85",
      "data": { "title": "KPI达成率对比", "metrics": [{ "label": "营收目标", "optionA": 85, "optionB": 92 }, { "label": "用户增长", "optionA": 70, "optionB": 88 }, { "label": "客户满意度", "optionA": 90, "optionB": 85 }] }
    },

    // ============================================
    // CARD STACK COMPARISON
    // ============================================
    {
      "type": "Card Stack Comparison (卡片堆叠对比)",
      "example_id": "compare-card-stack",
      "syntax": "infographic compare-card-stack\\ndata\\n  title 技术栈对比\\n  stacks\\n    - label 前端\\n      title 用户界面层\\n      items\\n        - label React\\n          value 组件化开发\\n        - label TypeScript\\n          value 类型安全\\n        - label Tailwind\\n          value 样式框架\\n    - label 后端\\n      title 业务逻辑层\\n      items\\n        - label Node.js\\n          value 高性能运行时\\n        -label Python\\n          value 数据处理\\n        -label PostgreSQL\\n          value 关系数据库\\n    - label 基础设施\\n      title 基础设施层\\n      items\\n        - label AWS\\n          value 云服务\\n        -label Docker\\n          value 容器部署\\n        -label Kubernetes\\n          value 容器编排",
      "data": { "title": "技术栈对比", "stacks": [{ "label": "前端", "title": "用户界面层", "items": [{ "label": "React", "value": "组件化开发" }, { "label": "TypeScript", "value": "类型安全" }, { "label": "Tailwind", "value": "样式框架" }] }, { "label": "后端", "title": "业务逻辑层", "items": [{ "label": "Node.js", "value": "高性能运行时" }, { "label": "Python", "value": "数据处理" }, { "label": "PostgreSQL", "value": "关系数据库" }] }, { "label": "基础设施", "title": "基础设施层", "items": [{ "label": "AWS", "value": "云服务" }, { "label": "Docker", "value": "容器部署" }, { "label": "Kubernetes", "value": "容器编排" }] }] }
    },

    // ============================================
    // ORIGINAL - SWOT ANALYSIS
    // ============================================
    {
      "type": "SWOT Analysis (SWOT分析)",
      "example_id": "compare-swot",
      "syntax": "infographic compare-swot\\ndata\\n  title SWOT分析\\n  desc 通过全面分析内外部因素，指导企业战略制定与调整\\n  items\\n    - label Strengths\\n      content 领先的技术研发能力、完善的供应链体系、高效的客户服务机制、成熟的管理团队、良好的用户口碑、稳定的产品质量\\n    - label Weaknesses\\n      content 品牌曝光度不足、产品线更新缓慢、市场渠道单一、运营成本较高、组织决策效率偏低、用户增长放缓\\n    - label Opportunities\\n      content 数字化转型趋势加速、新兴市场持续扩展、政策利好推动行业发展、智能化应用场景增加、跨界合作机会增多、用户消费升级趋势\\n    - label Threats\\n      content 行业竞争日益激烈、用户需求快速变化、市场进入门槛降低、供应链风险上升、数据与安全挑战加剧、宏观经济不确定性",
      "data": { "title": "SWOT分析", "desc": "通过全面分析内外部因素，指导企业战略制定与调整", "items": [{ "label": "Strengths", "content": "领先的技术研发能力、完善的供应链体系、高效的客户服务机制、成熟的管理团队、良好的用户口碑、稳定的产品质量" }, { "label": "Weaknesses", "content": "品牌曝光度不足、产品线更新缓慢、市场渠道单一、运营成本较高、组织决策效率偏低、用户增长放缓" }, { "label": "Opportunities", "content": "数字化转型趋势加速、新兴市场持续扩展、政策利好推动行业发展、智能化应用场景增加、跨界合作机会增多、用户消费升级趋势" }, { "label": "Threats", "content": "行业竞争日益激烈、用户需求快速变化、市场进入门槛降低、供应链风险上升、数据与安全挑战加剧、宏观经济不确定性" }] }
    },

    // ============================================
    // ORIGINAL - BINARY COMPARISON (keep for compatibility)
    // ============================================
    {
      "type": "Binary Simple Fold (二元对比-折叠)",
      "example_id": "compare-binary-fold",
      "syntax": "infographic compare-binary-fold\\ndata\\n  title 企业优劣势对比\\n  items\\n    - label 优势\\n      children\\n        - label 产品研发强\\n          desc 技术领先，具备自主创新能力\\n        - label 客户粘性高\\n          desc 用户复购率超60%，口碑良好\\n    - label 劣势\\n      children\\n        - label 品牌曝光弱\\n          desc 市场宣传不足，认知度待提升\\n        - label 渠道覆盖窄\\n          desc 线上渠道布局不全，触达受限",
      "data": { "title": "企业优劣势对比", "items": [{ "label": "优势", "children": [{ "label": "产品研发强", "desc": "技术领先，具备自主创新能力" }, { "label": "客户粘性高", "desc": "用户复购率超60%，口碑良好" }] }, { "label": "劣势", "children": [{ "label": "品牌曝光弱", "desc": "市场宣传不足，认知度待提升" }, { "label": "渠道覆盖窄", "desc": "线上渠道布局不全，触达受限" }] }] }
    }
  ]
};
