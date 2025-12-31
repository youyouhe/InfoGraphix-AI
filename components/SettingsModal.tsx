import React, { useState, useEffect } from 'react';
import { X, Key, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';
import * as Store from '../services/apiKeyStore';
import { LLMServiceFactory } from '../services/factory';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [apiKeys, setApiKeys] = useState<Store.ApiKeys>({
    gemini: '',
    deepseek: '',
    openrouter: '',
    openai: '',
  });
  const [showKeys, setShowKeys] = useState({
    gemini: false,
    deepseek: false,
    openrouter: false,
    openai: false,
  });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [defaultProvider, setDefaultProvider] = useState('gemini');

  // Load API keys on mount
  useEffect(() => {
    if (isOpen) {
      loadSettings();
    }
  }, [isOpen]);

  const loadSettings = async () => {
    try {
      const [keys, provider] = await Promise.all([
        Store.getApiKeys(),
        Store.getDefaultProvider(),
      ]);
      setApiKeys(keys);
      setDefaultProvider(provider);
    } catch (e) {
      console.warn('Failed to load settings:', e);
    }
  };

  const handleKeyChange = (provider: keyof Store.ApiKeys, value: string) => {
    setApiKeys(prev => ({ ...prev, [provider]: value }));
    setSaveStatus('idle');
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      await Store.setApiKeys(apiKeys);
      await Store.setDefaultProvider(defaultProvider);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (e) {
      console.error('Failed to save settings:', e);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const toggleKeyVisibility = (provider: keyof Store.ApiKeys) => {
    setShowKeys(prev => ({ ...prev, [provider]: !prev[provider] }));
  };

  const providers = LLMServiceFactory.getAvailableProviders();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-zinc-800 max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 p-6 border-b border-gray-200 dark:border-zinc-800">
          <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
            <Key size={24} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              API Settings
            </h3>
            <p className="text-sm text-gray-500 dark:text-zinc-400">
              Manage your API keys and default provider
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg text-gray-500 dark:text-zinc-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Default Provider Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
              Default Provider
            </label>
            <select
              value={defaultProvider}
              onChange={(e) => {
                setDefaultProvider(e.target.value);
                setSaveStatus('idle');
              }}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white text-sm"
            >
              {providers.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} {p.supportsSearch && '(with Search)'}
                </option>
              ))}
            </select>
          </div>

          {/* API Keys */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-zinc-300">
              API Keys
            </h4>
            {providers.map(provider => (
              <div key={provider.id}>
                <label className="block text-xs text-gray-500 dark:text-zinc-400 mb-1.5">
                  {provider.name} API Key
                </label>
                <div className="relative">
                  <input
                    type={showKeys[provider.id as keyof Store.ApiKeys] ? 'text' : 'password'}
                    value={apiKeys[provider.id as keyof Store.ApiKeys]}
                    onChange={(e) => handleKeyChange(provider.id as keyof Store.ApiKeys, e.target.value)}
                    placeholder={`Enter your ${provider.name} API key`}
                    className="w-full px-4 py-2.5 pr-24 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 text-sm"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                    <button
                      onClick={() => toggleKeyVisibility(provider.id as keyof Store.ApiKeys)}
                      className="p-1.5 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded text-gray-500 dark:text-zinc-400"
                    >
                      {showKeys[provider.id as keyof Store.ApiKeys] ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    {apiKeys[provider.id as keyof Store.ApiKeys] && (
                      <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded">
                        <Check size={16} className="text-green-600 dark:text-green-400" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Info Box */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-500/20">
            <AlertCircle size={18} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700 dark:text-blue-300">
              API keys are stored locally on your device and are only sent to the respective AI service providers.
              Gemini supports search grounding for fact-based responses.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            {saveStatus === 'success' && (
              <span className="flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400">
                <Check size={16} /> Saved
              </span>
            )}
            {saveStatus === 'error' && (
              <span className="flex items-center gap-1.5 text-sm text-red-600 dark:text-red-400">
                <AlertCircle size={16} /> Failed to save
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-lg transition-colors"
            >
              {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
