![MCPStudio Banner](./assets/banner-light.svg#gh-light-mode-only)
![MCPStudio Banner](./assets/banner-dark.svg#gh-dark-mode-only)

# MCPStudio: The Postman for Model Context Protocol

MCPStudio is a web platform for creating, testing, managing, and discovering [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) servers. Like Postman for APIs, MCPStudio provides a visual interface that abstracts away protocol complexity — letting you connect to MCP servers, discover tools, execute them with parameters, and inspect results, all from the browser.

**Strategic direction:** Web app (now) → CLI tool → SDK/library → Desktop app

## Features

- **Server Management** — Create, configure, connect to, and monitor MCP servers with status tracking (connected / disconnected / error)
- **Tool Discovery & Execution** — Auto-discover tools exposed by MCP servers, fill parameters via dynamic forms, and view formatted responses
- **Tools Library** — Browse all tools across connected servers with search and server filtering
- **Execution Dashboard** — Real-time metrics with Recharts (timing, tool distribution, success/error rates) and persistent history via IndexedDB
- **Execution History** — Server-side persistent execution log with expandable rows, pagination, and clear
- **Visual Pipeline Builder** — Drag-and-drop React Flow canvas to chain MCP tools into DAG pipelines with auto-layout and frontend execution engine
- **Tool Execution Arena** — Side-by-side resizable panels for comparing tool executions with JSON diff and timing comparison
- **MCP Server Discovery** — Search npm and GitHub registries for MCP-compatible servers with source filtering and install commands
- **Resources Browser** — Discover and browse data sources exposed by connected MCP servers
- **Prompt Templates** — Create, edit, tag, and manage reusable prompt patterns with `{{variable}}` placeholders (stored in IndexedDB)
- **Config Export/Import** — Export server configs as JSON or YAML (credentials redacted); import via file upload, drag & drop, or paste
- **Authentication** — Supabase auth (email/password signup & login) with JWT tokens; OAuth2 flow support for service integrations (Google Drive)
- **Guided Onboarding** — First-run splash screen with interactive spotlight tour and confetti celebration
- **Settings** — Theme toggle (dark/light), API base URL configuration, profile, data management
- **Documentation & Support** — Built-in docs, FAQ, quick links, and feedback form
- **Real-time Updates** — WebSocket streams for tool execution and server status changes
- **Google Drive Integration** — Connect via OAuth, list/search/retrieve files, create folders

## Tech Stack

### Frontend

| Category | Technology |
|----------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite 5 + SWC |
| State | Zustand 5 (persisted to localStorage) |
| Data Fetching | React Query 5 |
| UI Kit | shadcn/ui (47+ Radix-based components) |
| Styling | Tailwind CSS 3 with custom MCP color tokens + gradients |
| Forms | react-hook-form + Zod validation |
| Routing | react-router-dom 6 |
| Charts | Recharts 2 |
| Node Graph | @xyflow/react (React Flow) + @dagrejs/dagre |
| Auth | @supabase/supabase-js (email/password) |
| Local DB | Dexie (IndexedDB wrapper) — executions, pipelines, prompts |
| Config Parsing | js-yaml + Zod |
| Effects | canvas-confetti (onboarding celebration) |
| Notifications | Sonner |

### Backend

| Category | Technology |
|----------|-----------|
| Framework | FastAPI 0.109 |
| Language | Python 3.10+ |
| Database | MongoDB (Motor async driver) — falls back to in-memory mock |
| Auth | JWT (python-jose) + OAuth2 (google-auth-oauthlib) |
| DI | dependency-injector |
| HTTP Client | httpx (async, for registry search) |
| WebSockets | websockets 12 |
| Validation | Pydantic 2 + pydantic-settings |
| Testing | pytest + pytest-asyncio |

## Architecture

### Backend — Domain-Driven Design (4 layers)

```
backend/mcp_studio_backend/src/mcp_studio/
├── api/              # Controllers, routes, Pydantic schemas
│   ├── controllers/  # auth, server, tool, execution, discovery
│   ├── routes/       # auth, server, tool, execution, discovery
│   └── schemas/      # auth, server, tool, execution, discovery
├── application/      # Services, DTOs (orchestration)
│   └── services/     # auth, server, tool, execution, discovery
├── domain/           # Models, repository interfaces, domain services
├── infrastructure/   # MongoDB repos, Google Drive client, registry clients, EventBus
├── config/           # Settings (pydantic-settings, loads .env)
├── container.py      # Dependency injection wiring
└── main.py           # FastAPI app entry point
```

### Frontend — Feature-Sliced Architecture

```
frontend/ai-server-forge/src/
├── features/
│   ├── auth/           # Login, Signup, AuthGuard, auth store, Supabase hooks
│   ├── servers/        # Dashboard, ServerDetail, ConfigExport/Import, use-servers
│   ├── tools/          # ToolEditor, ParameterEditor, use-tools
│   ├── tools-library/  # ToolsLibrary page (cross-server tool browser)
│   ├── pipeline/       # PipelineList, PipelineEditor, React Flow canvas, engine
│   ├── execution/      # Arena, ExecutionPanel, ExecutionHistory, ExecutionHistoryPage, Metrics
│   ├── resources/      # ResourcesPage, ResourceCard, use-resources
│   ├── prompts/        # PromptsPage, PromptCard, PromptEditor (Dexie/IndexedDB)
│   ├── discovery/      # DiscoveryPage, DiscoveryCard (npm + GitHub search)
│   ├── settings/       # SettingsPage, ThemeToggle, ApiConfig, DataManagement
│   ├── onboarding/     # SplashScreen, TourOverlay (spotlight + confetti)
│   ├── docs/           # DocsPage (static documentation)
│   └── support/        # SupportPage, FAQ, QuickLinks, FeedbackForm
├── components/
│   ├── layout/       # MainLayout, Header, Sidebar
│   └── ui/           # shadcn/ui component library (47+ components)
├── stores/           # Zustand stores (ui)
├── lib/
│   ├── api/          # Typed API client (servers, tools, auth, resources, executions, discovery)
│   └── supabase.ts   # Supabase client initialization
├── hooks/            # Shared hooks (use-mobile, use-toast)
└── types/            # TypeScript types matching backend Pydantic schemas
```

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 16+
- MongoDB (optional — falls back to in-memory mock when unavailable)
- UV package manager (recommended)

### Installation

```bash
git clone https://github.com/lonexreb/MCPstudio.git
cd MCPstudio
```

**Backend:**
```bash
cd backend/mcp_studio_backend
python -m venv venv && source venv/bin/activate  # Windows: venv\Scripts\activate
pip install uv && uv pip install -e .
uvicorn mcp_studio.main:app --reload  # runs on :8000
```

**Frontend:**
```bash
cd frontend/ai-server-forge
npm install
npm run dev  # runs on :8080
```

Open your browser at `http://localhost:8080` and sign up for a new account, or log in with existing credentials.

## API Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/token` | Login (OAuth2 password flow) |
| `GET` | `/api/auth/me` | Current user info |
| `GET` | `/api/auth/google/auth` | Google OAuth URL |
| `GET` | `/api/auth/google/callback` | Google OAuth callback |
| `POST` | `/api/servers` | Create server |
| `GET` | `/api/servers` | List servers |
| `GET` | `/api/servers/{id}` | Get server details |
| `PUT` | `/api/servers/{id}` | Update server |
| `DELETE` | `/api/servers/{id}` | Delete server |
| `POST` | `/api/servers/{id}/connect` | Connect & discover tools |
| `POST` | `/api/servers/{id}/disconnect` | Disconnect |
| `GET` | `/api/servers/{id}/tools` | List server tools |
| `GET` | `/api/servers/{id}/resources` | List server resources |
| `GET` | `/api/tools` | List all tools (cross-server) |
| `GET` | `/api/tools/{id}` | Get tool details |
| `POST` | `/api/servers/{id}/tools/{id}/execute` | Execute tool |
| `GET` | `/api/executions` | Execution history (filterable) |
| `GET` | `/api/executions/{id}` | Get execution details |
| `DELETE` | `/api/executions` | Clear execution history |
| `GET` | `/api/discovery/search` | Search MCP servers (npm/GitHub) |
| `GET` | `/api/discovery/categories` | List server categories |
| `WS` | `/ws/servers/{id}/tools/{id}/execution` | Tool execution stream |

## Roadmap

MCPStudio follows a phased enhancement plan inspired by patterns from [Unsloth Studio](https://github.com/unslothai/unsloth):

| Phase | Feature | Status |
|-------|---------|--------|
| 0 | Foundation — Zustand stores, React Query, typed API client, auth guard | Done |
| 1 | Feature-sliced architecture reorganization | Done |
| 2 | UX — Server Connection Wizard, terminal-style loading, collapsible sections | Done |
| 3 | Real-time Execution Dashboard — Recharts metrics, IndexedDB history (Dexie) | Done |
| 4 | Visual MCP Pipeline Builder — React Flow canvas, DAG execution, dagre auto-layout | Done |
| 5 | Tool Execution Arena — side-by-side comparison with JSON diff | Done |
| 6 | Config Export/Import — JSON/YAML with Zod validation, drag & drop import | Done |
| 7 | Supabase Auth — email/password signup & login, replacing hardcoded credentials | Done |
| 8 | Fill the Gaps — Settings, Tools Library, Resources, Prompts, Docs, Support pages | Done |
| 9 | Onboarding & Guided Tour — splash screen, spotlight tour, confetti celebration | Done |
| 10 | Execution History — server-side persistence, history page with pagination | Done |
| 11 | MCP Server Discovery — npm/GitHub registry search with discovery page | Done |

See [EXPERIMENT.md](./EXPERIMENT.md) for detailed tracking.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
