/**
 * Few-shot examples for infographic generation
 * Based on AntV Infographic syntax and patterns
 *
 * This file contains example JSON structures for different infographic
 * visualization types that can be used as few-shot examples for LLMs.
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
  example_id: string;
  syntax: string;
  data: Record<string, unknown>;
}

/**
 * Complete few-shot examples data provided by the user
 * Based on AntV Infographic gallery
 */
export const INFOGRAPHIC_FEW_SHOT_DATA: InfographicGalleryFewShot = {
  "infographic_gallery_few_shot": [
    {
      "category": "Chart (统计图表类)",
      "sub_categories": [
        {
          "type": "Bar (条形图)",
          "example_id": "chart-bar1",
          "syntax": "infographic chart-bar1\\ndata\\n  title 营收排行\\n  items\\n    - label 华东\\n      value 450\\n    - label 华北\\n      value 320",
          "data": { "title": "营收排行", "items": [{ "label": "华东", "value": 450 }, { "label": "华北", "value": 320 }] }
        },
        {
          "type": "Column (柱状图)",
          "example_id": "chart-column2",
          "syntax": "infographic chart-column2\\ndata\\n  title 季度增长\\n  items\\n    - label Q1\\n      value 120\\n    - label Q2\\n      value 180",
          "data": { "title": "季度增长", "items": [{ "label": "Q1", "value": 120 }, { "label": "Q2", "value": 180 }] }
        },
        {
          "type": "Pie (饼图)",
          "example_id": "chart-pie3",
          "syntax": "infographic chart-pie3\\ndata\\n  title 渠道来源\\n  items\\n    - label 搜索\\n      value 60\\n    - label 广告\\n      value 40",
          "data": { "title": "渠道来源", "items": [{ "label": "搜索", "value": 60 }, { "label": "广告", "value": 40 }] }
        },
        {
          "type": "Donut (环形图)",
          "example_id": "chart-donut1",
          "syntax": "infographic chart-donut1\\ndata\\n  title 预算分配\\n  items\\n    - label 研发\\n      value 70\\n    - label 行政\\n      value 30",
          "data": { "title": "预算分配", "items": [{ "label": "研发", "value": 70 }, { "label": "行政", "value": 30 }] }
        },
        {
          "type": "Area (面积图)",
          "example_id": "chart-area1",
          "syntax": "infographic chart-area1\\ndata\\n  title 流量趋势\\n  items\\n    - label 周一\\n      value 100\\n    - label 周二\\n      value 150",
          "data": { "title": "流量趋势", "items": [{ "label": "周一", "value": 100 }, { "label": "周二", "value": 150 }] }
        }
      ]
    },
    {
      "category": "Comparison (对比类)",
      "sub_categories": [
        {
          "type": "Side by Side (左右对照)",
          "example_id": "compare-binary1",
          "syntax": "infographic compare-binary1\\ndata\\n  items\\n    - label 方案A\\n      desc 成本低，速度快\\n    - label 方案B\\n      desc 质量高，长期稳",
          "data": { "items": [{ "label": "方案A", "desc": "成本低" }, { "label": "方案B", "desc": "质量高" }] }
        },
        {
          "type": "Versus (对立)",
          "example_id": "compare-versus2",
          "syntax": "infographic compare-versus2\\ndata\\n  items\\n    - label 传统模式\\n      value 40\\n    - label AI模式\\n      value 90",
          "data": { "items": [{ "label": "传统模式", "value": 40 }, { "label": "AI模式", "value": 90 }] }
        },
        {
          "type": "Horizontal Comparison (水平对比)",
          "example_id": "compare-horizontal3",
          "syntax": "infographic compare-horizontal3\\ndata\\n  items\\n    - label 竞品1\\n      value 75\\n    - label 我方\\n      value 95",
          "data": { "items": [{ "label": "竞品1", "value": 75 }, { "label": "我方", "value": 95 }] }
        }
      ]
    },
    {
      "category": "Hierarchy (层级类)",
      "sub_categories": [
        {
          "type": "Tree (树形结构)",
          "example_id": "hierarchy-tree2",
          "syntax": "infographic hierarchy-tree2\\ndata\\n  items\\n    - label CEO\\n      children\\n        - label 财务部\\n        - label 技术部",
          "data": { "items": [{ "label": "CEO", "children": [{ "label": "财务部" }, { "label": "技术部" }] }] }
        },
        {
          "type": "Pyramid (金字塔)",
          "example_id": "hierarchy-pyramid1",
          "syntax": "infographic hierarchy-pyramid1\\ndata\\n  items\\n    - label 愿景\\n    - label 战略\\n    - label 执行",
          "data": { "items": [{ "label": "愿景" }, { "label": "战略" }, { "label": "执行" }] }
        },
        {
          "type": "Triangle (三角形层级)",
          "example_id": "hierarchy-triangle1",
          "syntax": "infographic hierarchy-triangle1\\ndata\\n  items\\n    - label 核心层\\n    - label 扩展层",
          "data": { "items": [{ "label": "核心层" }, { "label": "扩展层" }] }
        },
        {
          "type": "Sunburst (旭日图)",
          "example_id": "hierarchy-sunburst1",
          "syntax": "infographic hierarchy-sunburst1\\ndata\\n  items\\n    - label 电子产品\\n      children\\n        - label 手机\\n          value 50",
          "data": { "items": [{ "label": "电子产品", "children": [{ "label": "手机", "value": 50 }] }] }
        }
      ]
    },
    {
      "category": "List (列表类)",
      "sub_categories": [
        {
          "type": "Numbered List (数字列表)",
          "example_id": "list-numbered1",
          "syntax": "infographic list-numbered1\\ndata\\n  items\\n    - label 第一步\\n    - label 第二步",
          "data": { "items": [{ "label": "第一步" }, { "label": "第二步" }] }
        },
        {
          "type": "Icon List (图标列表)",
          "example_id": "list-grid-icon1",
          "syntax": "infographic list-grid-icon1\\ndata\\n  items\\n    - label 安全\\n      icon mdi/shield\\n    - label 速度\\n      icon mdi/flash",
          "data": { "items": [{ "label": "安全", "icon": "mdi/shield" }, { "label": "速度", "icon": "mdi/flash" }] }
        },
        {
          "type": "Bulleted List (项目符号列表)",
          "example_id": "list-bullet1",
          "syntax": "infographic list-bullet1\\ndata\\n  items\\n    - label 核心点A\\n    - label 核心点B",
          "data": { "items": [{ "label": "核心点A" }, { "label": "核心点B" }] }
        },
        {
          "type": "Row/Column List (行列列表)",
          "example_id": "list-row-simple",
          "syntax": "infographic list-row-simple\\ndata\\n  items\\n    - label 姓名\\n      desc 张三\\n    - label 职位\\n      desc 工程师",
          "data": { "items": [{ "label": "姓名", "desc": "张三" }, { "label": "职位", "desc": "工程师" }] }
        }
      ]
    },
    {
      "category": "Quadrant (象限类)",
      "sub_categories": [
        {
          "type": "Standard Quadrant (标准四象限)",
          "example_id": "quadrant-standard1",
          "syntax": "infographic quadrant-standard1\\ndata\\n  items\\n    - label 核心业务\\n      desc 高价值高频率\\n    - label 潜力业务\\n      desc 高价值低频率",
          "data": { "items": [{ "label": "核心业务", "desc": "重要" }, { "label": "潜力业务", "desc": "关注" }] }
        },
        {
          "type": "2x2 Matrix (2x2 矩阵)",
          "example_id": "quadrant-matrix2",
          "syntax": "infographic quadrant-matrix2\\ndata\\n  items\\n    - label 明星产品\\n    - label 瘦狗产品",
          "data": { "items": [{ "label": "明星产品" }, { "label": "瘦狗产品" }] }
        }
      ]
    },
    {
      "category": "Relation (关系类)",
      "sub_categories": [
        {
          "type": "Mindmap (思维导图)",
          "example_id": "mindmap1",
          "syntax": "infographic mindmap1\\ndata\\n  items\\n    - label 中心主题\\n      children\\n        - label 分支1\\n        - label 分支2",
          "data": { "items": [{ "label": "中心主题", "children": [{ "label": "分支1" }, { "label": "分支2" }] }] }
        },
        {
          "type": "Workflow (工作流)",
          "example_id": "relation-workflow1",
          "syntax": "infographic relation-workflow1\\ndata\\n  items\\n    - label 提交\\n    - label 审核\\n    - label 发布",
          "data": { "items": [{ "label": "提交" }, { "label": "审核" }, { "label": "发布" }] }
        },
        {
          "type": "Network (网络图)",
          "example_id": "relation-network1",
          "syntax": "infographic relation-network1\\ndata\\n  items\\n    - label 节点A\\n      children\\n        - label 节点B",
          "data": { "items": [{ "label": "节点A", "children": [{ "label": "节点B" }] }] }
        },
        {
          "type": "Connection Line (连线关系)",
          "example_id": "relation-connection2",
          "syntax": "infographic relation-connection2\\ndata\\n  items\\n    - label 起点\\n    - label 终点",
          "data": { "items": [{ "label": "起点" }, { "label": "终点" }] }
        }
      ]
    },
    {
      "category": "Sequence (时序/序列类)",
      "sub_categories": [
        {
          "type": "Timeline (时间轴)",
          "example_id": "sequence-timeline2",
          "syntax": "infographic sequence-timeline2\\ndata\\n  items\\n    - label 2020\\n      desc 成立\\n    - label 2024\\n      desc 上市",
          "data": { "items": [{ "label": "2020", "desc": "成立" }, { "label": "2024", "desc": "上市" }] }
        },
        {
          "type": "Process Step (步骤流程)",
          "example_id": "sequence-step3",
          "syntax": "infographic sequence-step3\\ndata\\n  items\\n    - label 注册\\n    - label 认证\\n    - label 使用",
          "data": { "items": [{ "label": "注册" }, { "label": "认证" }, { "label": "使用" }] }
        },
        {
          "type": "Zigzag (锯齿形路径)",
          "example_id": "sequence-zigzag1",
          "syntax": "infographic sequence-zigzag1\\ndata\\n  items\\n    - label 阶段1\\n    - label 阶段2\\n    - label 阶段3",
          "data": { "items": [{ "label": "阶段1" }, { "label": "阶段2" }, { "label": "阶段3" }] }
        },
        {
          "type": "Circular Flow (循环流)",
          "example_id": "sequence-circular1",
          "syntax": "infographic sequence-circular1\\ndata\\n  items\\n    - label 生产\\n    - label 消费\\n    - label 回收",
          "data": { "items": [{ "label": "生产" }, { "label": "消费" }, { "label": "回收" }] }
        }
      ]
    }
  ]
};

