/**
 * Type definitions for few-shot examples
 */

export interface SubCategory {
  type: string;
  example_id: string;
  syntax: string;
  data: Record<string, unknown>;
}

export interface CategoryExamples {
  category: string;
  sub_categories: SubCategory[];
}

export interface InfographicGalleryFewShot {
  infographic_gallery_few_shot: CategoryExamples[];
}
