export interface ApiKeys {
  gemini: string;
  deepseek: string;
  openrouter: string;
  openai: string;
}

export interface AppSettings {
  apiKeys: ApiKeys;
  defaultProvider: string;
}

/**
 * Check if running in Tauri desktop environment
 */
function isTauri(): boolean {
  return typeof window !== 'undefined' && '__TAURI__' in window;
}

// localStorage key prefixes
const LS_API_KEY_PREFIX = 'infographix_apikey_';
const LS_DEFAULT_PROVIDER = 'infographix_default_provider';

/**
 * Get API keys from either Tauri store or localStorage
 */
export async function getApiKeys(): Promise<ApiKeys> {
  if (isTauri()) {
    try {
      const { Store } = await import('@tauri-apps/plugin-store');
      const store = await Store.load('settings.json');
      const keys = await Promise.all([
        store.get<string>('gemini_key'),
        store.get<string>('deepseek_key'),
        store.get<string>('openrouter_key'),
        store.get<string>('openai_key'),
      ]);

      return {
        gemini: keys[0] || '',
        deepseek: keys[1] || '',
        openrouter: keys[2] || '',
        openai: keys[3] || '',
      };
    } catch (e) {
      console.warn('[apiKeyStore] Tauri store failed, falling back to localStorage:', e);
    }
  }

  // Fallback to localStorage
  return {
    gemini: localStorage.getItem(LS_API_KEY_PREFIX + 'gemini') || '',
    deepseek: localStorage.getItem(LS_API_KEY_PREFIX + 'deepseek') || '',
    openrouter: localStorage.getItem(LS_API_KEY_PREFIX + 'openrouter') || '',
    openai: localStorage.getItem(LS_API_KEY_PREFIX + 'openai') || '',
  };
}

/**
 * Set a single API key
 */
export async function setApiKey(provider: keyof ApiKeys, key: string): Promise<void> {
  if (isTauri()) {
    try {
      const { Store } = await import('@tauri-apps/plugin-store');
      const store = await Store.load('settings.json');
      await store.set(`${provider}_key`, key);
      await store.save();
      return;
    } catch (e) {
      console.warn('[apiKeyStore] Tauri store failed, falling back to localStorage:', e);
    }
  }

  // Fallback to localStorage
  localStorage.setItem(LS_API_KEY_PREFIX + provider, key);
}

/**
 * Set multiple API keys
 */
export async function setApiKeys(keys: Partial<ApiKeys>): Promise<void> {
  if (isTauri()) {
    try {
      const { Store } = await import('@tauri-apps/plugin-store');
      const store = await Store.load('settings.json');
      if (keys.gemini !== undefined) await store.set('gemini_key', keys.gemini);
      if (keys.deepseek !== undefined) await store.set('deepseek_key', keys.deepseek);
      if (keys.openrouter !== undefined) await store.set('openrouter_key', keys.openrouter);
      if (keys.openai !== undefined) await store.set('openai_key', keys.openai);
      await store.save();
      return;
    } catch (e) {
      console.warn('[apiKeyStore] Tauri store failed, falling back to localStorage:', e);
    }
  }

  // Fallback to localStorage
  if (keys.gemini !== undefined) localStorage.setItem(LS_API_KEY_PREFIX + 'gemini', keys.gemini);
  if (keys.deepseek !== undefined) localStorage.setItem(LS_API_KEY_PREFIX + 'deepseek', keys.deepseek);
  if (keys.openrouter !== undefined) localStorage.setItem(LS_API_KEY_PREFIX + 'openrouter', keys.openrouter);
  if (keys.openai !== undefined) localStorage.setItem(LS_API_KEY_PREFIX + 'openai', keys.openai);
}

/**
 * Get default provider
 */
export async function getDefaultProvider(): Promise<string> {
  if (isTauri()) {
    try {
      const { Store } = await import('@tauri-apps/plugin-store');
      const store = await Store.load('settings.json');
      const provider = await store.get<string>('default_provider');
      if (provider) return provider;
    } catch (e) {
      console.warn('[apiKeyStore] Tauri store failed, falling back to localStorage:', e);
    }
  }

  // Fallback to localStorage
  return localStorage.getItem(LS_DEFAULT_PROVIDER) || 'gemini';
}

/**
 * Set default provider
 */
export async function setDefaultProvider(provider: string): Promise<void> {
  if (isTauri()) {
    try {
      const { Store } = await import('@tauri-apps/plugin-store');
      const store = await Store.load('settings.json');
      await store.set('default_provider', provider);
      await store.save();
      return;
    } catch (e) {
      console.warn('[apiKeyStore] Tauri store failed, falling back to localStorage:', e);
    }
  }

  // Fallback to localStorage
  localStorage.setItem(LS_DEFAULT_PROVIDER, provider);
}

/**
 * Check if any API key is configured
 */
export async function hasAnyApiKey(): Promise<boolean> {
  const keys = await getApiKeys();
  return Object.values(keys).some(key => key && key.length > 0);
}

/**
 * Get a specific API key
 */
export async function getApiKey(provider: string): Promise<string> {
  const keys = await getApiKeys();
  return keys[provider as keyof ApiKeys] || '';
}
