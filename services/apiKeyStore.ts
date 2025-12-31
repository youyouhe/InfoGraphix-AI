import { Store } from '@tauri-apps/plugin-store';

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

const STORE_FILE = 'settings.json';

let storeInstance: Store | null = null;

async function getStore(): Promise<Store> {
  if (!storeInstance) {
    storeInstance = await Store.load(STORE_FILE);
  }
  return storeInstance;
}

export async function getApiKeys(): Promise<ApiKeys> {
  const store = await getStore();
  return {
    gemini: (await store.get<string>('gemini_key')) || '',
    deepseek: (await store.get<string>('deepseek_key')) || '',
    openrouter: (await store.get<string>('openrouter_key')) || '',
    openai: (await store.get<string>('openai_key')) || '',
  };
}

export async function setApiKey(provider: keyof ApiKeys, key: string): Promise<void> {
  const store = await getStore();
  await store.set(`${provider}_key`, key);
  await store.save();
}

export async function setApiKeys(keys: Partial<ApiKeys>): Promise<void> {
  const store = await getStore();
  if (keys.gemini !== undefined) await store.set('gemini_key', keys.gemini);
  if (keys.deepseek !== undefined) await store.set('deepseek_key', keys.deepseek);
  if (keys.openrouter !== undefined) await store.set('openrouter_key', keys.openrouter);
  if (keys.openai !== undefined) await store.set('openai_key', keys.openai);
  await store.save();
}

export async function getDefaultProvider(): Promise<string> {
  const store = await getStore();
  return (await store.get<string>('default_provider')) || 'gemini';
}

export async function setDefaultProvider(provider: string): Promise<void> {
  const store = await getStore();
  await store.set('default_provider', provider);
  await store.save();
}

export async function hasAnyApiKey(): Promise<boolean> {
  const keys = await getApiKeys();
  return Object.values(keys).some(key => key && key.length > 0);
}

export async function getApiKey(provider: string): Promise<string> {
  const keys = await getApiKeys();
  return keys[provider as keyof ApiKeys] || '';
}
