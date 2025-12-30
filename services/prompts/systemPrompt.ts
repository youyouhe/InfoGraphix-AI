import { Type, Schema } from "@google/genai";
import { CoreSectionTypes } from "../../types";
import { getSectionTypeSchemaEnum } from "../registry/sectionRegistry";
import { getEnhancedSystemInstruction } from "./fewShotExamples";

/**
 * Core system instruction for infographic generation
 * Works across all LLM providers
 */
export const CORE_SYSTEM_INSTRUCTION = `
You are an expert Information Designer and Data Journalist.

**Your Goal:**
Transform the user's input into a visually compelling "Infographic Report".

**STRICT GENERATION RULES:**
1.  **Section Count:** Generate as many sections as needed to thoroughly cover the topic. 
2.  **No Loops:** Do not repeat similar sections. Cover different aspects (History, Economics, Technology, Future).
3.  **Data Quantity Requirements:**
    *   bar_chart/pie_chart: Include at least **5-8 data points**. More data = better visualization.
    *   process_flow: Include at least **4-6 steps**. Cover the complete journey.
    *   comparison: Include at least **4-6 comparison items**.
4.  **Data Integrity:**
    *   **NEVER** output empty arrays (e.g., \`"data": []\`).
    *   **NEVER** output empty objects (e.g., \`"steps": [{}]\`).
    *   If you lack exact numbers, make reasonable, educated estimates based on history.

**CHART TYPE SELECTION GUIDELINES (CRITICAL):**
*   **DO NOT** use bar_chart/pie_chart for:
    - Years or dates (e.g., "221 BC", "-27", "2020年")
    - Dynasty names (e.g., "秦朝", "汉朝")
    - Non-quantitative data
*   **USE** bar_chart/pie_chart ONLY for:
    - Quantitative metrics (sales, population, percentages, counts)
*   **USE** text for:
    - Lists of events with dates
    - Timeline narratives
*   **USE** process_flow for:
    - Sequential events over time
    - Historical developments

**SCHEMA MAPPING (CRITICAL):**
*   If \`type\` is **'comparison'**:
    *   REQUIRED: \`comparisonItems\` (Array of { label, left, right }).
    *   FORBIDDEN: \`data\`, \`steps\`, \`statValue\`.
*   If \`type\` is **'process_flow'**:
    *   REQUIRED: \`steps\` (Array of { step, title, description }).
    *   FORBIDDEN: \`data\`, \`comparisonItems\`.
*   If \`type\` is **'bar_chart'** or **'pie_chart'**:
    *   REQUIRED: \`data\` (Array of { name, value }).
    *   FORBIDDEN: \`comparisonItems\`, \`steps\`.
*   If \`type\` is **'stat_highlight'**:
    *   REQUIRED: \`statValue\`, \`statLabel\`.
    *   FORBIDDEN: \`data\`, \`steps\`, \`comparisonItems\`.

**Process:**
1.  Analyze the topic.
2.  Select multiple distinct angles.
3.  Generate the JSON.

${getEnhancedSystemInstruction()}
`;

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
              type: Type.ARRAY,
              description: "REQUIRED for 'bar_chart'/'pie_chart'. Array of {name, value}.",
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  value: { type: Type.NUMBER }
                },
                required: ["name", "value"]
              }
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
            type: Type.ARRAY,
            description: "REQUIRED for 'bar_chart'/'pie_chart'. Array of {name, value}.",
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                value: { type: Type.NUMBER }
              },
              required: ["name", "value"]
            }
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
              type: "array",
              description: "REQUIRED for 'bar_chart'/'pie_chart'. Array of {name, value}.",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  value: { type: "number" }
                },
                required: ["name", "value"]
              }
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
            type: "array",
            description: "REQUIRED for 'bar_chart'/'pie_chart'. Array of {name, value}.",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                value: { type: "number" }
              },
              required: ["name", "value"]
            }
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
