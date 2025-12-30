import { LLMProvider, ProviderConfig, ProviderInfo } from "./types";
import { GeminiProvider } from "./providers/geminiProvider";
import { DeepSeekProvider } from "./providers/deepSeekProvider";
import { OpenRouterProvider } from "./providers/openRouterProvider";
import { OpenAIProvider } from "./providers/openAIProvider";

/**
 * Get provider configuration from environment variables
 */
export function getProviderConfig(providerId: string): ProviderConfig {
  const apiKey = getApiKey(providerId);

  return {
    apiKey,
    model: undefined, // Use provider's default model
  };
}

/**
 * Storage key prefix for API keys in localStorage
 */
const STORAGE_KEY_PREFIX = 'infographix_apikey_';

/**
 * Get API key for a specific provider
 * Priority: localStorage > environment variables
 */
function getApiKey(providerId: string): string {
  // 1. Try localStorage first
  const storageKey = `${STORAGE_KEY_PREFIX}${providerId}`;
  const storedKey = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;

  if (storedKey) {
    return storedKey;
  }

  // 2. Fallback to environment variables
  const envKey = getEnvKeyName(providerId);
  const apiKey =
    (process.env[envKey] as string) ||
    (process.env[`${providerId.toUpperCase()}_API_KEY`] as string);

  if (!apiKey) {
    throw new Error(`API key for ${providerId} is missing. Set ${envKey} in .env.local or enter it in the UI.`);
  }

  return apiKey;
}

/**
 * Save API key to localStorage
 * @param providerId - Provider identifier
 * @param apiKey - API key to save
 */
export function saveApiKey(providerId: string, apiKey: string): void {
  if (typeof window === 'undefined') {
    console.warn('[Factory] Window not available, skipping localStorage save');
    return;
  }

  const storageKey = `${STORAGE_KEY_PREFIX}${providerId}`;
  localStorage.setItem(storageKey, apiKey);
  console.log(`[Factory] Saved API key for ${providerId} to localStorage`);
}

/**
 * Get API key from localStorage
 * @param providerId - Provider identifier
 * @returns API key or null if not found
 */
export function getStoredApiKey(providerId: string): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const storageKey = `${STORAGE_KEY_PREFIX}${providerId}`;
  return localStorage.getItem(storageKey);
}

/**
 * Clear API key from localStorage
 * @param providerId - Provider identifier
 */
export function clearApiKey(providerId: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  const storageKey = `${STORAGE_KEY_PREFIX}${providerId}`;
  localStorage.removeItem(storageKey);
  console.log(`[Factory] Cleared API key for ${providerId} from localStorage`);
}

/**
 * Get environment variable name for a provider's API key
 */
function getEnvKeyName(providerId: string): string {
  switch (providerId) {
    case 'gemini':
      return 'GEMINI_API_KEY';
    case 'deepseek':
      return 'DEEPSEEK_API_KEY';
    case 'openrouter':
      return 'OPENROUTER_API_KEY';
    case 'openai':
      return 'OPENAI_API_KEY';
    default:
      return `${providerId.toUpperCase()}_API_KEY`;
  }
}

/**
 * LLM Service Factory
 * Creates provider instances based on provider ID
 */
export class LLMServiceFactory {
  /**
   * Create a provider instance
   * @param providerId - Provider identifier (gemini, deepseek, openrouter, openai)
   * @param config - Optional provider configuration (defaults to env vars)
   * @returns LLM Provider instance
   */
  static create(providerId: string, config?: ProviderConfig): LLMProvider {
    const providerConfig = config || getProviderConfig(providerId);

    switch (providerId) {
      case 'gemini':
        return new GeminiProvider(providerConfig);
      case 'deepseek':
        return new DeepSeekProvider(providerConfig);
      case 'openrouter':
        return new OpenRouterProvider(providerConfig);
      case 'openai':
        return new OpenAIProvider(providerConfig);
      default:
        throw new Error(`Unknown provider: ${providerId}. Available providers: gemini, deepseek, openrouter, openai`);
    }
  }