/**
 * Keyword to template mapping for intelligent template selection
 */
const KEYWORD_TEMPLATE_MAP: Record<string, string> = {
  // Comparison keywords
  'vs': 'comparison',
  '对比': 'comparison',
  'versus': 'comparison',
  '差异': 'comparison',
  '优劣': 'comparison',

  // Chart keywords
  '占比': 'pie_chart',
  '分布': 'pie_chart',
  '排行': 'bar_chart',
  '趋势': 'bar_chart',
  '增长': 'bar_chart',
  '统计': 'bar_chart',

  // Timeline/Sequence keywords
  '时间': 'process_flow',
  '年份': 'process_flow',
  '历史': 'process_flow',
  '发展': 'process_flow',
  '步骤': 'process_flow',
  '流程': 'process_flow',
  'timeline': 'process_flow',

  // Hierarchy keywords
  '层级': 'text',
  '架构': 'text',
  '组织': 'text',
  '分类': 'text',

  // Relation keywords
  '关系': 'text',
  '关联': 'text',
  '依赖': 'text',
  '思维导图': 'text',

  // Stat keywords
  '%': 'stat_highlight',
  '亿': 'stat_highlight',
  '万': 'stat_highlight',
  '下降': 'stat_highlight',
};

/**
 * Get recommended template type based on text keywords
 *
 * @param text - Input text to analyze
 * @returns Recommended section type
 */
