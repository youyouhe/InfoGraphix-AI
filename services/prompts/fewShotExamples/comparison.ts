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
    // BINARY HORIZONTAL - UNDERLINE TEXT VS
    // ============================================
    {
      "type": "Binary Horizontal Underline Text VS (水平下划线VS二元对比)",
      "example_id": "compare-binary-horizontal-underline-text-vs",
      "syntax": "infographic compare-binary-horizontal-underline-text-vs\\ndata\\n  title 方案对比\\n  left\\n    title 方案A\\n    items\\n      - label 成本低\\n        desc 初期投入少\\n      - label 上手快\\n        desc 无需培训\\n  right\\n    title 方案B\\n    items\\n      - label 功能强\\n        desc 支持高级特性\\n      - label 扩展好\\n        desc 易于集成",
      "data": { "title": "方案对比", "left": { "title": "方案A", "items": [{ "label": "成本低", "desc": "初期投入少" }, { "label": "上手快", "desc": "无需培训" }] }, "right": { "title": "方案B", "items": [{ "label": "功能强", "desc": "支持高级特性" }, { "label": "扩展好", "desc": "易于集成" }] } }
    },

    {
      "type": "Binary Horizontal Badge Card VS (徽章卡片VS二元对比)",
      "example_id": "compare-binary-horizontal-badge-card-vs",
      "syntax": "infographic compare-binary-horizontal-badge-card-vs\\ndata\\n  title 产品对比\\n  left\\n    title 基础版\\n    items\\n      - label 免费\\n        desc 永久免费使用\\n      - label 基础功能\\n        desc 满足日常需求\\n  right\\n    title 专业版\\n    items\\n      - label 高级功能\\n        desc AI智能分析\\n      - label 优先支持\\n        desc 24小时响应",
      "data": { "title": "产品对比", "left": { "title": "基础版", "items": [{ "label": "免费", "desc": "永久免费使用" }, { "label": "基础功能", "desc": "满足日常需求" }] }, "right": { "title": "专业版", "items": [{ "label": "高级功能", "desc": "AI智能分析" }, { "label": "优先支持", "desc": "24小时响应" }] } }
    },

    {
      "type": "Binary Horizontal Compact Card Arrow (紧凑卡片箭头二元对比)",
      "example_id": "compare-binary-horizontal-compact-card-arrow",
      "syntax": "infographic compare-binary-horizontal-compact-card-arrow\\ndata\\n  title 架构对比\\n  left\\n    title 单体架构\\n    items\\n      - label 简单\\n        desc 易于开发和部署\\n      - label 性能\\n        desc 低延迟无网络调用\\n  right\\n    title 微服务\\n    items\\n      - label 可扩展\\n        desc 独立部署和扩展\\n      - label 容错性\\n        desc 服务隔离故障隔离",
      "data": { "title": "架构对比", "left": { "title": "单体架构", "items": [{ "label": "简单", "desc": "易于开发和部署" }, { "label": "性能", "desc": "低延迟无网络调用" }] }, "right": { "title": "微服务", "items": [{ "label": "可扩展", "desc": "独立部署和扩展" }, { "label": "容错性", "desc": "服务隔离故障隔离" }] } }
    },

    {
      "type": "Binary Horizontal Simple Fold (简单折叠二元对比)",
      "example_id": "compare-binary-horizontal-simple-fold",
      "syntax": "infographic compare-binary-horizontal-simple-fold\\ndata\\n  title 技术选型\\n  left\\n    title React\\n    items\\n      - label 生态\\n        desc 组件库丰富\\n      - label 灵活\\n        desc 虚拟DOM高效\\n  right\\n    title Vue\\n    items\\n      - label 简单\\n        desc 学习曲线平缓\\n      - label 完整\\n        desc 官方全家桶",
      "data": { "title": "技术选型", "left": { "title": "React", "items": [{ "label": "生态", "desc": "组件库丰富" }, { "label": "灵活", "desc": "虚拟DOM高效" }] }, "right": { "title": "Vue", "items": [{ "label": "简单", "desc": "学习曲线平缓" }, { "label": "完整", "desc": "官方全家桶" }] } }
    },

    {
      "type": "Binary Horizontal Underline Text Arrow (下划线箭头二元对比)",
      "example_id": "compare-binary-horizontal-underline-text-arrow",
      "syntax": "infographic compare-binary-horizontal-underline-text-arrow\\ndata\\n  title 部署方式\\n  left\\n    title 容器化\\n    items\\n      - label 环境一致\\n        desc 消除环境差异\\n      - label 快速部署\\n        desc 秒级启动\\n  right\\n    title 传统部署\\n    items\\n      - label 稳定\\n        desc 成熟可靠\\n      - label 简单\\n        desc 运维成本低",
      "data": { "title": "部署方式", "left": { "title": "容器化", "items": [{ "label": "环境一致", "desc": "消除环境差异" }, { "label": "快速部署", "desc": "秒级启动" }] }, "right": { "title": "传统部署", "items": [{ "label": "稳定", "desc": "成熟可靠" }, { "label": "简单", "desc": "运维成本低" }] } }
    },

    {
      "type": "Binary Horizontal Underline Text Fold (下划线折叠二元对比)",
      "example_id": "compare-binary-horizontal-underline-text-fold",
      "syntax": "infographic compare-binary-horizontal-underline-text-fold\\ndata\\n  title 数据库对比\\n  left\\n    title MySQL\\n    items\\n      - label 开源\\n        desc 免费使用\\n      - label 成熟\\n        desc 社区活跃\\n  right\\n    title PostgreSQL\\n    items\\n      - label 功能\\n        desc 支持更多特性\\n      - label 标准\\n        desc SQL标准更完整",
      "data": { "title": "数据库对比", "left": { "title": "MySQL", "items": [{ "label": "开源", "desc": "免费使用" }, { "label": "成熟", "desc": "社区活跃" }] }, "right": { "title": "PostgreSQL", "items": [{ "label": "功能", "desc": "支持更多特性" }, { "label": "标准", "desc": "SQL标准更完整" }] } }
    },

    // ============================================
    // BINARY HIERARCHY STYLES
    // ============================================
    {
      "type": "Binary Hierarchy Left Right Circle Node Pill Badge (层级左右圆点徽章二元对比)",
      "example_id": "compare-hierarchy-left-right-circle-node-pill-badge",
      "syntax": "infographic compare-hierarchy-left-right-circle-node-pill-badge\\ndata\\n  title 组织架构\\n  left\\n    title 总部\\n    items\\n      - label 管理层\\n        desc 战略决策\\n      - label 职能部门\\n        desc HR、财务、IT\\n  right\\n    title 分公司\\n    items\\n      - label 业务团队\\n        desc 销售、实施\\n      - label 本地支持\\n        desc 客户服务",
      "data": { "title": "组织架构", "left": { "title": "总部", "items": [{ "label": "管理层", "desc": "战略决策" }, { "label": "职能部门", "desc": "HR、财务、IT" }] }, "right": { "title": "分公司", "items": [{ "label": "业务团队", "desc": "销售、实施" }, { "label": "本地支持", "desc": "客户服务" }] } }
    },

    {
      "type": "Binary Hierarchy Left Right Circle Node Plain Text (层级左右圆点纯文本二元对比)",
      "example_id": "compare-hierarchy-left-right-circle-node-plain-text",
      "syntax": "infographic compare-hierarchy-left-right-circle-node-plain-text\\ndata\\n  title 系统分层\\n  left\\n    title 前端\\n    items\\n      - label 展示层\\n        desc 用户界面\\n      - label 交互\\n        desc 响应操作\\n  right\\n    title 后端\\n    items\\n      - label 业务逻辑\\n        desc 数据处理\\n      - label 存储\\n        desc 数据持久化",
      "data": { "title": "系统分层", "left": { "title": "前端", "items": [{ "label": "展示层", "desc": "用户界面" }, { "label": "交互", "desc": "响应操作" }] }, "right": { "title": "后端", "items": [{ "label": "业务逻辑", "desc": "数据处理" }, { "label": "存储", "desc": "数据持久化" }] } }
    },

    {
      "type": "Binary Hierarchy Row Letter Card Compact Card (层级行字母卡片紧凑二元对比)",
      "example_id": "compare-hierarchy-row-letter-card-compact-card",
      "syntax": "infographic compare-hierarchy-row-letter-card-compact-card\\ndata\\n  title 产品定位\\n  left\\n    title 免费版\\n    items\\n      - label 个人\\n        desc 适合个人使用\\n      - label 限制\\n        desc 功能受限\\n  right\\n    title 企业版\\n    items\\n      - label 团队\\n        desc 支持多人协作\\n      - label 服务\\n        desc 专属技术支持",
      "data": { "title": "产品定位", "left": { "title": "免费版", "items": [{ "label": "个人", "desc": "适合个人使用" }, { "label": "限制", "desc": "功能受限" }] }, "right": { "title": "企业版", "items": [{ "label": "团队", "desc": "支持多人协作" }, { "label": "服务", "desc": "专属技术支持" }] } }
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
