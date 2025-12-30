/**
 * Section Type Registry
 * Dynamic plugin system for registering new infographic section types
 */

import { ComponentType } from 'react';

/**
 * Visual component props interface
 */
export interface VisualComponentProps {
  section: any;
  isDark?: boolean;
  isLoading?: boolean;
}

/**
 * Section type definition
 */
export interface SectionTypeDefinition {
  /** Unique type identifier */
  type: string;
  /** Display name for UI */
  displayName: string;
  /** Category (chart, comparison, hierarchy, list, etc.) */
  category: string;
  /** React component for rendering */
  component: ComponentType<VisualComponentProps>;
  /** Required fields for this section type */
  requiredFields: string[];
  /** Optional fields for this section type */
  optionalFields: string[];
  /** Forbidden fields for this section type */
  forbiddenFields: string[];
}

/**
 * Section type registry
 */
class SectionTypeRegistry {
  private types = new Map<string, SectionTypeDefinition>();

  /**
   * Register a new section type
   */
  register(definition: SectionTypeDefinition): void {
    if (this.types.has(definition.type)) {
      console.warn(`Section type "${definition.type}" already registered, overwriting.`);
    }
    this.types.set(definition.type, definition);
  }

  /**
   * Unregister a section type
   */
  unregister(type: string): void {
    this.types.delete(type);
  }

  /**
   * Get a section type definition
   */
  get(type: string): SectionTypeDefinition | undefined {
    return this.types.get(type);
  }

  /**
   * Check if a type is registered
   */
  has(type: string): boolean {
    return this.types.has(type);
  }

  /**
   * Get all registered types
   */
  getAll(): SectionTypeDefinition[] {
    return Array.from(this.types.values());
  }

  /**
   * Get all registered type names (for schema enum)
   */
  getTypeNames(): string[] {
    return Array.from(this.types.keys());
  }

  /**
   * Get types by category
   */
  getByCategory(category: string): SectionTypeDefinition[] {
    return this.getAll().filter(t => t.category === category);
  }

  /**
   * Clear all registered types
   */
  clear(): void {
    this.types.clear();
  }
}

// Global registry instance
export const sectionRegistry = new SectionTypeRegistry();

/**
 * Convenience function to register a section type
 */
export function registerSectionType(definition: SectionTypeDefinition): void {
  sectionRegistry.register(definition);
}

/**
 * Get Schema enum values for all registered types
 */
export function getSectionTypeSchemaEnum(): string[] {
  return sectionRegistry.getTypeNames();
}

/**
 * Build schema properties for a specific section type
 * This is used in generating dynamic schemas for LLM providers
 */
export function buildSectionSchema(type: string): Record<string, unknown> {
  const definition = sectionRegistry.get(type);
  if (!definition) {
    return {};
  }

  const properties: Record<string, unknown> = {
    type: {
      type: 'string',
      enum: [type],
      description: `Section type: ${definition.displayName}`,
    },
    title: { type: 'string', description: 'Section header' },
  };

  // Add optional fields based on definition
  for (const field of definition.optionalFields) {
    properties[field] = { type: 'string' };
  }

  // Mark required fields
  const required = ['type', 'title', ...definition.requiredFields];

  return { properties, required };
}
