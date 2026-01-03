/**
 * Chart Few-Shot Examples
 * Based on custom enhanced chart components (Recharts-based)
 *
 * Chart Types:
 * - RadialBarChart (3): Simple, Gauge, Stacked
 * - RadarChart (3): Simple, Filled, Comparison
 * - ScatterChart (4): Simple, Bubble, MultiSeries, Shape
 * - BarChart (5): Simple, Stacked, Horizontal, Percent, Rounded
 * - PieChart (5): Simple, Donut, Interactive, Label, Rose
 * - AreaChart (4): Simple, Stacked, Percent, Gradient
 * - LineChart (5): Simple, Smooth, MultiSeries, Step, Dashed
 */

import { CategoryExamples } from './types';

export const CHART_EXAMPLES: CategoryExamples = {
  "category": "Chart (统计图表)",
  "sub_categories": [
    // ============================================
    // BAR CHART VARIANTS (5 types)
    // ============================================
    {
      "type": "Bar Chart - Simple (简单柱状图)",
      "example_id": "bar-simple",
      "syntax": "infographic bar-simple\\ndata\\n  title 季度销售额对比\\n  items\\n    - label Q1\\n      value 120\\n    - label Q2\\n      value 150\\n    - label Q3\\n      value 180\\n    - label Q4\\n      value 200",
      "data": [{ "name": "Q1", "value": 120 }, { "name": "Q2", "value": 150 }, { "name": "Q3", "value": 180 }, { "name": "Q4", "value": 200 }]
    },
    {
      "type": "Bar Chart - Stacked (堆叠柱状图)",
      "example_id": "bar-stacked",
      "syntax": "infographic bar-stacked\\ndata\\n  title 产品销售构成\\n  items\\n    - label Q1\\n      productA 100\\n      productB 80\\n      productC 60\\n    - label Q2\\n      productA 120\\n      productB 90\\n      productC 70\\n    - label Q3\\n      productA 140\\n      productB 100\\n      productC 80",
      "data": [{ "name": "Q1", "productA": 100, "productB": 80, "productC": 60 }, { "name": "Q2", "productA": 120, "productB": 90, "productC": 70 }, { "name": "Q3", "productA": 140, "productB": 100, "productC": 80 }]
    },
    {
      "type": "Bar Chart - Horizontal (水平柱状图)",
      "example_id": "bar-horizontal",
      "syntax": "infographic bar-horizontal\\ndata\\n  title 部门人员数量\\n  items\\n    - label 研发部\\n      value 45\\n    - label 市场部\\n      value 30\\n    - label 销售部\\n      value 50\\n    - label 运营部\\n      value 25",
      "data": [{ "name": "研发部", "value": 45 }, { "name": "市场部", "value": 30 }, { "name": "销售部", "value": 50 }, { "name": "运营部", "value": 25 }]
    },
    {
      "type": "Bar Chart - Percent (百分比柱状图)",
      "example_id": "bar-percent",
      "syntax": "infographic bar-percent\\ndata\\n  title 用户来源分布\\n  items\\n    - label 2023\\n      organic 40\\n      direct 30\\n      referral 20\\n      social 10\\n    - label 2024\\n      organic 45\\n      direct 25\\n      referral 18\\n      social 12",
      "data": [{ "name": "2023", "organic": 40, "direct": 30, "referral": 20, "social": 10 }, { "name": "2024", "organic": 45, "direct": 25, "referral": 18, "social": 12 }]
    },
    {
      "type": "Bar Chart - Rounded (圆角柱状图)",
      "example_id": "bar-rounded",
      "syntax": "infographic bar-rounded\\ndata\\n  title 技能评分\\n  items\\n    - label JavaScript\\n      value 90\\n    - label Python\\n      value 85\\n    - label React\\n      value 88\\n    - label Node.js\\n      value 82",
      "data": [{ "name": "JavaScript", "value": 90 }, { "name": "Python", "value": 85 }, { "name": "React", "value": 88 }, { "name": "Node.js", "value": 82 }]
    },

    // ============================================
    // PIE CHART VARIANTS (5 types)
    // ============================================
    {
      "type": "Pie Chart - Simple (简单饼图)",
      "example_id": "pie-simple",
      "syntax": "infographic pie-simple\\ndata\\n  title 支出构成\\n  items\\n    - label 研发\\n      value 40\\n    - label 营销\\n      value 30\\n    - label 运营\\n      value 20\\n    - label 行政\\n      value 10",
      "data": [{ "name": "研发", "value": 40 }, { "name": "营销", "value": 30 }, { "name": "运营", "value": 20 }, { "name": "行政", "value": 10 }]
    },
    {
      "type": "Pie Chart - Donut (环形图)",
      "example_id": "pie-donut",
      "syntax": "infographic pie-donut\\ndata\\n  title 市场份额\\n  items\\n    - label 公司A\\n      value 35\\n    - label 公司B\\n      value 25\\n    - label 公司C\\n      value 20\\n    - label 其他\\n      value 20",
      "data": [{ "name": "公司A", "value": 35 }, { "name": "公司B", "value": 25 }, { "name": "公司C", "value": 20 }, { "name": "其他", "value": 20 }]
    },
    {
      "type": "Pie Chart - Interactive (交互式饼图)",
      "example_id": "pie-interactive",
      "syntax": "infographic pie-interactive\\ndata\\n  title 用户画像\\n  items\\n    - label 18-24岁\\n      value 25\\n    - label 25-34岁\\n      value 35\\n    - label 35-44岁\\n      value 25\\n    - label 45岁以上\\n      value 15",
      "data": [{ "name": "18-24岁", "value": 25 }, { "name": "25-34岁", "value": 35 }, { "name": "35-44岁", "value": 25 }, { "name": "45岁以上", "value": 15 }]
    },
    {
      "type": "Pie Chart - Label (标签饼图)",
      "example_id": "pie-label",
      "syntax": "infographic pie-label\\ndata\\n  title 预算分配\\n  items\\n    - label 研发\\n      value 40\\n    - label 市场\\n      value 25\\n    - label 销售\\n      value 20\\n    - label 客服\\n      value 15",
      "data": [{ "name": "研发", "value": 40 }, { "name": "市场", "value": 25 }, { "name": "销售", "value": 20 }, { "name": "客服", "value": 15 }]
    },
    {
      "type": "Pie Chart - Rose (玫瑰图)",
      "example_id": "pie-rose",
      "syntax": "infographic pie-rose\\ndata\\n  title 销售渠道贡献\\n  items\\n    - label 线上\\n      value 120\\n    - label 线下\\n      value 90\\n    - label 代理商\\n      value 70\\n    - label 直销\\n      value 50",
      "data": [{ "name": "线上", "value": 120 }, { "name": "线下", "value": 90 }, { "name": "代理商", "value": 70 }, { "name": "直销", "value": 50 }]
    },

    // ============================================
    // LINE CHART VARIANTS (5 types)
    // ============================================
    {
      "type": "Line Chart - Simple (简单折线图)",
      "example_id": "line-simple",
      "syntax": "infographic line-simple\\ndata\\n  title 月度增长趋势\\n  items\\n    - label 1月\\n      value 120\\n    - label 2月\\n      value 135\\n    - label 3月\\n      value 125\\n    - label 4月\\n      value 145\\n    - label 5月\\n      value 160\\n    - label 6月\\n      value 175",
      "data": [{ "name": "1月", "value": 120 }, { "name": "2月", "value": 135 }, { "name": "3月", "value": 125 }, { "name": "4月", "value": 145 }, { "name": "5月", "value": 160 }, { "name": "6月", "value": 175 }]
    },
    {
      "type": "Line Chart - Smooth (平滑折线图)",
      "example_id": "line-smooth",
      "syntax": "infographic line-smooth\\ndata\\n  title 用户增长曲线\\n  items\\n    - label 1月\\n      value 1000\\n    - label 2月\\n      value 1200\\n    - label 3月\\n      value 1500\\n    - label 4月\\n      value 1800\\n    - label 5月\\n      value 2100\\n    - label 6月\\n      value 2500",
      "data": [{ "name": "1月", "value": 1000 }, { "name": "2月", "value": 1200 }, { "name": "3月", "value": 1500 }, { "name": "4月", "value": 1800 }, { "name": "5月", "value": 2100 }, { "name": "6月", "value": 2500 }]
    },
    {
      "type": "Line Chart - Multi Series (多系列折线图)",
      "example_id": "line-multi-series",
      "syntax": "infographic line-multi-series\\ndata\\n  title 产品对比\\n  items\\n    - label Q1\\n      productA 120\\n      productB 100\\n    - label Q2\\n      productA 140\\n      productB 110\\n    - label Q3\\n      productA 160\\n      productB 105\\n    - label Q4\\n      productA 180\\n      productB 115",
      "data": [{ "name": "Q1", "productA": 120, "productB": 100 }, { "name": "Q2", "productA": 140, "productB": 110 }, { "name": "Q3", "productA": 160, "productB": 105 }, { "name": "Q4", "productA": 180, "productB": 115 }]
    },
    {
      "type": "Line Chart - Step (阶梯折线图)",
      "example_id": "line-step",
      "syntax": "infographic line-step\\ndata\\n  title 阶段目标达成\\n  items\\n    - label 阶段一\\n      value 80\\n    - label 阶段二\\n      value 90\\n    - label 阶段三\\n      value 85\\n    - label 阶段四\\n      value 95\\n    - label 阶段五\\n      value 100",
      "data": [{ "name": "阶段一", "value": 80 }, { "name": "阶段二", "value": 90 }, { "name": "阶段三", "value": 85 }, { "name": "阶段四", "value": 95 }, { "name": "阶段五", "value": 100 }]
    },
    {
      "type": "Line Chart - Dashed (虚线折线图)",
      "example_id": "line-dashed",
      "syntax": "infographic line-dashed\\ndata\\n  title 预测 vs 实际\\n  items\\n    - label 1月\\n      forecast 120\\n      actual 115\\n    - label 2月\\n      forecast 130\\n      actual 135\\n    - label 3月\\n      forecast 140\\n      actual 138\\n    - label 4月\\n      forecast 150\\n      actual 155",
      "data": [{ "name": "1月", "forecast": 120, "actual": 115 }, { "name": "2月", "forecast": 130, "actual": 135 }, { "name": "3月", "forecast": 140, "actual": 138 }, { "name": "4月", "forecast": 150, "actual": 155 }]
    },

    // ============================================
    // AREA CHART VARIANTS (4 types)
    // ============================================
    {
      "type": "Area Chart - Simple (简单面积图)",
      "example_id": "area-simple",
      "syntax": "infographic area-simple\\ndata\\n  title 累计用户增长\\n  items\\n    - label 1月\\n      value 1000\\n    - label 2月\\n      value 2200\\n    - label 3月\\n      value 3600\\n    - label 4月\\n      value 5200\\n    - label 5月\\n      value 7000",
      "data": [{ "name": "1月", "value": 1000 }, { "name": "2月", "value": 2200 }, { "name": "3月", "value": 3600 }, { "name": "4月", "value": 5200 }, { "name": "5月", "value": 7000 }]
    },
    {
      "type": "Area Chart - Stacked (堆叠面积图)",
      "example_id": "area-stacked",
      "syntax": "infographic area-stacked\\ndata\\n  title 多产品收入\\n  items\\n    - label Q1\\n      productA 100\\n      productB 80\\n    - label Q2\\n      productA 120\\n      productB 90\\n    - label Q3\\n      productA 130\\n      productB 95\\n    - label Q4\\n      productA 150\\n      productB 100",
      "data": [{ "name": "Q1", "productA": 100, "productB": 80 }, { "name": "Q2", "productA": 120, "productB": 90 }, { "name": "Q3", "productA": 130, "productB": 95 }, { "name": "Q4", "productA": 150, "productB": 100 }]
    },
    {
      "type": "Area Chart - Percent (百分比面积图)",
      "example_id": "area-percent",
      "syntax": "infographic area-percent\\ndata\\n  title 流量来源占比\\n  items\\n    - label 1月\\n      organic 45\\n      direct 30\\n      referral 25\\n    - label 2月\\n      organic 50\\n      direct 25\\n      referral 25\\n    - label 3月\\n      organic 48\\n      direct 28\\n      referral 24",
      "data": [{ "name": "1月", "organic": 45, "direct": 30, "referral": 25 }, { "name": "2月", "organic": 50, "direct": 25, "referral": 25 }, { "name": "3月", "organic": 48, "direct": 28, "referral": 24 }]
    },
    {
      "type": "Area Chart - Gradient (渐变面积图)",
      "example_id": "area-gradient",
      "syntax": "infographic area-gradient\\ndata\\n  title 活跃用户趋势\\n  items\\n    - label 周一\\n      value 1200\\n    - label 周二\\n      value 1400\\n    - label 周三\\n      value 1350\\n    - label 周四\\n      value 1500\\n    - label 周五\\n      value 1700\\n    - label 周六\\n      value 1900\\n    - label 周日\\n      value 1800",
      "data": [{ "name": "周一", "value": 1200 }, { "name": "周二", "value": 1400 }, { "name": "周三", "value": 1350 }, { "name": "周四", "value": 1500 }, { "name": "周五", "value": 1700 }, { "name": "周六", "value": 1900 }, { "name": "周日", "value": 1800 }]
    },

    // ============================================
    // RADIAL BAR CHART VARIANTS (3 types)
    // ============================================
    {
      "type": "Radial Bar Chart - Simple (简单环形条形图)",
      "example_id": "radial-bar-simple",
      "syntax": "infographic radial-bar-simple\\ndata\\n  title 技能完成度\\n  items\\n    - label JavaScript\\n      value 85\\n    - label Python\\n      value 75\\n    - label React\\n      value 80\\n    - label Node.js\\n      value 70\\n    - label SQL\\n      value 65",
      "data": [{ "name": "JavaScript", "value": 85 }, { "name": "Python", "value": 75 }, { "name": "React", "value": 80 }, { "name": "Node.js", "value": 70 }, { "name": "SQL", "value": 65 }]
    },
    {
      "type": "Radial Bar Chart - Gauge (仪表盘图)",
      "example_id": "radial-bar-gauge",
      "syntax": "infographic radial-bar-gauge\\ndata\\n  title KPI达成率\\n  items\\n    - label 销售\\n      value 92\\n    - label 利润\\n      value 88\\n    - label 客户\\n      value 85\\n    - label 复购\\n      value 78",
      "data": [{ "name": "销售", "value": 92 }, { "name": "利润", "value": 88 }, { "name": "客户", "value": 85 }, { "name": "复购", "value": 78 }]
    },
    {
      "type": "Radial Bar Chart - Stacked (堆叠环形条形图)",
      "example_id": "radial-bar-stacked",
      "syntax": "infographic radial-bar-stacked\\ndata\\n  title 团队技能分布\\n  items\\n    - label 前端\\n      basic 60\\n      advanced 80\\n    - label 后端\\n      basic 70\\n      advanced 75\\n    - label 算法\\n      basic 50\\n      advanced 65",
      "data": [{ "name": "前端", "basic": 60, "advanced": 80 }, { "name": "后端", "basic": 70, "advanced": 75 }, { "name": "算法", "basic": 50, "advanced": 65 }]
    },

    // ============================================
    // RADAR CHART VARIANTS (3 types)
    // ============================================
    {
      "type": "Radar Chart - Simple (简单雷达图)",
      "example_id": "radar-simple",
      "syntax": "infographic radar-simple\\ndata\\n  title 能力评估\\n  items\\n    - label 沟通能力\\n      value 85\\n    - label 技术能力\\n      value 90\\n    - label 领导力\\n      value 75\\n    - label 创新力\\n      value 80\\n    - label 执行力\\n      value 88\\n    - label 学习力\\n      value 82",
      "data": [{ "label": "沟通能力", "value": 85 }, { "label": "技术能力", "value": 90 }, { "label": "领导力", "value": 75 }, { "label": "创新力", "value": 80 }, { "label": "执行力", "value": 88 }, { "label": "学习力", "value": 82 }]
    },
    {
      "type": "Radar Chart - Filled (填充雷达图)",
      "example_id": "radar-filled",
      "syntax": "infographic radar-filled\\ndata\\n  title 产品特性对比\\n  items\\n    - label 性能\\n      productA 90\\n      productB 80\\n    - label 易用性\\n      productA 85\\n      productB 90\\n    - label 稳定性\\n      productA 88\\n      productB 85\\n    - label 扩展性\\n      productA 82\\n      productB 88",
      "data": [{ "label": "性能", "productA": 90, "productB": 80 }, { "label": "易用性", "productA": 85, "productB": 90 }, { "label": "稳定性", "productA": 88, "productB": 85 }, { "label": "扩展性", "productA": 82, "productB": 88 }]
    },
    {
      "type": "Radar Chart - Comparison (对比雷达图)",
      "example_id": "radar-comparison",
      "syntax": "infographic radar-comparison\\ndata\\n  title 竞品分析\\n  items\\n    - label 功能\\n      ours 95\\n      competitor 85\\n    - label 价格\\n      ours 80\\n      competitor 90\\n    - label 服务\\n      ours 92\\n      competitor 78\\n    - label 品牌\\n      ours 75\\n      competitor 88\\n    - label 创新\\n      ours 90\\n      competitor 80",
      "data": [{ "label": "功能", "ours": 95, "competitor": 85 }, { "label": "价格", "ours": 80, "competitor": 90 }, { "label": "服务", "ours": 92, "competitor": 78 }, { "label": "品牌", "ours": 75, "competitor": 88 }, { "label": "创新", "ours": 90, "competitor": 80 }]
    },

    // ============================================
    // SCATTER CHART VARIANTS (4 types)
    // ============================================
    {
      "type": "Scatter Chart - Simple (简单散点图)",
      "example_id": "scatter-simple",
      "syntax": "infographic scatter-simple\\ndata\\n  title 身高体重分布\\n  items\\n    - label 人群A\\n      x 170\\n      y 65\\n    - label 人群B\\n      x 175\\n      y 70\\n    - label 人群C\\n      x 165\\n      y 60\\n    - label 人群D\\n      x 180\\n      y 75",
      "data": [{ "x": 170, "y": 65 }, { "x": 175, "y": 70 }, { "x": 165, "y": 60 }, { "x": 180, "y": 75 }]
    },
    {
      "type": "Scatter Chart - Bubble (气泡散点图)",
      "example_id": "scatter-bubble",
      "syntax": "infographic scatter-bubble\\ndata\\n  title 产品分析\\n  items\\n    - label 产品A\\n      x 50\\n      y 60\\n      z 100\\n    - label 产品B\\n      x 70\\n      y 75\\n      z 150\\n    - label 产品C\\n      x 60\\n      y 55\\n      z 80\\n    - label 产品D\\n      x 80\\n      y 80\\n      z 120",
      "data": [{ "x": 50, "y": 60, "z": 100 }, { "x": 70, "y": 75, "z": 150 }, { "x": 60, "y": 55, "z": 80 }, { "x": 80, "y": 80, "z": 120 }]
    },
    {
      "type": "Scatter Chart - Multi Series (多系列散点图)",
      "example_id": "scatter-multi-series",
      "syntax": "infographic scatter-multi-series\\ndata\\n  title 实验对比\\n  series\\n    - name 实验组\\n      data\\n        - x 10\\n          y 20\\n        - x 15\\n          y 25\\n        - x 20\\n          y 30\\n    - name 对照组\\n      data\\n        - x 10\\n          y 18\\n        - x 15\\n          y 22\\n        - x 20\\n          y 26",
      "data": { "series": [{ "name": "实验组", "data": [{ "x": 10, "y": 20 }, { "x": 15, "y": 25 }, { "x": 20, "y": 30 }] }, { "name": "对照组", "data": [{ "x": 10, "y": 18 }, { "x": 15, "y": 22 }, { "x": 20, "y": 26 }] }] }
    },
    {
      "type": "Scatter Chart - Shape (多形状散点图)",
      "example_id": "scatter-shape",
      "syntax": "infographic scatter-shape\\ndata\\n  title 分类分析\\n  items\\n    - label 类别A\\n      x 30\\n      y 40\\n    - label 类别B\\n      x 50\\n      y 60\\n    - label 类别C\\n      x 40\\n      y 50\\n    - label 类别D\\n      x 60\\n      y 70",
      "data": [{ "x": 30, "y": 40 }, { "x": 50, "y": 60 }, { "x": 40, "y": 50 }, { "x": 60, "y": 70 }]
    }
  ]
};
