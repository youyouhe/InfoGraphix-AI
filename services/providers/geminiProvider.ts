import { GoogleGenAI } from "@google/genai";
import { InfographicReport } from "../../types";
import { LLMProvider, ProviderConfig, GenerationOptions } from "../types";
import { parsePartialJson } from "../utils/jsonParser";
import { CORE_SYSTEM_INSTRUCTION, getReportSchema, REPORT_SCHEMA } from "../prompts/systemPrompt";
import { registerCoreSectionTypes } from "../registry/coreSections";

/**
 * Gemini AI Provider
 * Uses Google's Gemini API with native structured output and search grounding
 */
export class GeminiProvider implements LLMProvider {
  name = 'gemini';
  displayName = 'Google Gemini';
  defaultModel = 'gemini-2.0-flash-exp'; // Updated to use newer model
  supportsSearch = true;

  private ai: GoogleGenAI;
  private apiKey: string;

  constructor(config: ProviderConfig) {
    this.apiKey = config.apiKey;
    if (!this.apiKey) {
      throw new Error('Gemini API key is required');
    }
    this.ai = new GoogleGenAI({ apiKey: this.apiKey });
  }

  async generateInfographic(
    input: string,
    onStreamUpdate?: (partial: InfographicReport) => void,
    options?: GenerationOptions
  ): Promise<InfographicReport> {
    // Ensure core types are registered
    registerCoreSectionTypes();

    // Track the last valid partial object to fallback if the final stream is cut off
    let lastValidPartial: InfographicReport | null = null;

    try {
      const model = options?.model || (options?.maxTokens ? 'gemini-2.5-pro' : this.defaultModel);

      // Use dynamic schema based on registered types
      const reportSchema = getReportSchema();

      const response = await this.ai.models.generateContentStream({
        model: model,
        contents: `Create an infographic report for: "${input}"`,
        config: {
          systemInstruction: CORE_SYSTEM_INSTRUCTION,
          ...(options?.enableSearch !== false && { tools: [{ googleSearch: {} }] }),
          responseMimeType: "application/json",
          responseSchema: reportSchema,
          maxOutputTokens: options?.maxTokens || 4000,
        }
      });

      let fullText = '';
      let sources: { title: string; uri: string }[] = [];

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

        // 2. If valid partial exists, use that
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
  }
}
