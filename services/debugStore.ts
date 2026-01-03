/**
 * Debug Store for storing debug information during generation
 * This allows us to capture and display debug info in the debug panel
 */

interface DebugInfo {
  /** The few-shot prompt that was dynamically generated */
  fewShotPrompt?: string;
  /** The system instruction that was used */
  systemInstruction?: string;
  /** Recommended types extracted from few-shot examples */
  recommendedTypes?: string[];
  /** Timestamp when the debug info was captured */
  timestamp?: number;
}

/**
 * Simple in-memory store for debug information
 * This is reset on each generation
 */
class DebugStore {
  private current: DebugInfo = {};

  set(info: Partial<DebugInfo>) {
    this.current = {
      ...this.current,
      ...info,
      timestamp: Date.now(),
    };
  }

  get(): DebugInfo {
    return this.current;
  }

  clear() {
    this.current = {};
  }

  /** Get the few-shot prompt as a parsed object for easier display */
  getFewShotPromptParsed(): any {
    if (!this.current.fewShotPrompt) return null;
    try {
      return JSON.parse(this.current.fewShotPrompt);
    } catch {
      return null;
    }
  }
}

// Singleton instance
export const debugStore = new DebugStore();