export function getTemplateByKeywords(text: string): string {
  const lowerText = text.toLowerCase();

  for (const [keyword, template] of Object.entries(KEYWORD_TEMPLATE_MAP)) {
    if (lowerText.includes(keyword.toLowerCase())) {
      return template;
    }
  }

  return 'bar_chart'; // Default fallback
}

/**
 * Get enhanced system instruction with few-shot examples
 * for providers that benefit from more context
 */
export function getEnhancedSystemInstruction(): string {
  return `
**INFOGRAPHIC TEMPLATES (基于 AntV Infographic 语法)**

你拥有丰富的可视化模板库，根据用户输入的主题类型，智能选择最合适的模板：

**1. 数据统计类** → bar_chart, pie_chart
   - 关键词: 占比、分布、排行、趋势、统计

**2. 对比分析类** → comparison
   - 关键词: VS、对比、优劣、差异、versus

**3. 时序流程类** → process_flow
   - 关键词: 时间线、发展史、步骤、流程、年份

**4. 层级结构类** → text (structured)
   - 关键词: 组织架构、层级、分类体系

**5. 关系网络类** → text (structured)
   - 关键词: 思维导图、关联、依赖

**6. 统计高亮类** → stat_highlight
   - 关键词: %、亿、万、增长率

**输出格式要求**:
1. 必须包含 type 字段，对应上述模板类型
2. 数据结构必须匹配模板要求（data, steps, comparisonItems 等）
3. 添加 content 字段提供上下文说明
4. 每个数值必须有实际意义，禁止输出空数组

**可用的 section 类型**:
- text: 文本段落
- stat_highlight: 统计高亮 (需要 statValue, statLabel)
- bar_chart: 柱状图 (需要 data: [{name, value}])
- pie_chart: 饼图 (需要 data: [{name, value}])
- process_flow: 流程图 (需要 steps: [{step, title, description}])
- comparison: 对比表 (需要 comparisonItems: [{label, left, right}])

**IMPORTANT: 参考以下完整示例来生成报告**

${TIMELINE_COMPARISON_EXAMPLE}

`;
}

