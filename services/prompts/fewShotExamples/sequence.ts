import { CategoryExamples } from './types';

export const SEQUENCE_EXAMPLES: CategoryExamples = {
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
    },
    {
      "type": "Ascending Steps (阶梯上升步骤)",
      "example_id": "sequence-ascending-steps",
      "syntax": "infographic sequence-ascending-steps\\ndata\\n  title 成长阶梯\\n  items\\n    - label 入门\\n      desc 掌握基础知识\\n    - label 熟练\\n      desc 独立完成工作\\n    - label 精通\\n      desc 解决复杂问题\\n    - label 专家\\n      desc 引领行业发展",
      "data": { "title": "成长阶梯", "items": [{ "label": "入门", "desc": "掌握基础知识" }, { "label": "熟练", "desc": "独立完成工作" }, { "label": "精通", "desc": "解决复杂问题" }, { "label": "专家", "desc": "引领行业发展" }] }
    },
    {
      "type": "Snake Steps (蛇形步骤)",
      "example_id": "sequence-snake-steps",
      "syntax": "infographic sequence-snake-steps\\ndata\\n  title 工作流程\\n  items\\n    - label 提交\\n      desc 提交工单\\n    - label 审核\\n      desc 主管审核\\n    - label 处理\\n      desc 技术处理\\n    - label 验收\\n      desc 结果验收",
      "data": { "title": "工作流程", "items": [{ "label": "提交", "desc": "提交工单" }, { "label": "审核", "desc": "主管审核" }, { "label": "处理", "desc": "技术处理" }, { "label": "验收", "desc": "结果验收" }] }
    },
    {
      "type": "Horizontal Zigzag Underline (水平锯齿下划线)",
      "example_id": "sequence-horizontal-zigzag-underline-text",
      "syntax": "infographic sequence-horizontal-zigzag-underline-text\\ndata\\n  title 迭代流程\\n  items\\n    - label 需求\\n      desc 明确产品需求\\n    - label 设计\\n      desc UI/UX设计\\n    - label 开发\\n      desc 前后端开发\\n    - label 上线\\n      desc 部署发布",
      "data": { "title": "迭代流程", "items": [{ "label": "需求", "desc": "明确产品需求" }, { "label": "设计", "desc": "UI/UX设计" }, { "label": "开发", "desc": "前后端开发" }, { "label": "上线", "desc": "部署发布" }] }
    }
  ]
};
