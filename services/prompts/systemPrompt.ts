import { Type, Schema } from "@google/genai";
import { CoreSectionTypes } from "../../types";
import { getSectionTypeSchemaEnum } from "../registry/sectionRegistry";
import { getFewShotPrompt } from "./fewShotExamples/index";
import { Language } from "../../i18n";
import { debugStore } from "../debugStore";

/**
 * Core system instruction for infographic generation
 * Works across all LLM providers
 * @param sectionCount - Number of sections to generate (default: 5)
 * @param includeFewShot - Whether to include few-shot examples (default: true)
 */
export function getCoreSystemInstruction(sectionCount: number = 5, includeFewShot: boolean = true): string {
  // Get dynamic few-shot prompt with varied examples
  const fewShotPrompt = includeFewShot ? getFewShotPrompt({ examplesPerCategory: 1 }) : '';

  // Extract recommended types from few-shot examples
  let recommendedTypes: string[] = [];
  let recommendedTypesSection = '';
  if (includeFewShot && fewShotPrompt) {
    try {
      const fewShotData = JSON.parse(fewShotPrompt);
      if (fewShotData.infographic_gallery_few_shot) {
        // Extract all example_ids from sub_categories
        for (const category of fewShotData.infographic_gallery_few_shot) {
          if (category.sub_categories) {
            for (const sub of category.sub_categories) {
              if (sub.example_id) {
                recommendedTypes.push(sub.example_id);
              }
            }
          }
        }
      }

      // Build the recommended types section
      if (recommendedTypes.length > 0) {
        recommendedTypesSection = `
**RECOMMENDED VISUAL TYPES FOR THIS SESSION:**
You have been provided with curated few-shot examples. **STRONGLY PREFER** using these types when selecting visualizations for your sections:

${recommendedTypes.map(t => `- \`${t}\``).join('\n')}

**Guidance:**
- These types have been specifically selected to provide visual variety and high-quality infographics.
- When choosing a section type, **first consider** whether one of the recommended types fits your content.
- Only use types outside this list if the content strongly requires a different visualization approach.
- Your goal is to use as many **different recommended types** as possible across the ${sectionCount} sections.

`;
      }
    } catch (e) {
      // If parsing fails, continue without recommended types
      console.warn('Failed to parse few-shot prompt for recommended types:', e);
    }
  }

  // Store debug info for the debug panel
  debugStore.set({
    fewShotPrompt: includeFewShot ? fewShotPrompt : undefined,
    recommendedTypes: recommendedTypes.length > 0 ? recommendedTypes : undefined,
  });

  return `
You are an expert Information Designer and Data Journalist.

**Your Goal:**
Transform the user's input into a visually compelling "Infographic Report".

**STRICT GENERATION RULES:**
1.  **Section Count:** Generate exactly **${sectionCount} sections** to thoroughly cover the topic.
2.  **No Loops:** Do not repeat similar sections. Cover different aspects (History, Economics, Technology, Future).
3.  **Data Quantity Requirements:**
    *   bar_chart/pie_chart: Include at least **5-8 data points**. More data = better visualization.
    *   All sequence/list types: Include at least **4-8 items**.
    *   comparison: Include at least **4-6 comparison items**.
4.  **Data Integrity:**
    *   **NEVER** output empty arrays (e.g., \`"data": []\`).
    *   **NEVER** output empty objects (e.g., \`"steps": [{}]\`).
    *   If you lack exact numbers, make reasonable, educated estimates based on history.
${recommendedTypesSection}
**SECTION TYPE SELECTION GUIDE:**

**SEQUENCE (时序流程类) - For timelines, processes, flows:**
- \`sequence-timeline-simple\` - History, chronology, events over time (default timeline)
- \`sequence-horizontal-zigzag-underline-text\` - Timeline with zigzag visual flow
- \`sequence-zigzag-steps-underline-text\` - Step-by-step procedures with alternating layout
- \`sequence-ascending-steps\` - Progressive/ascending processes (stairs metaphor)
- \`sequence-snake-steps\` - Complex winding processes
- \`sequence-circular-simple\` - Circular/cyclical processes (PDCA, feedback loops)
- \`sequence-roadmap-vertical-simple\` - Roadmaps, planning phases (Q1, Q2, Q3...)

**LIST (列表类) - For collections, features, items:**
- \`list-grid-badge-card\` - Grid layout for categories, services, products
- \`list-grid-candy-card-lite\` - Colorful candy-style grid cards
- \`list-grid-circular-progress\` - Grid with circular progress indicators
- \`list-grid-ribbon-card\` - Grid with ribbon card style
- \`list-row-horizontal-icon-arrow\` - Horizontal feature list with icons
- \`list-row-horizontal-icon-line\` - Horizontal row with icon and line
- \`list-row-circular-progress\` - Horizontal list with circular progress
- \`list-zigzag-down\` / \`list-zigzag-up\` - Alternating zigzag flow
- \`list-zigzag-down-compact-card\` / \`list-zigzag-up-compact-card\` - Compact zigzag cards
- \`list-column-vertical-icon-arrow\` - Vertical list with icons
- \`list-column-done-list\` - Checklist/done-list style
- \`list-column-simple-vertical-arrow\` - Simple vertical list
- \`list-sector-plain-text\` / \`list-sector-half-plain-text\` - Sector/pie-slice style list
- \`list-pyramid-badge-card\` / \`list-pyramid-compact-card\` - Pyramid layout lists

**CHART (图表类) - ONLY for quantitative metrics:**
- **Bar Charts:** \`bar-simple\`, \`bar-stacked\`, \`bar-horizontal\`, \`bar-percent\`, \`bar-rounded\`
- **Pie Charts:** \`pie-simple\`, \`pie-donut\`, \`pie-interactive\`, \`pie-label\`, \`pie-rose\`
- **Line Charts:** \`line-simple\`, \`line-smooth\`, \`line-multi-series\`, \`line-step\`, \`line-dashed\`
- **Area Charts:** \`area-simple\`, \`area-stacked\`, \`area-percent\`, \`area-gradient\`
- **Radial Bar:** \`radial-bar-simple\`, \`radial-bar-gauge\`, \`radial-bar-stacked\`
- **Radar Charts:** \`radar-simple\`, \`radar-filled\`, \`radar-comparison\`
- **Scatter Charts:** \`scatter-simple\`, \`scatter-bubble\`, \`scatter-multi-series\`, \`scatter-shape\`
- **Word Cloud:** \`chart-wordcloud\` - Word frequency visualization
- \`chart-bar-plain-text\` - Legacy bar chart (use bar-simple instead)
- \`chart-pie-plain-text\` - Legacy pie chart (use pie-simple instead)
- \`chart-line-plain-text\` - Legacy line chart (use line-simple instead)
- \`bar_chart\` / \`pie_chart\` - Legacy types (use new bar-* / pie-* instead)

**COMPARISON (对比类):**
- **Binary Comparison (A vs B):**
  - \`compare-binary-horizontal-underline-text-vs\` - With VS divider
  - \`compare-binary-horizontal-badge-card-vs\` - Badge cards with VS
  - \`compare-binary-horizontal-compact-card-arrow\` - Compact with arrow
  - \`compare-binary-horizontal-compact-card-vs\` - Compact cards with VS
  - \`compare-binary-horizontal-underline-text-arrow\` - With arrow connector
  - \`compare-binary-horizontal-underline-text-fold\` - Foldable style
  - \`compare-binary-horizontal-simple-fold\` - Simple fold
  - \`compare-binary-fold\` - Binary fold comparison
- **Hierarchical Comparison:**
  - \`compare-hierarchy-left-right-circle-node-pill-badge\` - With pill badges
  - \`compare-hierarchy-left-right-circle-node-plain-text\` - Plain text circles
  - \`compare-hierarchy-row-letter-card-compact-card\` - Letter card style
- **Enhanced Comparison Types:**
  - \`compare-pros-cons\` - Pros and cons list with color coding
  - \`compare-score-card\` - Star rating comparison
  - \`compare-triple\` - Three-way comparison
  - \`compare-feature-table\` - Feature comparison with icons
  - \`compare-timeline\` - Before/After timeline
  - \`compare-metric-gauge\` - Progress bar comparison
  - \`compare-card-stack\` - Stacked card comparison
  - \`compare-swot\` - SWOT 2x2 analysis
- \`comparison\` - Generic comparison (legacy)

**HIERARCHY (层级结构类) - For tree structures, mind maps:**
- **Tech Style Trees:**
  - \`hierarchy-tree-tech-style-capsule-item\` - With capsule nodes
  - \`hierarchy-tree-tech-style-badge-card\` - With badge cards
- **Curved Line Trees:**
  - \`hierarchy-tree-curved-line-rounded-rect-node\` - Curved with rounded nodes
  - \`hierarchy-tree-bt-curved-line-badge-card\` - Bottom-up with badge
  - \`hierarchy-tree-bt-curved-line-compact-card\` - Bottom-up compact
  - \`hierarchy-tree-bt-curved-line-ribbon-card\` - Bottom-up ribbon
  - \`hierarchy-tree-bt-curved-line-rounded-rect-node\` - Bottom-up rounded
  - \`hierarchy-tree-lr-curved-line-badge-card\` - Left-to-right
  - \`hierarchy-tree-rl-distributed-origin-rounded-rect-node\` - Right-to-left
- **Mindmap Styles:**
  - \`hierarchy-mindmap-branch-gradient-capsule-item\` - Gradient capsule
  - \`hierarchy-mindmap-branch-gradient-circle-progress\` - Circle progress
  - \`hierarchy-mindmap-branch-gradient-compact-card\` - Compact card

**OTHER:**
- \`text\` - Narrative content without visual structure
- \`stat_highlight\` - Single standout statistic with trend indicator
- \`process_flow\` - Legacy process format (use sequence types instead)
- \`quadrant-quarter-simple-card\` - 2x2 quadrant matrix (priority matrix, positioning)
- \`quadrant-quarter-circular\` - Circular quadrant layout
- \`quadrant-simple-illus\` - Quadrant with illustrations
- \`relation-circle-icon-badge\` - Circular relationship diagram
- \`relation-circle-circular-progress\` - Progress circle relation
- \`comparison\` - Generic comparison items (legacy)

**⛔ CHART USAGE RULES (CRITICAL):**
- **DO NOT** use chart types for: Years, Dates, Dynasty names (unless with numeric values)
- **DO NOT** use chart types for: Simple lists where 'value' is meaningless
- **USE** sequence types for: Chronology, history, timelines, processes
- **USE** list types for: Non-quantitative collections (features, options, categories)
- **USE** chart types for: Quantitative metrics ONLY (sales, population, %, counts)

**SCHEMA MAPPING (CRITICAL):**
*   **Enhanced Chart types** (bar-*, pie-*, line-*, area-*, radial-bar-*, radar-*, scatter-*, chart-wordcloud):
    *   \`data\` is an **Array**: \`[{ name: string, value: number, ... }]\`
    *   Stacked/multi-series: \`{ name: string, seriesA: number, seriesB: number, ... }\`
    *   Scatter with bubble: \`{ x: number, y: number, z?: number }\`
    *   Word Cloud: \`[{ name: string, value: number }]\` (text size proportional to value)
*   **Legacy chart types** (chart-bar-plain-text, chart-pie-plain-text, chart-line-plain-text):
    *   \`data\` is an **Object**: \`{ title?: string, desc?: string, items: [{ label: string, value: number, desc?: string, icon?: string }] }\`
*   **Very Legacy types** (bar_chart, pie_chart):
    *   \`data\` is an **Array**: \`[{ name: string, value: number }]\`
*   **Comparison types** (compare-binary-*, compare-hierarchy-*, compare-swot, compare-pros-cons, compare-score-card, etc.):
    *   **Binary/Hierarchical**: \`data\` is an **Object**: \`{ title?: string, left: { title: string, items: [...] }, right: { title: string, items: [...] } }\`
    *   **Pros/Cons**: \`data\` is an **Object**: \`{ title?: string, pros: [...], cons: [...] }\`
    *   **Score Card**: \`data\` is an **Object**: \`{ title?: string, items: [{ label, leftScore, leftDesc, rightScore, rightDesc }] }\`
    *   **Triple**: \`data\` is an **Object**: \`{ title?: string, items: [{ label, optionA, optionB, optionC }] }\`
    *   **Feature Table**: \`data\` is an **Object**: \`{ title?: string, features: [{ label, icon, optionA, optionB, optionC }] }\`
    *   **Timeline**: \`data\` is an **Object**: \`{ title?: string, items: [{ label, before, after, change }] }\`
    *   **Metric Gauge**: \`data\` is an **Object**: \`{ title?: string, metrics: [{ label, optionA, optionB }] }\`
    *   **Card Stack**: \`data\` is an **Object**: \`{ title?: string, stacks: [{ label, title, items: [...] }] }\`
    *   **SWOT**: \`data\` is an **Object**: \`{ title?: string, desc?: string, items: [{ label, content }] }\`
*   **Hierarchy types** (hierarchy-tree-*, hierarchy-mindmap-*):
    *   \`data\` is an **Object**: \`{ title?: string, items: [{ label, value?, icon?, children: [...] }] }\` (nested tree structure)
*   **Relation types** (relation-circle-*):
    *   \`data\` is an **Object**: \`{ title?: string, center: string, relations: [{ label, desc?, value? }] }\`
*   **Most other types** (sequence, list, quadrant):
    *   \`data\` is an **Object**: \`{ title?: string, desc?: string, items: [{ label, desc?, value?, icon? }] }\`
*   **Legacy types**: \`process_flow\` uses \`steps\`, \`comparison\` uses \`comparisonItems\`, \`stat_highlight\` uses \`statValue\`

**Process:**
1.  Analyze the topic.
2.  Select multiple distinct angles and **vary the section types**.
3.  Choose the most appropriate **specific subtype** (e.g., for a timeline, use \`sequence-timeline-simple\` or \`sequence-horizontal-zigzag-underline-text\` for variety).
4.  Generate the JSON.

**ICON USAGE (for list, sequence, comparison types):**
- The \`icon\` field accepts lucide-react icon names for visual enhancement.
- Use **simple, descriptive icon names** (lowercase, hyphens for spaces).
- **Supported prefixes (optional)**: \`lucide/\`, \`mdi/\` - will be auto-converted.
- **Common icons**:
  * Tech/AI: \`robot\`, \`brain\`, \`cpu\`, \`code\`, \`database\`, \`server\`
  * Communication: \`chat\`, \`mail\`, \`phone\`, \`send\`
  * Business: \`trending-up\`, \`bar-chart\`, \`dollar\`, \`briefcase\`, \`store\`
  * Users: \`users\`, \`user\`, \`user-plus\`, \`handshake\`
  * Security: \`shield\`, \`shield-check\`, \`lock\`, \`key\`, \`eye\`
  * Actions: \`search\`, \`settings\`, \`zap\`, \`tool\`
  * Files: \`file\`, \`file-text\`, \`folder\`, \`document\`
  * Time: \`clock\`, \`calendar\`, \`timer\`
  * Status: \`check-circle\`, \`alert-circle\`, \`info\`, \`check\`
  * Misc: \`star\`, \`heart\`, \`home\`, \`globe\`, \`rocket\`, \`target\`
- **Example**: \`"icon": "robot"\` or \`"icon": "lucide/brain"\` or \`"icon": "mdi/code"\`
- **If unsure**: Use a descriptive name like \`"icon": "chart"\` - the system will do its best to match it.
- **Optional**: Icons are optional but recommended for visual appeal.

**FEW-SHOW EXAMPLES (Reference for High-Quality Output):**
Study these examples to understand the expected data structure and visual variety:

\`\`\`json
${fewShotPrompt}
\`\`\`

**IMPORTANT: Your output format must be:**
\`\`\`json
{
  "title": "...",
  "summary": "...",
  "sections": [...]
}
\`\`\`

**DO NOT** wrap your response in any outer object like \`infographic_report\`. Output the JSON directly with \`title\`, \`summary\`, and \`sections\` at the root level.

**ANTV SYNTAX REFERENCE (for template selection):**
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

/**
 * Legacy constant for backward compatibility (deprecated)
 * @deprecated Use getCoreSystemInstruction(sectionCount) instead
 */
export const CORE_SYSTEM_INSTRUCTION = getCoreSystemInstruction(5);

/**
 * Get dynamic report schema for Gemini (uses native Schema type)
 * The enum values are fetched dynamically from the section registry
 */
export function getReportSchema(): Schema {
  // Get dynamically registered section types
  const sectionTypes = getSectionTypeSchemaEnum();

  return {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "A catchy, journalistic headline for the infographic report." },
      summary: { type: Type.STRING, description: "A concise executive summary/intro (approx 80-100 words) setting the context." },
      sections: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            type: {
              type: Type.STRING,
              enum: sectionTypes as any,
              description: "The visual component type.",
            },
            title: { type: Type.STRING, description: "Section header." },
            content: { type: Type.STRING, description: "Contextual narrative text." },
            statValue: { type: Type.STRING, description: "ONLY for 'stat_highlight'. The focal number (e.g., '42%', '$10B')." },
            statLabel: { type: Type.STRING, description: "ONLY for 'stat_highlight'. Label for the statistic." },
            statTrend: { type: Type.STRING, enum: ['up', 'down', 'neutral'], description: "Visual trend indicator." },
            data: {
              type: Type.OBJECT,
              description: "Chart/list/comparison data. Format varies by type: Legacy charts (bar_chart/pie_chart) use array, new types use object with items/relations/etc.",
            },
            steps: {
              type: Type.ARRAY,
              description: "REQUIRED for 'process_flow'. Array of {step, title, description}.",
              items: {
                type: Type.OBJECT,
                properties: {
                  step: { type: Type.NUMBER },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING }
                }
              }
            },
            comparisonItems: {
              type: Type.ARRAY,
              description: "REQUIRED for 'comparison'. Array of {label, left, right}.",
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  left: { type: Type.STRING },
                  right: { type: Type.STRING }
                },
                required: ["label", "left", "right"]
              }
            }
          },
          required: ["type", "title"]
        }
      }
    },
    required: ["title", "summary", "sections"]
  };
}

/**
 * Static report schema for Gemini (backward compatibility)
 * Uses the core 6 section types
 * @deprecated Use getReportSchema() for dynamic schema instead
 */
export const REPORT_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "A catchy, journalistic headline for the infographic report." },
    summary: { type: Type.STRING, description: "A concise executive summary/intro (approx 80-100 words) setting the context." },
    sections: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: {
            type: Type.STRING,
            enum: [
              CoreSectionTypes.TEXT,
              CoreSectionTypes.STAT_HIGHLIGHT,
              CoreSectionTypes.BAR_CHART,
              CoreSectionTypes.PIE_CHART,
              CoreSectionTypes.PROCESS_FLOW,
              CoreSectionTypes.COMPARISON
            ],
            description: "The visual component type."
          },
          title: { type: Type.STRING, description: "Section header." },
          content: { type: Type.STRING, description: "Contextual narrative text." },
          statValue: { type: Type.STRING, description: "ONLY for 'stat_highlight'. The focal number (e.g., '42%', '$10B')." },
          statLabel: { type: Type.STRING, description: "ONLY for 'stat_highlight'. Label for the statistic." },
          statTrend: { type: Type.STRING, enum: ['up', 'down', 'neutral'], description: "Visual trend indicator." },
          data: {
            type: Type.OBJECT,
            description: "Chart/list/comparison data. Format varies by type: Legacy charts use array, new types use object.",
          },
          steps: {
            type: Type.ARRAY,
            description: "REQUIRED for 'process_flow'. Array of {step, title, description}.",
            items: {
              type: Type.OBJECT,
              properties: {
                step: { type: Type.NUMBER },
                title: { type: Type.STRING },
                description: { type: Type.STRING }
              }
            }
          },
          comparisonItems: {
            type: Type.ARRAY,
            description: "REQUIRED for 'comparison'. Array of {label, left, right}.",
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                left: { type: Type.STRING },
                right: { type: Type.STRING }
              },
              required: ["label", "left", "right"]
            }
          }
        },
        required: ["type", "title"]
      }
    }
  },
  required: ["title", "summary", "sections"]
};

/**
 * Get dynamic JSON Schema version for non-Gemini providers
 * (OpenAI, DeepSeek, OpenRouter use JSON schema format)
 */
export function getReportJsonSchema(): Record<string, unknown> {
  const sectionTypes = getSectionTypeSchemaEnum();

  return {
    type: "object",
    properties: {
      title: { type: "string", description: "A catchy, journalistic headline for the infographic report." },
      summary: { type: "string", description: "A concise executive summary/intro (approx 80-100 words) setting the context." },
      sections: {
        type: "array",
        items: {
          type: "object",
          properties: {
            type: {
              type: "string",
              enum: sectionTypes,
              description: "The visual component type."
            },
            title: { type: "string", description: "Section header." },
            content: { type: "string", description: "Contextual narrative text." },
            statValue: { type: "string", description: "ONLY for 'stat_highlight'. The focal number (e.g., '42%', '$10B')." },
            statLabel: { type: "string", description: "ONLY for 'stat_highlight'. Label for the statistic." },
            statTrend: { type: "string", enum: ['up', 'down', 'neutral'], description: "Visual trend indicator." },
            data: {
              type: "object",
              description: "Chart/list/comparison data. Format varies by type: Legacy charts (bar_chart/pie_chart) use array, new types use object with items/relations/etc.",
            },
            steps: {
              type: "array",
              description: "REQUIRED for 'process_flow'. Array of {step, title, description}.",
              items: {
                type: "object",
                properties: {
                  step: { type: "number" },
                  title: { type: "string" },
                  description: { type: "string" }
                }
              }
            },
            comparisonItems: {
              type: "array",
              description: "REQUIRED for 'comparison'. Array of {label, left, right}.",
              items: {
                type: "object",
                properties: {
                  label: { type: "string" },
                  left: { type: "string" },
                  right: { type: "string" }
                },
                required: ["label", "left", "right"]
              }
            }
          },
          required: ["type", "title"]
        }
      }
    },
    required: ["title", "summary", "sections"]
  };
}

/**
 * Static JSON Schema version for non-Gemini providers
 * @deprecated Use getReportJsonSchema() for dynamic schema instead
 */
export const REPORT_JSON_SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string", description: "A catchy, journalistic headline for the infographic report." },
    summary: { type: "string", description: "A concise executive summary/intro (approx 80-100 words) setting the context." },
    sections: {
      type: "array",
      items: {
        type: "object",
        properties: {
          type: {
            type: "string",
            enum: ["text", "stat_highlight", "bar_chart", "pie_chart", "process_flow", "comparison"],
            description: "The visual component type."
          },
          title: { type: "string", description: "Section header." },
          content: { type: "string", description: "Contextual narrative text." },
          statValue: { type: "string", description: "ONLY for 'stat_highlight'. The focal number (e.g., '42%', '$10B')." },
          statLabel: { type: "string", description: "ONLY for 'stat_highlight'. Label for the statistic." },
          statTrend: { type: "string", enum: ['up', 'down', 'neutral'], description: "Visual trend indicator." },
          data: {
            type: "object",
            description: "Chart/list/comparison data. Format varies by type: Legacy charts use array, new types use object.",
          },
          steps: {
            type: "array",
            description: "REQUIRED for 'process_flow'. Array of {step, title, description}.",
            items: {
              type: "object",
              properties: {
                step: { type: "number" },
                title: { type: "string" },
                description: { type: "string" }
              }
            }
          },
          comparisonItems: {
            type: "array",
            description: "REQUIRED for 'comparison'. Array of {label, left, right}.",
            items: {
              type: "object",
              properties: {
                label: { type: "string" },
                left: { type: "string" },
                right: { type: "string" }
              },
              required: ["label", "left", "right"]
            }
          }
        },
        required: ["type", "title"]
      }
    }
  },
  required: ["title", "summary", "sections"]
};

/**
 * Language-specific instructions for infographic generation
 */
const LANGUAGE_INSTRUCTIONS: Record<Language, string> = {
  en: `

**IMPORTANT - LANGUAGE REQUIREMENT:**
You MUST output ALL content in **English**.
This includes:
- Report title and summary
- All section titles and content
- All chart labels, data names, and descriptions
- All step titles and process flow descriptions
- All comparison items and labels

The user speaks English and expects the entire infographic report in English.`,
  zh: `

**IMPORTANT - LANGUAGE REQUIREMENT:**
You MUST output ALL content in **Chinese (Simplified)**.
This includes:
- Report title and summary
- All section titles and content
- All chart labels, data names, and descriptions
- All step titles and process flow descriptions
- All comparison items and labels

The user speaks Chinese and expects the entire infographic report in Chinese.`,
  ja: `

**IMPORTANT - LANGUAGE REQUIREMENT:**
You MUST output ALL content in **Japanese**.
This includes:
- Report title and summary
- All section titles and content
- All chart labels, data names, and descriptions
- All step titles and process flow descriptions
- All comparison items and labels

The user speaks Japanese and expects the entire infographic report in Japanese.`,
  ko: `

**IMPORTANT - LANGUAGE REQUIREMENT:**
You MUST output ALL content in **Korean**.
This includes:
- Report title and summary
- All section titles and content
- All chart labels, data names, and descriptions
- All step titles and process flow descriptions
- All comparison items and labels

The user speaks Korean and expects the entire infographic report in Korean.`,
  es: `

**IMPORTANTE - REQUISITO DE IDIOMA:**
Debes generar TODO el contenido en **español**.
Esto incluye:
- Título y resumen del informe
- Todos los títulos y contenido de las secciones
- Todas las etiquetas de gráficos, nombres de datos y descripciones
- Todos los títulos de pasos y descripciones de flujo de procesos
- Todos los elementos de comparación y etiquetas

El usuario habla español y espera todo el informe de infografía en español.`,
  fr: `

**IMPORTANT - EXIGENCE DE LANGUE :**
Vous devez produire TOUT le contenu en **français**.
Cela inclut :
- Titre et résumé du rapport
- Tous les titres et contenus des sections
- Toutes les étiquettes de graphiques, noms de données et descriptions
- Tous les titres d'étapes et descriptions de flux de processus
- Tous les éléments de comparaison et étiquettes

L'utilisateur parle français et s'attend à ce que tout le rapport de l'infographie soit en français.`,
  de: `

**WICHTIG - SPRACHANFORDERUNG:**
Sie müssen ALLE Inhalte auf **Deutsch** ausgeben.
Dies gilt für:
- Berichtstitel und Zusammenfassung
- Alle Abschnittstitel und Inhalte
- Alle Diagrammbeschriftungen, Datennamen und Beschreibungen
- Alle Schritttitel und Prozessflussbeschreibungen
- Alle Vergleichselemente und Beschriftungen

Der Benutzer spricht Deutsch und erwartet den gesamten Infografik-Bericht auf Deutsch.`,
  pt: `

**IMPORTANTE - REQUISITO DE IDIOMA:**
Você deve produzir TODO o conteúdo em **português**.
Isso inclui:
- Título e resumo do relatório
- Todos os títulos e conteúdos das seções
- Todos os rótulos de gráficos, nomes de dados e descrições
- Todos os títulos de etapas e descrições de fluxo de processo
- Todos os itens de comparação e rótulos

O usuário fala português e espera todo o relatório de infográfico em português.`,
};

/**
 * Get localized system instruction for a specific language
 * @param language - Target language
 * @param sectionCount - Number of sections to generate (default: 5)
 * @param includeFewShot - Whether to include few-shot examples (default: true)
 * @returns System instruction with language-specific guidance
 */
export function getLocalizedSystemInstruction(language: Language = 'en', sectionCount: number = 5, includeFewShot: boolean = true): string {
  const languageInstruction = LANGUAGE_INSTRUCTIONS[language] || '';
  return getCoreSystemInstruction(sectionCount, includeFewShot) + languageInstruction;
}

/**
 * Get language name in native format for display
 */
export function getLanguageName(code: Language): string {
  const names: Record<Language, string> = {
    en: 'English',
    zh: '中文 (Simplified)',
    ja: '日本語',
    ko: '한국어',
    es: 'Español',
    fr: 'Français',
    de: 'Deutsch',
    pt: 'Português',
  };
  return names[code] || 'English';
}

