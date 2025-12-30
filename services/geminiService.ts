import { GoogleGenAI, Type, Schema } from "@google/genai";
import { InfographicReport, SectionType } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const REPORT_SCHEMA: Schema = {
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
              SectionType.TEXT, 
              SectionType.STAT_HIGHLIGHT, 
              SectionType.BAR_CHART, 
              SectionType.PIE_CHART,
              SectionType.PROCESS_FLOW,
              SectionType.COMPARISON
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

const FEW_SHOT_EXAMPLES = `
**FEW-SHOT EXAMPLES:**

**User Input:** "Electric Vehicle Sales Market Share 2023"

**Model Output:**
{
  "title": "The Electric Revolution: EV Market Share 2023",
  "summary": "Electric vehicles (EVs) have crossed a critical tipping point in 2023...",
  "sections": [
    {
      "type": "stat_highlight",
      "title": "Global Growth",
      "statValue": "18%",
      "statLabel": "Global EV Market Share",
      "statTrend": "up"
    },
    {
      "type": "bar_chart",
      "title": "Top EV Manufacturers",
      "content": "BYD and Tesla continue to dominate...",
      "data": [
        { "name": "BYD", "value": 3.02 },
        { "name": "Tesla", "value": 1.81 }
      ]
    },
    {
      "type": "comparison",
      "title": "BEV vs PHEV Technology",
      "content": "A look at the two main drive trains.",
      "comparisonItems": [
         { "label": "Power Source", "left": "Battery Only", "right": "Battery + Gas Engine" },
         { "label": "Range (Electric)", "left": "300+ miles", "right": "20-50 miles" }
      ]
    }
  ]
}
`;

const SYSTEM_INSTRUCTION = `
You are an expert Information Designer and Data Journalist.

**Your Goal:**
Transform the user's input into a visually compelling "Infographic Report".

**STRICT GENERATION RULES:**
1.  **Section Count:** Generate exactly **5 to 7** high-quality sections. **STOP** after 7 sections.
2.  **No Loops:** Do not repeat similar sections. Cover different aspects (History, Economics, Technology, Future).
3.  **Data Integrity:**
    *   **NEVER** output empty arrays (e.g., \`"data": []\`).
    *   **NEVER** output empty objects (e.g., \`"steps": [{}]\`).
    *   If you lack exact numbers, make reasonable, educated estimates based on history.

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

**Process:**
1.  Analyze the topic.
2.  Select 5-7 distinct angles.
3.  Generate the JSON.

${FEW_SHOT_EXAMPLES}
`;

// Helper to parse partial JSON for streaming
const parsePartialJson = (jsonStr: string): any => {
  // If empty, return null
  if (!jsonStr.trim()) return null;

  let stack: string[] = [];
  let inString = false;
  let isEscaped = false;
  
  // Copy to avoid modifying original during iteration
  let processed = jsonStr;

  // Track state to close brackets/braces
  for (let i = 0; i < processed.length; i++) {
    const char = processed[i];
    
    if (isEscaped) {
      isEscaped = false;
      continue;
    }
    if (char === '\\') {
      isEscaped = true;
      continue;
    }
    if (char === '"') {
      inString = !inString;
      continue;
    }
    
    if (!inString) {
      if (char === '{') stack.push('}');
      else if (char === '[') stack.push(']');
      else if (char === '}' || char === ']') {
        if (stack.length > 0 && stack[stack.length - 1] === char) {
          stack.pop();
        }
      }
    }
  }

  // Attempt to repair the JSON string
  let fixed = processed;
  
  if (inString) {
    fixed += '"';
    inString = false;
  }
  
  // Aggressively clean up trailing characters that prevent valid JSON
  fixed = fixed.trimEnd();
  
  // Simple fix: Remove trailing comma
  if (fixed.endsWith(',')) {
    fixed = fixed.slice(0, -1);
  }
  // Handle colon: "key": -> "key": null
  if (fixed.endsWith(':')) {
    fixed += ' null';
  }

  // Close all open structures
  while (stack.length > 0) {
    fixed += stack.pop();
  }

  try {
    return JSON.parse(fixed);
  } catch (e) {
    return null;
  }
};

export const generateInfographic = async (
  input: string, 
  onStreamUpdate?: (partial: InfographicReport) => void
): Promise<InfographicReport> => {
  if (!apiKey) throw new Error("API Key is missing");

  // Track the last valid partial object to fallback if the final stream is cut off
  let lastValidPartial: InfographicReport | null = null;

  try {
    const response = await ai.models.generateContentStream({
      model: 'gemini-3-pro-preview',
      contents: `Create an infographic report for: "${input}"`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: REPORT_SCHEMA,
        maxOutputTokens: 4000, 
      }
    });

    let fullText = '';
    let sources: any[] = [];

    for await (const chunk of response) {
      const text = chunk.text;
      if (text) {
        fullText += text;
        
        // Attempt to parse partially
        const partial = parsePartialJson(fullText);
        if (partial && partial.title && Array.isArray(partial.sections)) {
          lastValidPartial = partial as InfographicReport;
          if (onStreamUpdate) {
            onStreamUpdate(partial as InfographicReport);
          }
        }
      }

      // Collect grounding metadata from chunks if available
      const chunkSources = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks
        ?.map((chunk: any) => chunk.web ? { title: chunk.web.title, uri: chunk.web.uri } : null)
        .filter((s: any) => s !== null);
        
      if (chunkSources) {
        sources = [...sources, ...chunkSources];
      }
    }

    // Final parse strategy
    let finalData: InfographicReport;

    try {
      // 1. Try perfect parse
      finalData = JSON.parse(fullText) as InfographicReport;
    } catch (e) {
      console.warn("Final JSON parse failed, attempting partial recovery...", e);
      
      // 2. If valid partial exists, use that (it's the safest bet for truncated data)
      if (lastValidPartial) {
        finalData = lastValidPartial;
      } else {
        // 3. Last ditch effort: Try to fix the full text one last time
        const fixed = parsePartialJson(fullText);
        if (fixed) {
          finalData = fixed as InfographicReport;
        } else {
           throw new Error("Failed to generate valid JSON report. The model output was likely incomplete.");
        }
      }
    }
    
    // De-duplicate sources
    const uniqueSources = sources.filter((v, i, a) => a.findIndex(t => (t.uri === v.uri)) === i);

    return { ...finalData, sources: uniqueSources.length > 0 ? uniqueSources : undefined };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};