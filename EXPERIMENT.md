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
| User auth (Supabase/Firebase) | Supabase Auth (email/password signup & login) | Done |
| Splash Screen + Onboarding | Guided Tour with spotlight overlay + confetti | Done |
| Training History (SQLite) | Server-side execution history (MongoDB) + History page | Done |
| Model/Server Discovery (HuggingFace) | MCP Server Discovery (npm + GitHub registries) | Done |
| Settings page | Settings (theme, API config, data management, profile) | Done |
| Documentation | Docs page + Help & Support with FAQ | Done |

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

### Phase 7: Supabase Auth Integration (COMPLETE)
- [x] Add Supabase client (`@supabase/supabase-js`) with env-configurable URL and anon key
- [x] Replace hardcoded admin/password login with Supabase email/password auth
- [x] Add Signup page with username, email, password, and confirm password
- [x] Update Login page to use email instead of username
- [x] Wire `useLogin`, `useRegister`, and `useCurrentUser` hooks to Supabase
- [x] Add `supabase.auth.signOut()` to logout flow
- [x] Add backend `/api/auth/register` endpoint with in-memory user store
- [x] Fix DI resolution in routes (use container factory methods instead of `.resolve()`)
- [x] Fix async/sync mismatch in `MockCollection.find()` and mongo repo `_get_collection()`
- [x] Temporarily bypass auth guards on server/tool routes for development

### Phase 8: Fill the Gaps — 6 Placeholder Pages (COMPLETE)
- [x] Settings page (Appearance/theme toggle, API config, Profile, Data Management, About)
- [x] Settings store with persist middleware (`mcp-settings`)
- [x] API client reads base URL from settings store
- [x] Tools Library page (cross-server tool browser with search/filter)
- [x] Backend `GET /api/tools` endpoint with `ToolWithServerResponse` schema
- [x] Resources page (per-server resource browser)
- [x] Backend `GET /api/servers/{id}/resources` endpoint + `discover_resources()` in MCPProtocolService
- [x] ServerDetail Resources tab replaced "Coming Soon" with ResourceCard grid
- [x] Prompt Templates page (Dexie/IndexedDB CRUD with PromptEditor dialog)
- [x] Dexie DB version 3 with `prompts` table
- [x] ServerDetail Prompts tab replaced "Coming Soon" with PromptCard grid + editor
- [x] Documentation page (accordion sections with static content)
- [x] Help & Support page (FAQ, Quick Links, Feedback form)

### Phase 9: Onboarding & Guided Tour (COMPLETE)
- [x] Onboarding store with persist middleware (`mcp-onboarding`)
- [x] Splash screen on first visit with "Start Tour" / "Skip" options
- [x] Guided tour with spotlight overlay (box-shadow cutout) and tooltip card
- [x] 6 tour steps covering Sidebar, New Server, Dashboard, Tools, Pipelines, Arena
- [x] `data-tour` attributes on Sidebar, Dashboard hero, nav items
- [x] `canvas-confetti` celebration on tour completion
- [x] "Restart Tour" button in Settings page

### Phase 10: Real-Time & Execution History (COMPLETE)
- [x] `ExecutionResult` domain model (backend)
- [x] `ExecutionRepository` interface + `MongoExecutionRepository` implementation
- [x] `ExecutionService` for save/query/clear operations
- [x] `ExecutionController` + `GET/DELETE /api/executions` routes
- [x] `ToolService.execute_tool()` persists results to execution history
- [x] DI wiring: execution_repository → execution_service → tool_service (via `with_execution_service`)
- [x] Frontend `/history` page with expandable rows, pagination, clear all
- [x] "History" nav item in sidebar (Clock icon)

### Phase 11: MCP Server Discovery (COMPLETE)
- [x] npm registry search client (`httpx` async)
- [x] GitHub API search client (`httpx` async)
- [x] `DiscoveryService` with in-memory cache (5-min TTL)
- [x] `DiscoveryController` + `GET /api/discovery/search`, `GET /api/discovery/categories`
- [x] Frontend `/discover` page with debounced search, source tabs (All/npm/GitHub)
- [x] `DiscoveryCard` with source badge, stars, tags, "View" and "Copy Install" buttons
- [x] `discovery-store` (Zustand, no persist)
- [x] "Discover" nav item in sidebar (Compass icon)

## Dependencies Added

| Package | Purpose | Phase |
|---------|---------|-------|
| `zustand` | State management with localStorage persistence | 0 |
| `dexie` + `dexie-react-hooks` | IndexedDB for execution history and pipeline storage | 3 |
| `@xyflow/react` | Visual node-graph pipeline builder | 4 |
| `@dagrejs/dagre` | Auto-layout for pipeline graphs | 4 |
| `js-yaml` + `@types/js-yaml` | YAML config export/import | 6 |
| `@supabase/supabase-js` | Supabase auth (email/password signup & login) | 7 |
| `canvas-confetti` | Confetti celebration on tour completion | 9 |

## PR History

| PR | Title |
|----|-------|
| [#1](https://github.com/lonexreb/MCPstudio/pull/1) | Phase 0-2: Connect frontend to backend with Zustand & React Query |
| [#2](https://github.com/lonexreb/MCPstudio/pull/2) | Phase 3: Real-time execution dashboard with metrics and history |
| [#3](https://github.com/lonexreb/MCPstudio/pull/3) | Phase 4: Visual MCP Pipeline Builder with React Flow |
| [#4](https://github.com/lonexreb/MCPstudio/pull/4) | Phase 5: Tool Execution Arena with side-by-side comparison |
| [#5](https://github.com/lonexreb/MCPstudio/pull/5) | Phase 6: Config export/import with JSON and YAML support |
