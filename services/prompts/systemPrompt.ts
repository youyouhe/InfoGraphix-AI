import { Type, Schema } from "@google/genai";
import { CoreSectionTypes } from "../../types";
import { getSectionTypeSchemaEnum } from "../registry/sectionRegistry";
import { getEnhancedSystemInstruction } from "./fewShotExamples";
import { Language } from "../../i18n";

/**
 * Core system instruction for infographic generation
 * Works across all LLM providers
 * @param sectionCount - Number of sections to generate (default: 5)
 */
export function getCoreSystemInstruction(sectionCount: number = 5): string {
  return `
You are an expert Information Designer and Data Journalist.

**Your Goal:**
Transform the user's input into a visually compelling "Infographic Report".

**STRICT GENERATION RULES:**
1.  **Section Count:** Generate exactly **${sectionCount} sections** to thoroughly cover the topic.
2.  **No Loops:** Do not repeat similar sections. Cover different aspects (History, Economics, Technology, Future).
3.  **Data Quantity Requirements:**
    *   bar_chart/pie_chart: Include at least **5-8 data points**. More data = better visualization.
    *   process_flow: Include at least **4-6 steps**. Cover the complete journey.
    *   comparison: Include at least **4-6 comparison items**.
4.  **Data Integrity:**
    *   **NEVER** output empty arrays (e.g., \`"data": []\`).
    *   **NEVER** output empty objects (e.g., \`"steps": [{}]\`).
    *   If you lack exact numbers, make reasonable, educated estimates based on history.

**CRITICAL: CHART TYPE SELECTION GUIDELINES**
You must strictly follow these rules to avoid incorrect visualizations:

1. **⛔ DO NOT use chart types for:**
   - **Years or Dates** (e.g., "2020", "221 BC", "1990s"). Time is a dimension, not a metric.
   - **Dynasty or Era Names** (e.g., "Qin Dynasty", "Roman Empire") unless comparing a specific numerical metric like population.
   - **Simple Lists** (e.g., "Top 5 Technologies") where the 'value' is arbitrary or meaningless.

2. **✅ USE 'sequence-timeline-simple' for:**
   - **History & Chronology**: displaying events over years or dynasties (e.g., "History of China", "Company Timeline").
   - **Timeline with labels**: Format: { title, data: { title, items: [{ label, desc }] }}
   - **Process & Flow**: displaying step-by-step procedures (e.g., "How to register", "Product Lifecycle").
     -> Use: 'process_flow' with steps array

3. **✅ USE 'text' type for:**
   - **Non-quantitative collections**: features, benefits, team members, or options where there are no stats.
   - Use the 'content' field to describe these items in narrative format.

4. **✅ USE 'bar_chart' or 'pie_chart' ONLY for:**
   - **Quantitative Metrics**: Sales, Population, Percentages, Counts, Revenue, etc.
   - **Requirement**: You MUST have a valid numerical 'value' for every item.

**SCHEMA MAPPING (CRITICAL):**
*   If \`type\` is **'comparison'**:
    *   REQUIRED: \`comparisonItems\` (Array of { label, left, right }).
    *   FORBIDDEN: \`data\`, \`steps\`, \`statValue\`.
*   If \`type\` is **'process_flow'**:
    *   REQUIRED: \`steps\` (Array of { step, title, description }).
    *   FORBIDDEN: \`data\`, \`comparisonItems\`.
*   If \`type\` is **'sequence-timeline-simple'**:
    *   REQUIRED: \`data\` (Object with { title, items: [{ label, desc }] }).
    *   FORBIDDEN: \`steps\`, \`comparisonItems\`, \`statValue\`.
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
 * @returns System instruction with language-specific guidance
 */
export function getLocalizedSystemInstruction(language: Language = 'en', sectionCount: number = 5): string {
  const languageInstruction = LANGUAGE_INSTRUCTIONS[language] || '';
  return getCoreSystemInstruction(sectionCount) + languageInstruction;
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

