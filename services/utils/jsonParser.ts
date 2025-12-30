/**
 * Parse partial JSON for streaming responses
 *
 * This function attempts to parse incomplete JSON strings by:
 * 1. Tracking bracket/brace stack to auto-close incomplete structures
 * 2. Removing trailing commas
 * 3. Fixing trailing colons
 * 4. Escaping unclosed strings
 *
 * @param jsonStr - Partial JSON string to parse
 * @returns Parsed object or null if parsing fails
 */
export function parsePartialJson(jsonStr: string): any {
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
}
