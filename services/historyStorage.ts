import { HistoryItem } from '../types';

const HISTORY_STORAGE_KEY = 'infographix_history';
const MAX_HISTORY_ITEMS = 50;

/**
 * Save history to localStorage
 */
export function saveHistory(history: HistoryItem[]): void {
  try {
    // Limit history size to prevent storage issues
    const historyToSave = history.slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(historyToSave));
  } catch (error) {
    console.error('Failed to save history to localStorage:', error);
  }
}

/**
 * Load history from localStorage
 */
export function loadHistory(): HistoryItem[] {
  try {
    const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (stored) {
      const history = JSON.parse(stored) as HistoryItem[];
      // Validate and filter invalid items
      return history.filter(item => item.id && item.query && item.timestamp);
    }
  } catch (error) {
    console.error('Failed to load history from localStorage:', error);
  }
  return [];
}

/**
 * Clear history from localStorage
 */
export function clearHistoryStorage(): void {
  try {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear history from localStorage:', error);
  }
}

/**
 * Add a single history item and save
 */
export function addHistoryItem(item: HistoryItem, existingHistory: HistoryItem[]): HistoryItem[] {
  const newHistory = [item, ...existingHistory].slice(0, MAX_HISTORY_ITEMS);
  saveHistory(newHistory);
  return newHistory;
}
