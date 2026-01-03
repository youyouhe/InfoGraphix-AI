/**
 * VisualTypesGallery - Display all registered visualization types by category
 * Used for testing, validation, and documentation
 */

import React, { useState, useMemo } from 'react';
import { sectionRegistry } from '../services/registry/sectionRegistry';
import { InfographicSection } from '../types';

interface CategoryGroup {
  category: string;
  types: Array<{
    type: string;
    displayName: string;
    requiredFields: string[];
    optionalFields: string[];
    forbiddenFields: string[];
  }>;
}

// Mock data for different visualization types
const MOCK_DATA: Record<string, any> = {
  // Chart types
  'bar-simple': {
    title: '季度销售额',
    data: [
      { name: 'Q1', value: 120 },
      { name: 'Q2', value: 180 },
      { name: 'Q3', value: 150 },
      { name: 'Q4', value: 200 },
    ],
  },
  'bar-stacked': {
    title: '产品销售构成',
    data: [
      { name: '一月', 产品A: 30, 产品B: 20, 产品C: 15 },
      { name: '二月', 产品A: 35, 产品B: 25, 产品C: 20 },
      { name: '三月', 产品A: 40, 产品B: 30, 产品C: 25 },
    ],
  },
  'bar-horizontal': {
    title: '城市人口对比',
    data: [
      { name: '北京', value: 2154 },
      { name: '上海', value: 2424 },
      { name: '广州', value: 1530 },
      { name: '深圳', value: 1756 },
    ],
  },
  'bar-percent': {
    title: '市场份额占比',
    data: [
      { name: 'Q1', 产品A: 30, 产品B: 45, 产品C: 25 },
      { name: 'Q2', 产品A: 35, 产品B: 40, 产品C: 25 },
    ],
  },
  'bar-rounded': {
    title: '月度活跃用户',
    data: [
      { name: '1月', value: 1200 },
      { name: '2月', value: 1500 },
      { name: '3月', value: 1800 },
      { name: '4月', value: 2100 },
    ],
  },

  'pie-simple': {
    title: '产品销售占比',
    data: [
      { name: '产品A', value: 400 },
      { name: '产品B', value: 300 },
      { name: '产品C', value: 200 },
      { name: '产品D', value: 100 },
    ],
  },
  'pie-donut': {
    title: '收入来源',
    data: [
      { name: '产品销售', value: 500 },
      { name: '服务收入', value: 300 },
      { name: '广告收入', value: 150 },
      { name: '其他', value: 50 },
    ],
  },
  'pie-interactive': {
    title: '用户分布',
    data: [
      { name: '新用户', value: 350 },
      { name: '活跃用户', value: 450 },
      { name: '回流用户', value: 200 },
    ],
  },
  'pie-label': {
    title: '支出分类',
    data: [
      { name: '餐饮', value: 1500 },
      { name: '交通', value: 800 },
      { name: '娱乐', value: 600 },
      { name: '购物', value: 1200 },
      { name: '其他', value: 400 },
    ],
  },
  'pie-rose': {
    title: '技能分布',
    data: [
      { name: 'JavaScript', value: 90 },
      { name: 'Python', value: 75 },
      { name: 'Java', value: 60 },
      { name: 'Go', value: 45 },
    ],
  },

  'line-simple': {
    title: '月度收入趋势',
    data: [
      { name: '1月', value: 120 },
      { name: '2月', value: 150 },
      { name: '3月', value: 180 },
      { name: '4月', value: 200 },
      { name: '5月', value: 220 },
    ],
  },
  'line-smooth': {
    title: '用户增长曲线',
    data: [
      { name: '周一', value: 120 },
      { name: '周二', value: 150 },
      { name: '周三', value: 180 },
      { name: '周四', value: 210 },
      { name: '周五', value: 250 },
    ],
  },
  'line-multi-series': {
    title: '多产品销售对比',
    data: [
      { name: 'Q1', 产品A: 100, 产品B: 120 },
      { name: 'Q2', 产品A: 120, 产品B: 150 },
      { name: 'Q3', 产品A: 140, 产品B: 170 },
      { name: 'Q4', 产品A: 160, 产品B: 190 },
    ],
  },
  'line-step': {
    title: '服务器状态',
    data: [
      { name: '00:00', value: 20 },
      { name: '04:00', value: 25 },
      { name: '08:00', value: 60 },
      { name: '12:00', value: 80 },
      { name: '16:00', value: 70 },
    ],
  },
  'line-dashed': {
    title: '预测趋势',
    data: [
      { name: '1月', value: 100 },
      { name: '2月', value: 120 },
      { name: '3月', value: 140 },
      { name: '4月', value: 160 },
      { name: '5月', value: 180 },
    ],
  },

  'area-simple': {
    title: '累计用户数',
    data: [
      { name: '1月', value: 1000 },
      { name: '2月', value: 1500 },
      { name: '3月', value: 2200 },
      { name: '4月', value: 3000 },
    ],
  },
  'area-stacked': {
    title: '产品线收入',
    data: [
      { name: 'Q1', 线上: 50, 线下: 30 },
      { name: 'Q2', 线上: 60, 线下: 35 },
      { name: 'Q3', 线上: 70, 线下: 40 },
    ],
  },
  'area-percent': {
    title: '市场份额变化',
    data: [
      { name: '2020', A公司: 40, B公司: 35, C公司: 25 },
      { name: '2021', A公司: 42, B公司: 33, C公司: 25 },
    ],
  },
  'area-gradient': {
    title: '流量趋势',
    data: [
      { name: '周一', value: 1200 },
      { name: '周二', value: 1500 },
      { name: '周三', value: 1800 },
      { name: '周四', value: 2100 },
    ],
  },

  'radar-simple': {
    title: '能力评估',
    data: [
      { label: '技术', value: 85 },
      { label: '沟通', value: 75 },
      { label: '领导力', value: 80 },
      { label: '创新', value: 70 },
      { label: '执行力', value: 90 },
    ],
  },
  'radar-filled': {
    title: '产品特性对比',
    data: [
      { label: '性能', value: 85 },
      { label: '易用性', value: 70 },
      { label: '价格', value: 75 },
      { label: '功能', value: 90 },
      { label: '支持', value: 80 },
    ],
  },
  'radar-comparison': {
    title: '多维度对比',
    data: [
      { label: '维度1', A产品: 80, B产品: 70 },
      { label: '维度2', A产品: 75, B产品: 85 },
      { label: '维度3', A产品: 90, B产品: 80 },
      { label: '维度4', A产品: 70, B产品: 75 },
    ],
  },

  'scatter-simple': {
    title: '散点分布',
    data: [
      { x: 10, y: 20 },
      { x: 30, y: 40 },
      { x: 50, y: 60 },
      { x: 70, y: 80 },
      { x: 90, y: 50 },
    ],
  },
  'scatter-bubble': {
    title: '气泡图',
    data: [
      { x: 10, y: 20, z: 100 },
      { x: 30, y: 40, z: 200 },
      { x: 50, y: 60, z: 150 },
      { x: 70, y: 50, z: 180 },
    ],
  },
  'scatter-shape': {
    title: '形状散点',
    data: [
      { x: 10, y: 20, shape: 'circle' },
      { x: 30, y: 40, shape: 'triangle' },
      { x: 50, y: 60, shape: 'diamond' },
      { x: 70, y: 80, shape: 'square' },
    ],
  },
  'scatter-multi-series': {
    title: '多系列散点',
    data: [
      { x: 10, y: 20, series: 'A' },
      { x: 30, y: 40, series: 'A' },
      { x: 50, y: 60, series: 'B' },
      { x: 70, y: 80, series: 'B' },
    ],
  },

  'radial-bar-simple': {
    title: '进度展示',
    data: [
      { label: '任务A', value: 75 },
      { label: '任务B', value: 60 },
      { label: '任务C', value: 90 },
      { label: '任务D', value: 45 },
    ],
  },
  'radial-bar-gauge': {
    title: 'KPI指标',
    data: [
      { label: '销售额', value: 85 },
      { label: '客户数', value: 70 },
      { label: '满意度', value: 92 },
    ],
  },
  'radial-bar-stacked': {
    title: '多维指标',
    data: [
      { label: '目标达成', value: 85 },
      { label: '客户增长', value: 70 },
      { label: '市场拓展', value: 92 },
      { label: '研发进度', value: 78 },
    ],
  },

  // Comparison types
  'compare-pros-cons': {
    title: '方案评估',
    pros: [
      { label: '成本低', desc: '无需额外投入' },
      { label: '实施快', desc: '2-3周上线' },
    ],
    cons: [
      { label: '功能有限', desc: '不支持高级功能' },
      { label: '扩展性差', desc: '难以集成' },
    ],
  },
  'compare-score-card': {
    title: '产品评分',
    items: [
      { label: '易用性', leftScore: 4, rightScore: 3 },
      { label: '性能', leftScore: 5, rightScore: 4 },
    ],
  },
  'compare-triple': {
    title: '云服务商对比',
    items: [
      { label: '价格', optionA: '$99', optionB: '$149', optionC: '$199' },
      { label: '存储', optionA: '100GB', optionB: '500GB', optionC: '1TB' },
    ],
  },
  'compare-feature-table': {
    title: '功能对比',
    features: [
      { label: 'AI助手', icon: 'sparkles', optionA: true, optionB: true, optionC: false },
      { label: '导出', icon: 'download', optionA: 'PDF', optionB: 'PDF', optionC: 'Multiple' },
    ],
  },
  'compare-timeline': {
    title: '版本对比',
    items: [
      { label: 'v1.0', before: '基础功能', after: '基础+UI', change: 'improvement' },
      { label: 'v2.0', before: '基础+UI', after: '新增分析', change: 'improvement' },
    ],
  },
  'compare-metric-gauge': {
    title: 'KPI对比',
    metrics: [
      { label: '营收目标', optionA: 85, optionB: 92 },
      { label: '用户增长', optionA: 70, optionB: 88 },
    ],
  },
  'compare-card-stack': {
    title: '技术栈',
    stacks: [
      {
        label: '前端',
        title: '用户界面层',
        items: [
          { label: 'React', value: '组件化' },
          { label: 'Vue', value: '响应式' },
        ],
      },
      {
        label: '后端',
        title: '业务逻辑层',
        items: [
          { label: 'Node.js', value: '高性能' },
          { label: 'Python', value: '数据处理' },
        ],
      },
    ],
  },
  'compare-swot': {
    title: 'SWOT分析',
    desc: '战略分析工具',
    items: [
      { label: 'Strengths', content: '技术领先、供应链完善' },
      { label: 'Weaknesses', content: '品牌曝光不足' },
      { label: 'Opportunities', content: '数字化转型加速' },
      { label: 'Threats', content: '竞争激烈' },
    ],
  },
  'compare-binary-fold': {
    title: '优劣势对比',
    left: {
      title: '优势',
      items: [
        { label: '技术强', desc: '自主研发' },
        { label: '用户多', desc: '市场占有率高' },
      ],
    },
    right: {
      title: '劣势',
      items: [
        { label: '成本高', desc: '运营支出大' },
        { label: '更新慢', desc: '迭代周期长' },
      ],
    },
  },
  'compare-binary-horizontal-underline-text-vs': {
    title: '方案对比',
    left: {
      title: '方案A',
      items: [
        { label: '成本低', desc: '初期投入少' },
        { label: '上手快', desc: '无需培训' },
      ],
    },
    right: {
      title: '方案B',
      items: [
        { label: '功能强', desc: '支持高级特性' },
        { label: '扩展好', desc: '易于集成' },
      ],
    },
  },
  'compare-binary-horizontal-badge-card-vs': {
    title: '产品对比',
    left: {
      title: '基础版',
      items: [
        { label: '免费', desc: '永久免费使用' },
        { label: '基础功能', desc: '满足日常需求' },
      ],
    },
    right: {
      title: '专业版',
      items: [
        { label: '高级功能', desc: 'AI智能分析' },
        { label: '优先支持', desc: '24小时响应' },
      ],
    },
  },
  'compare-binary-horizontal-compact-card-vs': {
    title: '架构对比',
    left: {
      title: '单体架构',
      items: [
        { label: '简单', desc: '易于开发和部署' },
        { label: '性能', desc: '低延迟无网络调用' },
      ],
    },
    right: {
      title: '微服务',
      items: [
        { label: '可扩展', desc: '独立部署和扩展' },
        { label: '容错性', desc: '服务隔离故障隔离' },
      ],
    },
  },
  'compare-binary-horizontal-compact-card-arrow': {
    title: '开发模式',
    left: {
      title: '敏捷开发',
      items: [
        { label: '快速', desc: '短周期迭代' },
        { label: '灵活', desc: '快速响应变化' },
      ],
    },
    right: {
      title: '瀑布开发',
      items: [
        { label: '稳定', desc: '需求明确可控' },
        { label: '规范', desc: '文档完整齐全' },
      ],
    },
  },
  'compare-binary-horizontal-simple-fold': {
    title: '技术选型',
    left: {
      title: 'React',
      items: [
        { label: '生态', desc: '组件库丰富' },
        { label: '灵活', desc: '虚拟DOM高效' },
      ],
    },
    right: {
      title: 'Vue',
      items: [
        { label: '简单', desc: '学习曲线平缓' },
        { label: '完整', desc: '官方全家桶' },
      ],
    },
  },
  'compare-binary-horizontal-underline-text-arrow': {
    title: '部署方式',
    left: {
      title: '容器化',
      items: [
        { label: '环境一致', desc: '消除环境差异' },
        { label: '快速部署', desc: '秒级启动' },
      ],
    },
    right: {
      title: '传统部署',
      items: [
        { label: '稳定', desc: '成熟可靠' },
        { label: '简单', desc: '运维成本低' },
      ],
    },
  },
  'compare-binary-horizontal-underline-text-fold': {
    title: '数据库对比',
    left: {
      title: 'MySQL',
      items: [
        { label: '开源', desc: '免费使用' },
        { label: '成熟', desc: '社区活跃' },
      ],
    },
    right: {
      title: 'PostgreSQL',
      items: [
        { label: '功能', desc: '支持更多特性' },
        { label: '标准', desc: 'SQL标准更完整' },
      ],
    },
  },
  'compare-hierarchy-left-right-circle-node-pill-badge': {
    title: '组织架构',
    left: {
      title: '总部',
      items: [
        { label: '管理层', desc: '战略决策' },
        { label: '职能部门', desc: 'HR、财务、IT' },
      ],
    },
    right: {
      title: '分公司',
      items: [
        { label: '业务团队', desc: '销售、实施' },
        { label: '本地支持', desc: '客户服务' },
      ],
    },
  },
  'compare-hierarchy-left-right-circle-node-plain-text': {
    title: '系统分层',
    left: {
      title: '前端',
      items: [
        { label: '展示层', desc: '用户界面' },
        { label: '交互', desc: '响应操作' },
      ],
    },
    right: {
      title: '后端',
      items: [
        { label: '业务逻辑', desc: '数据处理' },
        { label: '存储', desc: '数据持久化' },
      ],
    },
  },
  'compare-hierarchy-row-letter-card-compact-card': {
    title: '产品定位',
    left: {
      title: '免费版',
      items: [
        { label: '个人', desc: '适合个人使用' },
        { label: '限制', desc: '功能受限' },
      ],
    },
    right: {
      title: '企业版',
      items: [
        { label: '团队', desc: '支持多人协作' },
        { label: '服务', desc: '专属技术支持' },
      ],
    },
  },
  'comparison': {
    title: '产品对比',
    comparisonItems: [
      { label: '价格', left: '$99', right: '$149' },
      { label: '存储', left: '100GB', right: '500GB' },
      { label: '支持', left: '邮件', right: '24/7' },
      { label: '功能', left: '基础', right: '高级' },
    ],
  },

  // Sequence types
  'sequence-timeline-simple': {
    title: '项目里程碑',
    items: [
      { label: '启动', desc: '2024年1月 - 项目启动' },
      { label: '开发', desc: '2024年3月 - 核心开发' },
      { label: '测试', desc: '2024年5月 - 测试验收' },
      { label: '发布', desc: '2024年6月 - 正式发布' },
    ],
  },
  'sequence-zigzag-steps-underline-text': {
    title: '实施步骤',
    items: [
      { label: '需求分析', desc: '收集用户需求' },
      { label: '系统设计', desc: '架构设计' },
      { label: '开发实施', desc: '编码实现' },
    ],
  },
  'sequence-circular-simple': {
    title: '循环流程',
    items: [
      { label: '计划', desc: '制定计划' },
      { label: '执行', desc: '实施行动' },
      { label: '检查', desc: '评估结果' },
      { label: '改进', desc: '优化提升' },
    ],
  },
  'sequence-roadmap-vertical-simple': {
    title: '产品路线图',
    items: [
      { label: 'Q1 基础功能', desc: '完成核心功能开发' },
      { label: 'Q2 增强功能', desc: '添加高级特性' },
      { label: 'Q3 性能优化', desc: '系统性能调优' },
    ],
  },
  'sequence-ascending-steps': {
    title: '成长阶梯',
    items: [
      { label: '入门', desc: '掌握基础知识' },
      { label: '熟练', desc: '独立完成工作' },
      { label: '精通', desc: '解决复杂问题' },
      { label: '专家', desc: '引领行业发展' },
    ],
  },
  'sequence-horizontal-zigzag-underline-text': {
    title: '迭代流程',
    items: [
      { label: '需求', desc: '明确产品需求' },
      { label: '设计', desc: 'UI/UX设计' },
      { label: '开发', desc: '前后端开发' },
      { label: '上线', desc: '部署发布' },
    ],
  },
  'sequence-snake-steps': {
    title: '工作流程',
    items: [
      { label: '提交', desc: '提交工单' },
      { label: '审核', desc: '主管审核' },
      { label: '处理', desc: '技术处理' },
      { label: '验收', desc: '结果验收' },
    ],
  },

  // List types
  'list-grid-badge-card': {
    title: '功能特性',
    items: [
      { label: '快速', desc: '秒级响应' },
      { label: '安全', desc: '端到端加密' },
      { label: '可靠', desc: '99.9%可用性' },
      { label: '易用', desc: '直观界面' },
    ],
  },
  'list-row-horizontal-icon-arrow': {
    title: '服务列表',
    items: [
      { label: '云服务', desc: '弹性计算', icon: 'cloud' },
      { label: '数据库', desc: '高性能存储', icon: 'database' },
      { label: 'AI服务', desc: '智能分析', icon: 'brain' },
    ],
  },
  'list-column-done-list': {
    title: '任务清单',
    items: [
      { label: '需求确认', done: true },
      { label: '原型设计', done: true },
      { label: '开发实施', done: false },
      { label: '测试验收', done: false },
    ],
  },

  // Grid variants
  'list-grid-candy-card-lite': {
    title: '产品亮点',
    items: [
      { label: '智能推荐', desc: 'AI驱动个性化' },
      { label: '实时同步', desc: '多端数据一致' },
      { label: '云端备份', desc: '安全可靠存储' },
      { label: '团队协作', desc: '高效沟通工具' },
    ],
  },

  'list-grid-circular-progress': {
    title: '技能掌握度',
    items: [
      { label: 'JavaScript', value: 90 },
      { label: 'React', value: 85 },
      { label: 'Node.js', value: 75 },
      { label: 'Python', value: 70 },
    ],
  },

  'list-grid-ribbon-card': {
    title: '核心优势',
    items: [
      { label: '高性能', desc: '毫秒级响应' },
      { label: '易扩展', desc: '模块化架构' },
      { label: '高可用', desc: '99.99% SLA' },
      { label: '低门槛', desc: '快速上手' },
    ],
  },

  // Row variants
  'list-row-horizontal-icon-line': {
    title: '开发流程',
    items: [
      { label: '需求分析', desc: '理解用户需求' },
      { label: '方案设计', desc: '制定技术方案' },
      { label: '代码开发', desc: '编写高质量代码' },
      { label: '测试部署', desc: '确保稳定上线' },
    ],
  },

  'list-row-circular-progress': {
    title: '学习进度',
    items: [
      { label: 'HTML/CSS', value: 95 },
      { label: 'JavaScript', value: 80 },
      { label: 'React框架', value: 70 },
      { label: '后端开发', value: 60 },
    ],
  },

  // Column variants
  'list-column-vertical-icon-arrow': {
    title: '架构层次',
    items: [
      { label: '表现层', desc: '用户界面' },
      { label: '业务层', desc: '逻辑处理' },
      { label: '数据层', desc: '数据存储' },
      { label: '基础设施', desc: '服务器网络' },
    ],
  },

  'list-column-simple-vertical-arrow': {
    title: '晋升路径',
    items: [
      { label: '初级工程师' },
      { label: '中级工程师' },
      { label: '高级工程师' },
      { label: '技术专家' },
    ],
  },

  // Sector variants
  'list-sector-plain-text': {
    title: '时间分配',
    items: [
      { label: '工作', value: 8 },
      { label: '睡眠', value: 7 },
      { label: '学习', value: 3 },
      { label: '娱乐', value: 3 },
      { label: '运动', value: 2 },
      { label: '其他', value: 1 },
    ],
  },

  'list-sector-half-plain-text': {
    title: '预算分配',
    items: [
      { label: '房租', value: 30 },
      { label: '餐饮', value: 20 },
      { label: '交通', value: 15 },
      { label: '购物', value: 15 },
      { label: '娱乐', value: 10 },
      { label: '储蓄', value: 10 },
    ],
  },

  // Pyramid variants
  'list-pyramid-badge-card': {
    title: '用户分层',
    items: [
      { label: 'VIP用户', desc: '最高优先级' },
      { label: '高价值用户', desc: '重点服务' },
      { label: '普通用户', desc: '常规支持' },
      { label: '潜在用户', desc: '待转化' },
    ],
  },

  'list-pyramid-compact-card': {
    title: '优先级排序',
    items: [
      { label: 'P0 紧急重要' },
      { label: 'P1 重要不紧急' },
      { label: 'P2 紧急不重要' },
      { label: 'P3 不紧急不重要' },
    ],
  },

  // Zigzag variants
  'list-zigzag-down': {
    title: '发展历程',
    items: [
      { label: '初创期', desc: '2020年成立' },
      { label: '成长期', desc: '用户突破百万' },
      { label: '扩张期', desc: '进军海外市场' },
      { label: '成熟期', desc: '行业领导者' },
    ],
  },

  'list-zigzag-down-compact-card': {
    title: '技术演进',
    items: [
      { label: 'Web 1.0', desc: '静态网页时代' },
      { label: 'Web 2.0', desc: '社交互动时代' },
      { label: 'Web 3.0', desc: '去中心化时代' },
      { label: 'Web 4.0', desc: '智能互联时代' },
    ],
  },

  'list-zigzag-up': {
    title: '攀登阶梯',
    items: [
      { label: '第一步', desc: '确立目标' },
      { label: '第二步', desc: '制定计划' },
      { label: '第三步', desc: '执行行动' },
      { label: '第四步', desc: '达成成功' },
    ],
  },

  'list-zigzag-up-compact-card': {
    title: '能力进阶',
    items: [
      { label: '入门', desc: '掌握基础知识' },
      { label: '熟练', desc: '独立完成工作' },
      { label: '精通', desc: '解决复杂问题' },
      { label: '专家', desc: '引领行业发展' },
    ],
  },

  // Hierarchy types
  'hierarchy-tree-tech-style-capsule-item': {
    title: '组织架构',
    data: {
      label: 'CEO',
      children: [
        {
          label: 'CTO',
          children: [
            { label: '前端团队' },
            { label: '后端团队' },
          ],
        },
        {
          label: 'CFO',
          children: [
            { label: '财务部' },
            { label: '会计部' },
          ],
        },
      ],
    },
  },

  // Tech style variants
  'hierarchy-tree-tech-style-badge-card': {
    title: '技术栈',
    data: {
      label: '前端技术',
      children: [
        { label: '框架', children: [{ label: 'React' }, { label: 'Vue' }] },
        { label: '构建', children: [{ label: 'Vite' }, { label: 'Webpack' }] },
        { label: '样式', children: [{ label: 'Tailwind' }, { label: 'CSS' }] },
      ],
    },
  },

  // Curved line variants
  'hierarchy-tree-curved-line-rounded-rect-node': {
    title: '产品分类',
    data: {
      label: '全部产品',
      children: [
        {
          label: '电子产品',
          children: [
            { label: '手机' },
            { label: '电脑' },
            { label: '平板' },
          ],
        },
        {
          label: '家居用品',
          children: [
            { label: '家具' },
            { label: '装饰' },
          ],
        },
      ],
    },
  },

  // Bottom-Top variants
  'hierarchy-tree-bt-curved-line-badge-card': {
    title: '基础架构',
    data: {
      label: '应用层',
      children: [
        {
          label: '服务层',
          children: [
            { label: 'API网关' },
            { label: '微服务' },
          ],
        },
        {
          label: '数据层',
          children: [
            { label: '数据库' },
            { label: '缓存' },
          ],
        },
        { label: '基础设施层' },
      ],
    },
  },

  'hierarchy-tree-bt-curved-line-compact-card': {
    title: '知识体系',
    data: {
      label: '高级知识',
      children: [
        {
          label: '中级知识',
          children: [
            { label: '基础知识' },
            { label: '入门概念' },
          ],
        },
        { label: '专家知识' },
      ],
    },
  },

  'hierarchy-tree-bt-curved-line-ribbon-card': {
    title: '等级体系',
    data: {
      label: '钻石会员',
      children: [
        {
          label: '黄金会员',
          children: [
            { label: '白银会员' },
            { label: '青铜会员' },
          ],
        },
        { label: '至尊会员' },
      ],
    },
  },

  'hierarchy-tree-bt-curved-line-rounded-rect-node': {
    title: '文件系统',
    data: {
      label: '根目录',
      children: [
        {
          label: '用户目录',
          children: [
            { label: '文档' },
            { label: '图片' },
          ],
        },
        { label: '系统目录' },
      ],
    },
  },

  // Left-Right variant
  'hierarchy-tree-lr-curved-line-badge-card': {
    title: '业务流程',
    data: {
      label: '开始',
      children: [
        {
          label: '审批',
          children: [
            { label: '部门审批' },
            { label: '财务审批' },
          ],
        },
        { label: '执行' },
        { label: '完成' },
      ],
    },
  },

  // Right-Left variant
  'hierarchy-tree-rl-distributed-origin-rounded-rect-node': {
    title: '逆向溯源',
    data: {
      label: '问题',
      children: [
        {
          label: '直接原因',
          children: [
            { label: '操作失误' },
            { label: '系统故障' },
          ],
        },
        {
          label: '根本原因',
          children: [
            { label: '流程缺陷' },
            { label: '培训不足' },
          ],
        },
      ],
    },
  },

  // Mindmap variants
  'hierarchy-mindmap-branch-gradient-capsule-item': {
    title: '核心主题',
    data: {
      label: '中心思想',
      children: [
        {
          label: '分支A',
          children: [
            { label: '子项A1' },
            { label: '子项A2' },
          ],
        },
        {
          label: '分支B',
          children: [
            { label: '子项B1' },
            { label: '子项B2' },
          ],
        },
        {
          label: '分支C',
          children: [
            { label: '子项C1' },
          ],
        },
      ],
    },
  },

  'hierarchy-mindmap-branch-gradient-circle-progress': {
    title: '目标规划',
    data: {
      label: '年度目标',
      children: [
        {
          label: '季度目标',
          children: [
            { label: '月度任务' },
            { label: '周计划' },
          ],
        },
        {
          label: '学习成长',
          children: [
            { label: '技能提升' },
            { label: '证书获取' },
          ],
        },
      ],
    },
  },

  'hierarchy-mindmap-branch-gradient-compact-card': {
    title: '项目拆解',
    data: {
      label: '项目启动',
      children: [
        {
          label: '需求阶段',
          children: [
            { label: '用户调研' },
            { label: '需求文档' },
          ],
        },
        {
          label: '设计阶段',
          children: [
            { label: '原型设计' },
            { label: 'UI设计' },
          ],
        },
        {
          label: '开发阶段' },
      ],
    },
  },

  // Quadrant types
  'quadrant-quarter-simple-card': {
    title: '优先级矩阵',
    data: {
      items: [
        { label: '重要紧急', desc: '紧急Bug\n核心功能' },
        { label: '重要不紧急', desc: '架构优化\n技术文档' },
        { label: '不重要紧急', desc: '例行会议\n邮件处理' },
        { label: '不重要不紧急', desc: '社交媒体\n休息茶歇' },
      ],
    },
  },

  'quadrant-quarter-circular': {
    title: '能力分析',
    data: {
      items: [
        { label: '优势', desc: '专业技能\n丰富经验' },
        { label: '机会', desc: '市场需求\n行业趋势' },
        { label: '劣势', desc: '知识盲区\n资源限制' },
        { label: '威胁', desc: '竞争压力\n技术变革' },
      ],
    },
  },

  'quadrant-simple-illus': {
    title: '产品定位',
    data: {
      items: [
        { label: '🎯 目标用户', desc: '18-35岁\n都市白领' },
        { label: '💡 核心价值', desc: '提高效率\n节省时间' },
        { label: '🔧 产品特色', desc: '智能推荐\n一键同步' },
        { label: '🏆 竞争优势', desc: '价格优惠\n服务优质' },
      ],
    },
  },

  // Other types
  text: {
    title: '介绍',
    content: '这是一段示例文本，用于展示文本类型的可视化效果。可以包含多行内容，支持富文本格式。',
  },
  'stat_highlight': {
    title: '关键指标',
    statValue: '98.5%',
    statLabel: '客户满意度',
    statTrend: 'up',
    content: '较上期上升 5%',
  },

  // Legacy chart types (mapped to ChartSection)
  'bar_chart': {
    title: '月度销售额',
    data: [
      { name: '1月', value: 120 },
      { name: '2月', value: 150 },
      { name: '3月', value: 180 },
      { name: '4月', value: 200 },
    ],
  },
  'pie_chart': {
    title: '产品销售占比',
    data: [
      { name: '产品A', value: 400 },
      { name: '产品B', value: 300 },
      { name: '产品C', value: 200 },
      { name: '产品D', value: 100 },
    ],
  },
  'chart-bar-plain-text': {
    title: '销售统计',
    data: [
      { name: 'Q1', value: 120 },
      { name: 'Q2', value: 150 },
      { name: 'Q3', value: 180 },
      { name: 'Q4', value: 200 },
    ],
  },
  'chart-line-plain-text': {
    title: '收入趋势',
    data: [
      { name: '1月', value: 100 },
      { name: '2月', value: 120 },
      { name: '3月', value: 140 },
      { name: '4月', value: 160 },
      { name: '5月', value: 180 },
    ],
  },
  'chart-pie-plain-text': {
    title: '市场份额',
    data: [
      { name: '公司A', value: 35 },
      { name: '公司B', value: 25 },
      { name: '公司C', value: 20 },
      { name: '其他', value: 20 },
    ],
  },
  'chart-wordcloud': {
    title: '关键词',
    data: [
      { name: 'AI', value: 50 },
      { name: 'React', value: 40 },
      { name: 'Vue', value: 35 },
      { name: 'Python', value: 30 },
      { name: 'JavaScript', value: 45 },
    ],
  },

  // Process flow
  'process_flow': {
    title: '开发流程',
    steps: [
      { step: '1', title: '需求分析', description: '理解用户需求' },
      { step: '2', title: '方案设计', description: '制定技术方案' },
      { step: '3', title: '开发实现', description: '编码开发功能' },
      { step: '4', title: '测试上线', description: '测试并部署' },
    ],
  },
};

