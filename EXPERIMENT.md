# EXPERIMENT.md — MCPStudio Enhancement Tracker

## Inspiration: Unsloth Studio

MCPStudio was enhanced with patterns from [Unsloth Studio](https://github.com/unslothai/unsloth), an open-source no-code LLM fine-tuning UI. All key patterns have been adopted:

| Unsloth Feature | MCPStudio Equivalent | Status |
|----------------|---------------------|--------|
| Zustand + localStorage | Auth/server/UI stores with persist middleware | Done |
| Feature-sliced architecture | features/ directory (servers, tools, auth, execution, pipeline) | Done |
| Training Wizard (multi-step) | Server Connection Wizard (5 steps) | Done |
| Progressive disclosure | Collapsible Accordion sections in ServerDetail | Done |
| Terminal-style animations | TerminalAnimation component for connect/discover/execute | Done |
| Training Monitor (SSE + charts) | Execution Dashboard (Recharts metrics + IndexedDB history) | Done |
| Data Recipes (React Flow) | Visual MCP Pipeline Builder with DAG execution | Done |
| Model Arena | Tool Execution Arena (side-by-side with JSON diff) | Done |
| YAML config export | Config Export/Import (JSON/YAML with zod validation) | Done |

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

### Phase 1: Feature-Sliced Architecture (COMPLETE)
- [x] Reorganize into features/ directory (servers, tools, auth)
- [x] Move pages, components, hooks, stores into feature modules
- [x] Update all imports in App.tsx

### Phase 2: UX Improvements (COMPLETE)
- [x] Server Connection Wizard (5-step: Info → Connection → Auth → Discover → Confirm)
- [x] Terminal-style animated loading component (terminal-animation.tsx)
- [x] Progressive disclosure in ServerDetail (Accordion collapsible sections)

### Phase 3: Real-Time Execution Dashboard (COMPLETE)
- [x] Execution panel with dynamic parameter form (auto-generates from tool schema)
- [x] Execution history with IndexedDB (Dexie) — persists across page reloads
- [x] Metrics dashboard with Recharts (timing line, tool distribution pie, success/error bars)
- [x] Execution tab integrated into ServerDetail with tool selection

### Phase 4: Visual MCP Pipeline Builder (COMPLETE)
- [x] React Flow canvas for chaining MCP tools (drag-and-drop from tool palette)
- [x] Custom nodes: ToolNode (status animations, param handles), InputNode, OutputNode
- [x] Auto-layout with dagre
- [x] Frontend-side pipeline execution engine (Kahn's topological sort, DAG validation)
- [x] Pipeline persistence via Dexie IndexedDB (save/load/delete)
- [x] PipelineToolbar with Save, Run, Auto-Layout, Export JSON, Delete

### Phase 5: Tool Execution Arena (COMPLETE)
- [x] Side-by-side resizable execution panels (react-resizable-panels)
- [x] ArenaPanel with server/tool selectors, parameter form, execute, result viewer
- [x] JSON diff comparison view with highlighted differences and timing comparison

### Phase 6: Config Export/Import (COMPLETE)
- [x] Export server config as JSON/YAML (credentials redacted, zod-validated)
- [x] Import via file upload (drag & drop) or paste with inline validation
- [x] Export button on ServerDetail, Import button on Dashboard

## Dependencies Added

| Package | Purpose | Phase |
|---------|---------|-------|
| `zustand` | State management with localStorage persistence | 0 |
| `dexie` + `dexie-react-hooks` | IndexedDB for execution history and pipeline storage | 3 |
| `@xyflow/react` | Visual node-graph pipeline builder | 4 |
| `@dagrejs/dagre` | Auto-layout for pipeline graphs | 4 |
| `js-yaml` + `@types/js-yaml` | YAML config export/import | 6 |

## PR History

| PR | Title |
|----|-------|
| [#1](https://github.com/lonexreb/MCPstudio/pull/1) | Phase 0-2: Connect frontend to backend with Zustand & React Query |
| [#2](https://github.com/lonexreb/MCPstudio/pull/2) | Phase 3: Real-time execution dashboard with metrics and history |
| [#3](https://github.com/lonexreb/MCPstudio/pull/3) | Phase 4: Visual MCP Pipeline Builder with React Flow |
| [#4](https://github.com/lonexreb/MCPstudio/pull/4) | Phase 5: Tool Execution Arena with side-by-side comparison |
| [#5](https://github.com/lonexreb/MCPstudio/pull/5) | Phase 6: Config export/import with JSON and YAML support |
