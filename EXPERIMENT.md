# EXPERIMENT.md — MCPStudio Enhancement Tracker

## Inspiration: Unsloth Studio

MCPStudio is being enhanced with patterns from [Unsloth Studio](https://github.com/unslothai/unsloth), an open-source no-code LLM fine-tuning UI. Key patterns adopted:

| Unsloth Feature | MCPStudio Equivalent | Status |
|----------------|---------------------|--------|
| Zustand + localStorage | Auth/server/UI stores with persist middleware | Done |
| Feature-sliced architecture | features/ directory (servers, tools, auth, execution, pipeline) | Phase 1 |
| Training Wizard (multi-step) | Server Connection Wizard (5 steps) | Phase 2 |
| Progressive disclosure | Collapsible sections in ServerDetail | Phase 2 |
| Terminal-style animations | Loading animations for connect/discover | Phase 2 |
| Training Monitor (SSE + charts) | Execution Dashboard (SSE + Recharts) | Phase 3 |
| Data Recipes (React Flow) | Visual MCP Pipeline Builder | Phase 4 |
| Model Arena | Tool Execution Arena (side-by-side) | Phase 5 |
| YAML config export | Config Export/Import (JSON/YAML) | Phase 6 |

## Implementation Phases

### Phase 0: Foundation (COMPLETE)
- [x] Fix backend auth settings key mismatch
- [x] Create API types matching backend Pydantic schemas
- [x] Install Zustand, create stores with persist middleware
- [x] Create typed API client layer (lib/api/)
- [x] Create React Query hooks (use-servers, use-tools, use-auth)
- [x] Wire all pages to real backend data
- [x] Add Login page and AuthGuard (PR review feedback)
- [x] Fix tools rendering inconsistency (PR review feedback)

### Phase 1: Feature-Sliced Architecture (NEXT)
- [ ] Reorganize into features/ directory (servers, tools, auth)
- [ ] Move pages, components, hooks, stores into feature modules
- [ ] Update all imports in App.tsx

### Phase 2: UX Improvements
- [ ] Server Connection Wizard (5-step)
- [ ] Terminal-style animated loading component
- [ ] Progressive disclosure in ServerDetail (collapsible sections)

### Phase 3: Real-Time Execution Dashboard
- [ ] SSE endpoint on backend for streaming execution
- [ ] Execution panel with dynamic parameter form
- [ ] Execution history with IndexedDB (Dexie)
- [ ] Metrics dashboard with Recharts

### Phase 4: Visual MCP Pipeline Builder (Killer Feature)
- [ ] React Flow canvas for chaining MCP tools
- [ ] Custom nodes (Tool, Input, Output, Transform, Condition)
- [ ] Auto-layout with dagre
- [ ] Frontend-side pipeline execution engine
- [ ] Backend persistence for pipelines

### Phase 5: Tool Execution Arena
- [ ] Side-by-side execution panels with react-resizable-panels
- [ ] JSON diff comparison of results

### Phase 6: Config Export/Import
- [ ] Export server config as JSON/YAML
- [ ] Import with zod validation

## New Dependencies Added

| Package | Purpose | Phase |
|---------|---------|-------|
| `zustand` | State management with localStorage persistence | 0 |
| `dexie` | IndexedDB for execution history | 3 |
| `@xyflow/react` | Visual node-graph pipeline builder | 4 |
| `@dagrejs/dagre` | Auto-layout for pipeline graphs | 4 |
| `js-yaml` | YAML config export | 6 |

## PR History

| PR | Title | Status |
|----|-------|--------|
| [#1](https://github.com/lonexreb/MCPstudio/pull/1) | Phase 0 - Connect frontend to backend with Zustand & React Query | Open |
