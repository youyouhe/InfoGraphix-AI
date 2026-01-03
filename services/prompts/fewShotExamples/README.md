# Dynamic Few-Shot Prompt System

## Overview

This module provides a dynamic few-shot prompt composition system for infographic generation. Instead of sending all examples at once, it randomly selects examples from each category to create varied, token-efficient prompts.

## Architecture

```
fewShotExamples/
├── index.ts           # Main entry point
├── types.ts           # Type definitions
├── composer.ts        # Dynamic composition logic
├── sequence.ts        # Sequence & Process examples (4)
├── comparison.ts      # Comparison examples (11)
├── listGrid.ts        # List & Grid examples (2)
├── chart.ts           # Chart examples (4)
├── hierarchy.ts       # Hierarchy examples (2)
└── quadrant.ts        # Quadrant examples (1)
```

## Usage

### Basic Usage

Get a random few-shot prompt with 1 example per category (6 total examples):

```typescript
import { getFewShotPrompt } from './fewShotExamples';

// Returns a JSON string with 6 randomly selected examples
const fewShot = getFewShotPrompt();
```

### Custom Configuration

```typescript
import { getFewShotPrompt, ComposerConfig } from './fewShotExamples';

// Select 2 examples per category
const config: ComposerConfig = {
  examplesPerCategory: 2
};

// Or only include specific categories
const customConfig: ComposerConfig = {
  categories: ['sequence', 'comparison', 'chart']
};

const fewShot = getFewShotPrompt(customConfig);
```

### Advanced Usage

```typescript
import { composeFewShot, formatComposedFewShot } from './fewShotExamples';

// Get structured result
const composed = composeFewShot({
  examplesPerCategory: 1
});

console.log(composed.totalExamples);      // 6
console.log(composed.categoriesIncluded); // ['Sequence & Process', 'Comparison', ...]

// Format as JSON string
const jsonStr = formatComposedFewShot(composed);
```

## Benefits

1. **Token Efficiency**: Only sends 6 examples instead of 24+
2. **Variety**: Each request uses different examples
3. **Maintainability**: Examples organized by category
4. **Flexibility**: Can customize selection per request

## Category Breakdown

| Category | Examples | Templates |
|----------|----------|-----------|
| Sequence | 4 | timeline, zigzag-steps, roadmap, circular |
| Comparison | 11 | binary-fold, badge-card-vs, compact-card, swot, etc. |
| List/Grid | 2 | feature-list, grid-cards |
| Chart | 4 | bar, column, pie, wordcloud |
| Hierarchy | 2 | tree, curved-tree |
| Quadrant | 1 | standard-quadrant |

## Migration Guide

### Before (Static)

```typescript
import { INFOGRAPHIC_FEW_SHOT_DATA } from './fewShotExamples';

// Always sent all 24+ examples
const prompt = JSON.stringify(INFOGRAPHIC_FEW_SHOT_DATA);
```

### After (Dynamic)

```typescript
import { getFewShotPrompt } from './fewShotExamples';

// Sends 6 random examples (configurable)
const prompt = getFewShotPrompt();
```

## Backward Compatibility

The old `fewShotExamples.ts` file now re-exports from the new modular system:

```typescript
// These still work
import { getTemplateByKeywords } from './fewShotExamples';
import { SEQUENCE_EXAMPLES, COMPARISON_EXAMPLES } from './fewShotExamples';
```
