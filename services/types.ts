import { InfographicReport } from '../types';
import { Language } from '../i18n';

/**
 * Provider configuration
 */
export interface ProviderConfig {
  apiKey: string;
  model?: string;
  baseUrl?: string;
  supportsSearch?: boolean;
}

/**
 * Generation options for LLM providers
 */
export interface GenerationOptions {
  enableSearch?: boolean;
  maxTokens?: number;
  model?: string;  // Override the default model
  language?: Language;  // Output language for the report
}

/**
 * LLM Provider interface
 * All providers must implement this interface
 */
export interface LLMProvider {
  /** Unique provider identifier */
  name: string;
  /** Display name for UI */
  displayName: string;
  /** Default model to use */
  defaultModel: string;
  /** Whether this provider supports search functionality */
  supportsSearch: boolean;

  /**
   * Generate an infographic report
   * @param input - User's topic/query
   * @param onStreamUpdate - Optional callback for streaming updates
   * @param options - Optional generation settings
   * @returns Complete infographic report
   */
  generateInfographic(
    input: string,
    onStreamUpdate?: (partial: InfographicReport) => void,
    options?: GenerationOptions
  ): Promise<InfographicReport>;
}

/**
 * Provider information for UI display
 */
export interface ProviderInfo {
  id: string;
  name: string;
  defaultModel: string;
  supportsSearch?: boolean;
}