export const VisualTypesGallery: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Group types by category
  const groupedTypes = useMemo(() => {
    const allTypes = sectionRegistry.getAll();
    const groups = new Map<string, CategoryGroup>();

    allTypes.forEach(typeDef => {
      if (!groups.has(typeDef.category)) {
        groups.set(typeDef.category, {
          category: typeDef.category,
          types: [],
        });
      }
      groups.get(typeDef.category)!.types.push({
        type: typeDef.type,
        displayName: typeDef.displayName,
        requiredFields: typeDef.requiredFields,
        optionalFields: typeDef.optionalFields,
        forbiddenFields: typeDef.forbiddenFields,
      });
    });

    // Sort types within each category
    groups.forEach(group => {
      group.types.sort((a, b) => a.type.localeCompare(b.type));
    });

    return Array.from(groups.values()).sort((a, b) => a.category.localeCompare(b.category));
  }, []);

  // Filter by category and search query
  const filteredGroups = useMemo(() => {
    return groupedTypes
      .map(group => ({
        ...group,
        types: group.types.filter(
          type =>
            (selectedCategory === 'all' || group.category === selectedCategory) &&
            (searchQuery === '' ||
              type.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
              type.displayName.toLowerCase().includes(searchQuery.toLowerCase()))
        ),
      }))
      .filter(group => group.types.length > 0);
  }, [groupedTypes, selectedCategory, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const total = sectionRegistry.getAll().length;
    const byCategory = new Map<string, number>();
    groupedTypes.forEach(group => {
      byCategory.set(group.category, group.types.length);
    });
    return { total, byCategory };
  }, [groupedTypes]);

  // Categories for filter
  const categories = ['all', ...groupedTypes.map(g => g.category).sort()];

  // Render preview component
  const renderPreview = (type: string) => {
    const Component = sectionRegistry.get(type)?.component;
    const mockData = MOCK_DATA[type];

    if (!Component || !mockData) {
      return (
        <div className="h-40 flex items-center justify-center bg-gray-100 dark:bg-zinc-800 rounded-lg">
          <p className="text-sm text-gray-400 dark:text-zinc-600">暂无预览</p>
        </div>
      );
    }

    // Special handling for 'process_flow': uses steps field at section level
    if (type === 'process_flow') {
      const section: InfographicSection = {
        id: 'preview',
        type: type as any,
        title: mockData.title,
        steps: mockData.steps,
      };

      return (
        <div className="min-h-[200px] overflow-auto">
          <Component section={section} isLoading={false} />
        </div>
      );
    }

    // Special handling for stat_highlight: fields are at section level, not in data
    if (type === 'stat_highlight') {
      // Simplified test with hardcoded values
      const section: InfographicSection = {
        id: 'preview',
        type: type as any,
        title: '关键指标',
        statValue: '98.5%',
        statLabel: '客户满意度',
        statTrend: 'up',
        content: '较上期上升 5%',
      };

      console.log('Rendering stat_highlight with section:', section);

      return (
        <div className="min-h-[200px] overflow-auto">
          <Component section={section} isLoading={false} />
        </div>
      );
    }

    // Special handling for 'comparison' type: uses comparisonItems field
    if (type === 'comparison') {
      const section: InfographicSection = {
        id: 'preview',
        type: type as any,
        title: mockData.title,
        comparisonItems: mockData.comparisonItems,
      };

      return (
        <div className="min-h-[200px] overflow-auto">
          <Component section={section} isLoading={false} />
        </div>
      );
    }

    // Special handling for hierarchy types: expects data.items array
    const isHierarchyType = type.startsWith('hierarchy-');
    if (isHierarchyType) {
      // Hierarchy mock data has: { title, data: { label, children } }
      // But component expects: { data: { items: [{ label, children }] } }
      const hierarchyNode = mockData.data; // { label, children }
      const section: InfographicSection = {
        id: 'preview',
        type: type as any,
        title: mockData.title,
        data: {
          items: [hierarchyNode], // Wrap in items array
        },
      };

      return (
        <div className="min-h-[200px] overflow-auto">
          <Component section={section} isLoading={false} />
        </div>
      );
    }

    // Special handling for list types: expects data.items array
    const isListType = type.startsWith('list-');
    if (isListType) {
      // List mock data has: { title, items: [...] }
      // Component expects: { data: { items: [...] } }
      const section: InfographicSection = {
        id: 'preview',
        type: type as any,
        title: mockData.title,
        data: {
          items: mockData.items, // Pass items directly
        },
      };

      return (
        <div className="min-h-[200px] overflow-auto">
          <Component section={section} isLoading={false} />
        </div>
      );
    }

    // Special handling for sequence types: expects data.items array
    const isSequenceType = type.startsWith('sequence-');
    if (isSequenceType) {
      // Sequence mock data has: { title, items: [...] }
      // Component expects: { data: { items: [...] } }
      const section: InfographicSection = {
        id: 'preview',
        type: type as any,
        title: mockData.title,
        data: {
          items: mockData.items, // Pass items directly
        },
      };

      return (
        <div className="min-h-[200px] overflow-auto">
          <Component section={section} isLoading={false} />
        </div>
      );
    }

    // For all other types: extract data payload
    // Comparison types: use entire mockData (it has pros/cons/items/features/etc directly)
    // Chart types: use mockData.data (array of chart items)
    const isComparisonType = type.startsWith('compare-');
    const dataPayload: any = isComparisonType ? mockData : (mockData.data || mockData.items || mockData);

    const section: InfographicSection = {
      id: 'preview',
      type: type as any,
      title: mockData.title || type,
      data: dataPayload,
    };

    return (
      <div className="min-h-[200px] overflow-auto">
        <Component section={section} isLoading={false} />
      </div>
    );
  };

  // Copy to clipboard
  const copyType = (type: string) => {
    navigator.clipboard.writeText(type);
  };

  // Export as JSON
  const exportAsJSON = () => {
    const data = sectionRegistry.getAll().map(t => ({
      type: t.type,
      displayName: t.displayName,
      category: t.category,
      requiredFields: t.requiredFields,
      optionalFields: t.optionalFields,
      forbiddenFields: t.forbiddenFields,
    }));
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'visual-types.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-screen overflow-auto bg-gray-50 dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              可视化效果类型库
            </h1>
            <button
              onClick={exportAsJSON}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              导出 JSON
            </button>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
              <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">总计</p>
              <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">{stats.total}</p>
            </div>
            {Array.from(stats.byCategory.entries()).slice(0, 3).map(([cat, count]) => (
              <div key={cat} className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4">
                <p className="text-xs text-gray-600 dark:text-zinc-400 font-medium">{cat}</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{count}</p>
              </div>
            ))}
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="搜索类型名称或ID..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
            />
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? '全部分类' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Type List with Previews */}
        <div className="space-y-6">
          {filteredGroups.map(group => (
            <div key={group.category} className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm overflow-hidden">
              {/* Category Header */}
              <div className="bg-gray-50 dark:bg-zinc-800 px-6 py-3 border-b border-gray-200 dark:border-zinc-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  {group.category}
                  <span className="text-sm font-normal text-gray-500 dark:text-zinc-400">
                    ({group.types.length} 个类型)
                  </span>
                </h2>
              </div>

              {/* Type Cards with Previews */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {group.types.map(type => (
                    <div
                      key={type.type}
                      className="border border-gray-200 dark:border-zinc-700 rounded-lg overflow-hidden hover:shadow-md transition-all"
                    >
                      {/* Preview */}
                      <div className="bg-gray-50 dark:bg-zinc-800/50 p-3">
                        {renderPreview(type.type)}
                      </div>

                      {/* Info */}
                      <div className="p-3">
                        {/* Type ID */}
                        <div
                          onClick={() => copyType(type.type)}
                          className="cursor-pointer group mb-2"
                          title="点击复制"
                        >
                          <code className="text-xs font-mono bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded text-gray-700 dark:text-zinc-300 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30">
                            {type.type}
                          </code>
                        </div>

                        {/* Display Name */}
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                          {type.displayName}
                        </h3>

                        {/* Fields Summary */}
                        <div className="text-xs text-gray-500 dark:text-zinc-500 space-y-1">
                          {type.requiredFields.length > 0 && (
                            <div className="flex items-center gap-1">
                              <span className="text-red-500">●</span>
                              <span>{type.requiredFields.join(', ')}</span>
                            </div>
                          )}
                          {type.optionalFields.length > 0 && (
                            <div className="flex items-center gap-1">
                              <span className="text-green-500">●</span>
                              <span>{type.optionalFields.slice(0, 2).join(', ')}...</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredGroups.length === 0 && (
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm p-12 text-center">
            <p className="text-gray-500 dark:text-zinc-400">没有找到匹配的可视化类型</p>
          </div>
        )}
      </div>
    </div>
  );
};
