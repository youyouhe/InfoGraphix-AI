# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

InfoGraphix AI is a React single-page application that transforms research topics into visually stunning infographic reports using AI with search grounding capabilities. The app features **multi-provider LLM support**, streaming JSON responses, real-time content updates, and a component-based visual rendering system.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (runs on http://0.0.0.0:3000)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Environment Setup

Create a `.env.local` file with your API keys:
```bash
# Google Gemini (required)
GEMINI_API_KEY=your_api_key_here

# Optional providers
DEEPSEEK_API_KEY=your_deepseek_key
OPENROUTER_API_KEY=your_openrouter_key
OPENAI_API_KEY=your_openai_key

# Default provider (gemini, deepseek, openrouter, openai)
DEFAULT_PROVIDER=gemini
```

## Architecture

### Tech Stack
- **Frontend**: React 19 with TypeScript, Vite 6
- **Styling**: Tailwind CSS (via CDN in `index.html`)
- **Charts**: Recharts 3.6
- **Icons**: lucide-react
- **AI SDKs**: `@google/genai`, `openai` (for DeepSeek, OpenRouter, OpenAI)

### Multi-Provider Architecture

The app uses a **factory pattern** for multi-provider support:

```
App.tsx
  └─> LLMServiceFactory.create(provider)
       ├─> GeminiProvider (Google Gemini with search)
       ├─> DeepSeekProvider (DeepSeek API)
       ├─> OpenRouterProvider (OpenRouter aggregation)
       └─> OpenAIProvider (OpenAI GPT-4o)
```

**Key Files**:
| File | Purpose |
|------|---------|
| `services/types.ts` | Provider interfaces (LLMProvider, ProviderConfig) |
| `services/factory.ts` | Provider factory, API key management |
| `services/providers/geminiProvider.ts` | Gemini implementation with search |
| `services/providers/deepSeekProvider.ts` | DeepSeek implementation |
| `services/providers/openRouterProvider.ts` | OpenRouter implementation |
| `services/providers/openAIProvider.ts` | OpenAI implementation |
| `services/prompts/systemPrompt.ts` | System prompts and schemas |
| `services/prompts/fewShotExamples.ts` | Few-shot examples (AntV Infographic style) |
| `services/utils/jsonParser.ts` | Partial JSON parser for streaming |
| `App.tsx` | Main app with provider selection state |
| `components/Sidebar.tsx` | Provider dropdown selector |
| `types.ts` | SectionType enum, InfographicReport |
| `components/Visuals.tsx` | Visual section components |

### Supported Providers

| Provider | ID | Model | Search Support |
|----------|-----|-------|----------------|
| Google Gemini | `gemini` | `gemini-2.0-flash-exp` | ✅ Yes |
| DeepSeek | `deepseek` | `deepseek-chat` | ❌ No |
| OpenRouter | `openrouter` | `google/gemini-2.0-flash-exp:free` | ❌ No |
| OpenAI | `openai` | `gpt-4o-mini` | ❌ No |

### Visual Section Types

The app supports 6 section types defined in `types.ts`:

| Type | Component | Required Fields | Forbidden Fields |
|------|-----------|-----------------|------------------|
| `text` | TextSection | `title`, `content` | `data`, `steps`, `statValue`, `comparisonItems` |
| `stat_highlight` | StatHighlight | `statValue`, `statLabel` | `data`, `steps`, `comparisonItems` |
| `bar_chart` | ChartSection | `data` (Array of {name, value}) | `steps`, `comparisonItems`, `statValue` |
| `pie_chart` | ChartSection | `data` (Array of {name, value}) | `steps`, `comparisonItems`, `statValue` |
| `process_flow` | ProcessFlow | `steps` (Array of {step, title, description}) | `data`, `comparisonItems`, `statValue` |
| `comparison` | ComparisonSection | `comparisonItems` (Array of {label, left, right}) | `data`, `steps`, `statValue` |

### Streaming JSON Handling

The app uses a custom `parsePartialJson()` helper in `services/utils/jsonParser.ts` to handle incomplete JSON during streaming:
- Tracks bracket/brace stack to auto-close incomplete structures
- Removes trailing commas, fixes trailing colons
- Falls back to `lastValidPartial` if final parse fails
- Never outputs empty arrays/objects (enforced in system prompt)

### State Management

All state is in `App.tsx` using React hooks:
- `history` - Array of past queries with reports
- `currentReport` - Currently displayed InfographicReport
- `loading`, `error` - UI states
- `provider` - Current LLM provider (default: from `DEFAULT_PROVIDER` env var)
- `isDarkMode`, `showDebug` - Display preferences

Scroll-to-bottom during streaming is handled via `scrollContainerRef` and `prevSectionCount` tracking.

## Adding a New Provider

1. Create provider class in `services/providers/` implementing `LLMProvider` interface
2. Add case to `LLMServiceFactory.create()` in `services/factory.ts`
3. Add to `getAvailableProviders()` in factory
4. Add API key env var to `vite.config.ts` and `.env.local`

## Adding New Visual Components

1. Add the new `SectionType` enum value to `types.ts`
2. Update schemas in `services/prompts/systemPrompt.ts`
3. Create the component in `components/Visuals.tsx`
4. Add a case in `renderSection()` in `App.tsx`

## Debugging

- Toggle the debug panel (bug icon) to see live LLM JSON output
- The debug panel shows the current `currentReport` object
- Sources are extracted from grounding metadata (Gemini only) and de-duplicated by URI
- Provider selector is in the Sidebar footer
