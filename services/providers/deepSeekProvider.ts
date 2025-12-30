import OpenAI from "openai";
import { InfographicReport } from "../../types";
import { LLMProvider, ProviderConfig, GenerationOptions } from "../types";
import { parsePartialJson } from "../utils/jsonParser";
import { CORE_SYSTEM_INSTRUCTION } from "../prompts/systemPrompt";
import { registerCoreSectionTypes } from "../registry/coreSections";

/**
 * DeepSeek Provider
 * Uses DeepSeek API (compatible with OpenAI SDK)
 * Does NOT support native search
 */
export class DeepSeekProvider implements LLMProvider {
  name = 'deepseek';
  displayName = 'DeepSeek';
  defaultModel = 'deepseek-chat';
  supportsSearch = false;

  private client: OpenAI;

  constructor(config: ProviderConfig) {
    if (!config.apiKey) {
      throw new Error('DeepSeek API key is required');
    }

    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseUrl || 'https://api.deepseek.com',
      dangerouslyAllowBrowser: true,  // Allow browser usage for this demo app
    });
  }

  async generateInfographic(
    input: string,
    onStreamUpdate?: (partial: InfographicReport) => void,
    options?: GenerationOptions
  ): Promise<InfographicReport> {
    // Ensure core types are registered
    registerCoreSectionTypes();

    // Retry logic: up to 3 attempts
    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`[DeepSeek Provider] Attempt ${attempt}/${maxRetries}`);

        let lastValidPartial: InfographicReport | null = null;

        // Debug: Log the request
        console.log(`[DeepSeek Provider] Request:`, {
          model: options?.maxTokens ? 'deepseek-reasoner' : (options?.model || this.defaultModel),
          systemPromptLength: CORE_SYSTEM_INSTRUCTION.length,
          userPrompt: input,
        });

        const stream = await this.client.chat.completions.create({
          model: options?.maxTokens ? 'deepseek-reasoner' : (options?.model || this.defaultModel),
          messages: [
            {
              role: 'system',
              content: CORE_SYSTEM_INSTRUCTION,
            },
            {
              role: 'user',
              content: `Create an infographic report for: "${input}"`,
            },
          ],
          response_format: { type: 'json_object' },
          stream: true,
          max_tokens: options?.maxTokens || 4000,
        });

        let fullText = '';

        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            fullText += content;

            // Attempt to parse partially
            const partial = parsePartialJson(fullText);
            if (partial && partial.title && Array.isArray(partial.sections)) {
              lastValidPartial = partial as InfographicReport;
              if (onStreamUpdate) {
                onStreamUpdate(partial as InfographicReport);
              }
            }
          }
        }

        // Final parse strategy
        let finalData: InfographicReport;

        try {
          finalData = JSON.parse(fullText) as InfographicReport;
        } catch (e) {
          console.warn("Final JSON parse failed, attempting partial recovery...", e);
          if (lastValidPartial) {
            finalData = lastValidPartial;
          } else {
            const fixed = parsePartialJson(fullText);
            if (fixed) {
              finalData = fixed as InfographicReport;
            } else {
              throw new Error("Failed to generate valid JSON report.");
            }
          }
        }

        // Success! Return the data
        console.log(`[DeepSeek Provider] Success on attempt ${attempt}/${maxRetries}`);
        return finalData;

      } catch (error) {
        console.error(`[DeepSeek Provider] Attempt ${attempt}/${maxRetries} failed:`, error);
        lastError = error as Error;

        // If this is the last attempt, throw the error
        if (attempt === maxRetries) {
          console.error("[DeepSeek Provider] All attempts failed.");
          throw new Error(`Failed after ${maxRetries} attempts. Last error: ${lastError.message}`);
        }

        // Wait a bit before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }

    // This should never be reached, but TypeScript needs it
    throw lastError || new Error("Unknown error in DeepSeek Provider");
  }
}