/**
 * Complete report-level few-shot example
 * This demonstrates a full InfographicReport structure with proper data volume
 */
export const TIMELINE_COMPARISON_EXAMPLE = `
**User Input:** "时间轴上的中国历史大事件和世界历史大事件的对比"

**Model Output:**
{
  "title": "文明交响曲：中国与世界历史的时间对话",
  "summary": "跨越五千年的历史长河，中华文明与西方文明在相似的时间节点上绽放出不同的光芒。从轴心时代到大航海时代，两个平行的文明在地球的东西两端各自书写着辉煌的篇章。",
  "sections": [
    {
      "type": "text",
      "title": "文明起源（约公元前3000年）",
      "content": "当古埃及人在尼罗河畔建造金字塔时，中国的先民在黄河流域孕育了早期文明。两大文明几乎同时起步，却走上了不同的发展道路。"
    },
    {
      "type": "stat_highlight",
      "title": "轴心时代",
      "statValue": "公元前500年",
      "statLabel": "东西方思想同时爆发",
      "statTrend": "up",
      "content": "孔子、老子、释迦牟尼、苏格拉底几乎同时活跃在地球不同角落，开启了人类思想的黄金时代。"
    },
    {
      "type": "comparison",
      "title": "秦汉帝国 vs 罗马帝国",
      "content": "东西方两大帝国的全面对比",
      "comparisonItems": [
        { "label": "统一时间", "left": "秦朝: 公元前221年", "right": "罗马: 公元前27年" },
        { "label": "疆域面积", "left": "约340万平方公里", "right": "约500万平方公里" },
        { "label": "人口规模", "left": "约2000万", "right": "约4500万" },
        { "label": "统治时长", "left": "秦汉: 约440年", "right": "西罗马: 约500年" },
        { "label": "继承体系", "left": "世袭制+科举", "right": "元首制+元老院" },
        { "label": "宗教信仰", "left": "儒释道", "right": "多神教→基督教" }
      ]
    },
    {
      "type": "bar_chart",
      "title": "8世纪世界帝国人口对比",
      "content": "公元750年左右，东西方各大帝国人口估算（单位：百万）",
      "data": [
        { "name": "唐朝", "value": 50 },
        { "name": "阿拉伯帝国", "value": 34 },
        { "name": "拜占庭帝国", "value": 7 },
        { "name": "法兰克王国", "value": 5 },
        { "name": "吐蕃帝国", "value": 3 }
      ]
    },
    {
      "type": "process_flow",
      "title": "丝绸之路的兴衰历程",
      "content": "连接东西方的伟大贸易通道",
      "steps": [
        { "step": 1, "title": "张骞出使西域（公元前138年）", "description": "汉朝派遣张骞出使西域，开辟了陆上丝绸之路的雏形。" },
        { "step": 2, "title": "罗马商人的到来（公元1世纪）", "description": "罗马帝国商人开始通过丝绸之路与中国进行贸易。" },
        { "step": 3, "title": "唐朝全盛时期（7-8世纪）", "description": "唐朝控制西域，丝绸之路达到鼎盛，长安成为国际大都市。" },
        { "step": 4, "title": "阿拉伯帝国崛起（8世纪）", "description": "阿拉伯人控制了中亚地区，成为东西方贸易的中转者。" },
        { "step": 5, "title": "蒙古帝国时期（13-14世纪）", "description": "蒙古帝国统一欧亚大陆，丝绸之路空前繁荣，马可·波罗来华。" },
        { "step": 6, "title": "海上丝绸之路兴起（15-16世纪）", "description": "郑和下西洋，欧洲大航海时代，陆上丝绸之路逐渐衰落。" }
      ]
    },
    {
      "type": "pie_chart",
      "title": "15世纪世界人口分布",
      "content": "明朝时期各大文明圈人口占比估算（%）",
      "data": [
        { "name": "中国（明朝）", "value": 35 },
        { "name": "印度", "value": 25 },
        { "name": "欧洲", "value": 18 },
        { "name": "伊斯兰世界", "value": 15 },
        { "name": "其他", "value": 7 }
      ]
    },
    {
      "type": "comparison",
      "title": "文艺复兴 vs 明朝文化",
      "content": "14-16世纪东西方文化繁荣对比",
      "comparisonItems": [
        { "label": "核心精神", "left": "人文主义", "right": "程朱理学" },
        { "label": "艺术代表", "left": "达芬奇、米开朗基罗", "right": "唐寅、仇英" },
        { "label": "科技发明", "left": "印刷术普及", "right": "《本草纲目》成书" },
        { "label": "政治制度", "left": "城邦国家", "right": "中央集权制" },
        { "label": "海洋探索", "left": "哥伦布发现新大陆", "right": "郑和七下西洋" }
      ]
    },
    {
      "type": "stat_highlight",
      "title": "工业革命转折点",
      "statValue": "1760年代",
      "statLabel": "英国工业革命开始",
      "statTrend": "up",
      "content": "当西方开始工业革命时，中国仍处于清朝乾隆盛世，东西方发展轨迹开始分叉，世界格局即将发生根本性改变。"
    }
  ]
}
`;
