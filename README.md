![MCPStudio Banner](./assets/banner-light.svg#gh-light-mode-only)
![MCPStudio Banner](./assets/banner-dark.svg#gh-dark-mode-only)

# MCPStudio: The Postman for Model Context Protocol

MCPStudio is a web platform for creating, testing, managing, and discovering [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) servers. Like Postman for APIs, MCPStudio provides a visual interface that abstracts away protocol complexity — letting you connect to MCP servers, discover tools, execute them with parameters, and inspect results, all from the browser.

**Strategic direction:** Web app (now) → CLI tool → SDK/library → Desktop app

## Features

- **Server Management** — Create, configure, connect to, and monitor MCP servers with status tracking (connected / disconnected / error)
- **Tool Discovery & Execution** — Auto-discover tools exposed by MCP servers, fill parameters via dynamic forms, and view formatted responses
- **Execution Dashboard** — Real-time metrics with Recharts (timing, tool distribution, success/error rates) and persistent history via IndexedDB
- **Visual Pipeline Builder** — Drag-and-drop React Flow canvas to chain MCP tools into DAG pipelines with auto-layout and frontend execution engine
- **Tool Execution Arena** — Side-by-side resizable panels for comparing tool executions with JSON diff and timing comparison
- **Config Export/Import** — Export server configs as JSON or YAML (credentials redacted); import via file upload, drag & drop, or paste
- **Authentication** — Supabase auth (email/password signup & login) with JWT tokens; OAuth2 flow support for service integrations (Google Drive)
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
| Styling | Tailwind CSS 3 with custom MCP color tokens |
| Forms | react-hook-form + Zod validation |
| Routing | react-router-dom 6 |
| Charts | Recharts 2 |
| Node Graph | @xyflow/react (React Flow) + @dagrejs/dagre |
| Auth | @supabase/supabase-js (email/password) |
| Local DB | Dexie (IndexedDB wrapper) |
| Config Parsing | js-yaml + Zod |
| Notifications | Sonner |

### Backend

| Category | Technology |
|----------|-----------|
| Framework | FastAPI 0.109 |
| Language | Python 3.10+ |
| Database | MongoDB (Motor async driver) — falls back to in-memory mock |
| Auth | JWT (python-jose) + OAuth2 (google-auth-oauthlib) |
| DI | dependency-injector |
| WebSockets | websockets 12 |
| Validation | Pydantic 2 + pydantic-settings |
| Testing | pytest + pytest-asyncio |

## Architecture

### Backend — Domain-Driven Design (4 layers)

```
backend/mcp_studio_backend/src/mcp_studio/
├── api/              # Controllers, routes, Pydantic schemas
├── application/      # Services, DTOs (orchestration)
├── domain/           # Models, repository interfaces, domain services, events
├── infrastructure/   # MongoDB repos, Google Drive client, EventBus, logging
├── config/           # Settings (pydantic-settings, loads .env)
├── container.py      # Dependency injection wiring
└── main.py           # FastAPI app entry point
```

### Frontend — Feature-Sliced Architecture

```
frontend/ai-server-forge/src/
├── features/
│   ├── auth/         # Login & Signup pages, AuthGuard, auth store, Supabase hooks
│   ├── servers/      # Dashboard, ServerDetail, ServerCard, ConfigExport,
│   │                 # ConfigImport, config-serializer (JSON/YAML), use-servers
│   ├── tools/        # ToolEditor, ParameterEditor, CodeEditor, use-tools
│   ├── pipeline/     # PipelineList, PipelineEditor, React Flow canvas,
│   │                 # custom nodes, auto-layout (dagre), pipeline engine
│   └── execution/    # Arena (side-by-side comparison), ExecutionDashboard,
│                     # ExecutionHistory, ExecutionMetrics, ParameterForm
├── components/
│   ├── layout/       # MainLayout, Header, Sidebar
│   └── ui/           # shadcn/ui component library (47+ components)
├── stores/           # Zustand stores (auth, ui, server)
├── lib/
│   ├── api/          # Typed API client with auto bearer token injection
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
| `GET` | `/api/tools/{id}` | Get tool details |
| `POST` | `/api/servers/{id}/tools/{id}/execute` | Execute tool |
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

See [EXPERIMENT.md](./EXPERIMENT.md) for detailed tracking.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
