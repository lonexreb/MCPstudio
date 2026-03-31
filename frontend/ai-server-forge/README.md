# MCPStudio Frontend — ai-server-forge

The frontend for MCPStudio: "The Postman for Model Context Protocol". A visual interface for creating, testing, and managing MCP servers.

## Tech Stack

- **Vite** + **TypeScript** + **React**
- **shadcn/ui** (Radix primitives + Tailwind CSS)
- **Zustand** for client state (auth, UI)
- **React Query** for server state / data fetching
- **React Router v6** for routing
- **React Flow** for pipeline canvas

## Getting Started

```sh
npm install
npm run dev   # runs on http://localhost:8080
```

Default login: `admin` / `password` (hardcoded MVP credentials — backend required at `http://localhost:8000`)

## Project Structure

```
src/
├── features/
│   ├── auth/         # AuthGuard, Login page, use-auth hook, auth-store
│   ├── servers/      # Dashboard, NewServer, ServerDetail, ServerCard,
│   │                 # ConfigExport, ConfigImport, config-serializer (JSON/YAML)
│   ├── tools/        # ToolEditor, CodeEditor, ParameterEditor
│   ├── pipeline/     # PipelineList, PipelineEditor, React Flow canvas, nodes
│   └── execution/    # Arena (side-by-side tool comparison), ExecutionHistory,
│                     # ExecutionMetrics, ParameterForm, ExecutionResult
├── components/
│   ├── layout/       # MainLayout, Header, Sidebar
│   └── ui/           # 47 shadcn/ui components (including Resizable)
├── stores/           # Zustand stores (auth-store, ui-store)
├── lib/
│   ├── api/          # Typed API client (client, servers, tools, auth)
│   └── utils.ts      # cn() classname helper
└── types/
    ├── api.ts        # TypeScript types matching backend Pydantic schemas
    └── mcp.ts        # Frontend domain models
```

## Routes

| Path | Feature | Description |
|------|---------|-------------|
| `/` | servers | Dashboard — list of MCP servers |
| `/new-server` | servers | Create a new MCP server |
| `/server/:id` | servers | Server detail + tool testing |
| `/pipelines` | pipeline | List saved pipelines |
| `/pipelines/new` | pipeline | Build a new pipeline |
| `/pipelines/:id` | pipeline | Edit an existing pipeline |
| `/arena` | execution | Side-by-side tool execution comparison |

## Key Conventions

- **State**: Zustand stores with `persist` middleware (localStorage)
- **Data fetching**: React Query hooks wrapping typed API client (`lib/api/`)
- **Auth**: JWT stored in auth-store; `AuthGuard` redirects unauthenticated users to `/login`; API client auto-injects bearer token
- **Styling**: Tailwind with custom color tokens — `mcp.blue` (#2563eb), `mcp.purple` (#7c3aed), `mcp.teal` (#0d9488)
- **Path alias**: `@/` → `src/`

## Backend

Expects the backend running at `http://localhost:8000`. See `../../backend/mcp_studio_backend/README.md` for setup instructions.
