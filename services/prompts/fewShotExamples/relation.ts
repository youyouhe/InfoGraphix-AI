/**
 * Relation Few-Shot Examples
 * Based on custom enhanced relation components
 *
 * Component Types:
 * - RelationCircle: Central node with surrounding relations
 * - RelationCircularProgress: Central node with circular progress indicators
 */

import { CategoryExamples } from './types';

export const RELATION_EXAMPLES: CategoryExamples = {
  "category": "Relation (关系图)",
  "sub_categories": [
    // ============================================
    // RELATION CIRCLE WITH ICON BADGE
    // ============================================
    {
      "type": "Relation Circle - Icon Badge (关系圆环-图标徽章)",
      "example_id": "relation-circle-icon-badge",
      "syntax": "infographic relation-circle-icon-badge\\ndata\\n  title 技术生态\\n  center React\\n  relations\\n    - label 状态管理\\n      desc Redux, Zustand\\n      icon mdi/database\\n    - label 路由\\n      desc React Router\\n      icon mdi/route\\n    - label UI组件\\n      desc Material-UI\\n      icon mdi/palette\\n    - label 构建工具\\n      desc Vite\\n      icon mdi/hammer",
      "data": { "title": "技术生态", "center": "React", "relations": [{ "label": "状态管理", "desc": "Redux, Zustand" }, { "label": "路由", "desc": "React Router" }, { "label": "UI组件", "desc": "Material-UI" }, { "label": "构建工具", "desc": "Vite" }] }
    },

    // ============================================
    // RELATION CIRCLE WITH CIRCULAR PROGRESS
    // ============================================
    {
      "type": "Relation Circle - Circular Progress (关系圆环-圆环进度)",
      "example_id": "relation-circle-circular-progress",
      "syntax": "infographic relation-circle-circular-progress\\ndata\\n  title 技能评估\\n  center 前端开发\\n  relations\\n    - label JavaScript\\n      value 90\\n      desc 核心语言\\n    - label TypeScript\\n      value 85\\n      desc 类型安全\\n    - label React\\n      value 80\\n      desc 框架掌握\\n    - label CSS\\n      value 75\\n      desc 样式设计",
      "data": { "title": "技能评估", "center": "前端开发", "relations": [{ "label": "JavaScript", "value": 90, "desc": "核心语言" }, { "label": "TypeScript", "value": 85, "desc": "类型安全" }, { "label": "React", "value": 80, "desc": "框架掌握" }, { "label": "CSS", "value": 75, "desc": "样式设计" }] }
    }
  ]
};
