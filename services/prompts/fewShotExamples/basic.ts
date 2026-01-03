/**
 * Basic Few-Shot Examples
 * Based on simple text, stat, and process components
 */

import { CategoryExamples } from './types';

export const BASIC_EXAMPLES: CategoryExamples = {
  "category": "Basic (基础类型)",
  "sub_categories": [
    {
      "type": "Text (文本内容)",
      "example_id": "text",
      "syntax": "infographic text\\ndata\\n  title 介绍\\n  content 这是一段示例文本，用于展示文本类型的可视化效果。可以包含多行内容，支持富文本格式。",
      "data": { "title": "介绍", "content": "这是一段示例文本，用于展示文本类型的可视化效果。可以包含多行内容，支持富文本格式。" }
    },
    {
      "type": "Stat Highlight (关键指标)",
      "example_id": "stat_highlight",
      "syntax": "infographic stat-highlight\\ndata\\n  title 关键指标\\n  statValue 12847\\n  statLabel 总用户数\\n  statTrend up",
      "data": { "title": "关键指标", "statValue": 12847, "statLabel": "总用户数", "statTrend": "up" }
    },
    {
      "type": "Process Flow (流程图)",
      "example_id": "process_flow",
      "syntax": "infographic process-flow\\ndata\\n  title 开发流程\\n  steps\\n    - step 1\\n      title 需求分析\\n      description 理解用户需求\\n    - step 2\\n      title 方案设计\\n      description 制定技术方案\\n    - step 3\\n      title 开发实现\\n      description 编码开发功能\\n    - step 4\\n      title 测试上线\\n      description 测试并部署",
      "data": { "title": "开发流程", "steps": [{ "step": "1", "title": "需求分析", "description": "理解用户需求" }, { "step": "2", "title": "方案设计", "description": "制定技术方案" }, { "step": "3", "title": "开发实现", "description": "编码开发功能" }, { "step": "4", "title": "测试上线", "description": "测试并部署" }] }
    }
  ]
};