  /**
   * Get list of available providers
   * @returns Array of provider information
   */
  static getAvailableProviders(): ProviderInfo[] {
    return [
      {
        id: 'gemini',
        name: 'Google Gemini',
        defaultModel: 'gemini-2.0-flash-exp',
        supportsSearch: true,
      },
      {
        id: 'deepseek',
        name: 'DeepSeek',
        defaultModel: 'deepseek-chat',
        supportsSearch: false,
      },
      {
        id: 'openrouter',
        name: 'OpenRouter',
        defaultModel: 'google/gemini-2.5-flash',
        supportsSearch: false,
      },
      {
        id: 'openai',
        name: 'OpenAI',
        defaultModel: 'gpt-4o-mini',
        supportsSearch: false,
      },
    ];
  }

  /**
   * Get available models for a specific provider
   * @param providerId - Provider identifier
   * @returns Array of available models
   */
  static getAvailableModels(providerId: string): { id: string; name: string; free?: boolean }[] {
    const models: Record<string, { id: string; name: string; free?: boolean }[]> = {
      openrouter: [
        { id: 'google/gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
        { id: 'google/gemini-3-flash-preview', name: 'Gemini 3 Flash Preview' },
        { id: 'x-ai/grok-4.1-fast', name: 'Grok 4.1 Fast' },
        { id: 'google/gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash Lite' },
        { id: 'google/gemini-2.0-flash-001', name: 'Gemini 2.0 Flash' },
        { id: 'google/gemini-3-pro-preview', name: 'Gemini 3 Pro Preview' },
        { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini' },
        { id: 'openai/gpt-4o', name: 'GPT-4o' },
        { id: 'openai/o1-mini', name: 'o1-mini' },
        { id: 'qwen/qwen-2.5-72b-instruct', name: 'Qwen 2.5 72B' },
        { id: 'qwen/qwen3-vl-235b-a22b-instruct', name: 'Qwen 3 VL' },
        { id: 'meta-llama/llama-4-maverick', name: 'Llama 4 Maverick' },
        { id: 'meta-llama/llama-3.1-70b-instruct', name: 'Llama 3.1 70B' },
        { id: 'microsoft/phi-3-medium-128k-instruct', name: 'Phi-3 Medium' },
        { id: 'deepseek/deepseek-chat', name: 'DeepSeek Chat' },
        { id: 'deepseek/deepseek-reasoner', name: 'DeepSeek Reasoner' },
      ],
      gemini: [
        { id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash (Default)' },
        { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro' },
        { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
      ],
      deepseek: [
        { id: 'deepseek-chat', name: 'DeepSeek Chat (Default)' },
        { id: 'deepseek-reasoner', name: 'DeepSeek Reasoner' },
      ],
      openai: [
        { id: 'gpt-4o-mini', name: 'GPT-4o Mini (Default)' },
        { id: 'gpt-4o', name: 'GPT-4o' },
        { id: 'gpt-4o-2024-11-20', name: 'GPT-4o (Latest)' },
        { id: 'o1-mini', name: 'o1-mini' },
      ],
    };

    return models[providerId] || [];
  }

  /**
   * Get default provider from environment variable
   * @returns Default provider ID
   */
  static getDefaultProvider(): string {
    return process.env.DEFAULT_PROVIDER || 'gemini';
  }

  /**
   * Check if a provider has its API key configured
   * @param providerId - Provider identifier
   * @returns True if API key is available
   */
  static hasApiKey(providerId: string): boolean {
    try {
      getApiKey(providerId);
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Backward compatibility: standalone function using Gemini provider
 * @deprecated Use LLMServiceFactory.create() instead
 */
export async function generateInfographic(
  input: string,
  onStreamUpdate?: (partial: import("../../types").InfographicReport) => void
): Promise<import("../../types").InfographicReport> {
  const provider = LLMServiceFactory.create('gemini');
  return provider.generateInfographic(input, onStreamUpdate);
}
