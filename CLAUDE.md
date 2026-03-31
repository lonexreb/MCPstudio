# CLAUDE.md — MCPStudio Developer Guide

## Project Overview

MCPStudio is "The Postman for Model Context Protocol" — a web platform for creating, testing, managing, and discovering MCP servers. It provides a visual interface for interacting with MCP servers, abstracting away protocol complexity.

**Strategic direction**: Web app (now) → CLI tool (next) → SDK/library (later) → Desktop (future)

## Quick Start

### Backend
```bash
cd backend/mcp_studio_backend
python -m venv venv && source venv/bin/activate
pip install uv && uv pip install -e .
uvicorn mcp_studio.main:app --reload  # runs on :8000
```

### Frontend
```bash
cd frontend/ai-server-forge
npm install
npm run dev  # runs on :8080
```

### Prerequisites
- Python 3.10+, Node.js 16+, MongoDB (optional — falls back to in-memory mock)
- Default login credentials: `admin` / `password`

## Architecture

Domain-Driven Design with 4 layers:

```
backend/mcp_studio_backend/src/mcp_studio/
├── api/              # Controllers, routes, schemas (Pydantic)
├── application/      # Services, DTOs (orchestration layer)
├── domain/           # Models, repository interfaces, domain services
├── infrastructure/   # MongoDB repos, Google Drive client, EventBus, logging
├── config/           # settings.py (pydantic-settings, loads .env)
├── container.py      # Dependency injection (dependency_injector library)
├── main.py           # FastAPI app, CORS, route registration, lifespan
└── utils/            # Empty placeholders (errors, security, validation)

frontend/ai-server-forge/src/
├── features/
│   ├── auth/         # AuthGuard, Login page, use-auth hook, auth-store
│   ├── servers/      # Dashboard, NewServer, ServerDetail, ServerCard, ServerList, config editors, use-servers, server-store
│   └── tools/        # ToolEditor, CodeEditor, ParameterEditor, ReturnTypeEditor, use-tools
├── components/
│   ├── layout/       # MainLayout, Header, Sidebar (shared)
│   └── ui/           # 47 shadcn/ui components (shared)
├── stores/           # ui-store (global UI state, Zustand + persist)
├── hooks/            # use-mobile, use-toast (shared utilities)
├── lib/
│   ├── api/          # Typed API client (client, servers, tools, auth)
│   └── utils.ts      # cn() classname helper
├── types/
│   ├── api.ts        # TypeScript types matching backend Pydantic schemas
│   └── mcp.ts        # Frontend domain models (legacy, for reference)
```

## Key Conventions

- **Backend DI**: All dependencies wired through `container.py` using Factory/Singleton providers
- **Routes → Controllers → Services → Repositories**: Each layer has clear responsibility
- **Pydantic schemas** for API request/response validation (`api/schemas/`)
- **Pydantic-settings** for config — loads from `.env` file
- **Frontend state**: Zustand stores with `persist` middleware (localStorage)
- **Frontend data fetching**: React Query hooks wrapping typed API client (`lib/api/`)
- **Frontend UI**: shadcn/ui components (Radix primitives + Tailwind)
- **Auth flow**: JWT tokens stored in Zustand auth store; AuthGuard redirects to `/login`; API client auto-injects bearer token
- **Styling**: Tailwind CSS with custom `mcp.blue` (#2563eb), `mcp.purple` (#7c3aed), `mcp.teal` (#0d9488) color tokens
- **Path alias**: `@/` maps to `frontend/ai-server-forge/src/`

## Known Issues

### Hardcoded auth credentials
`auth_controller.py` has hardcoded `admin/password` for MVP login. No real user database.

### Circular dependency workaround
`ServerService` ↔ `ToolService` circular reference resolved in `container.py` via `.with_tool_service()` / `.with_server_service()` post-init methods.

### MongoDB optional
When MongoDB unavailable, `MockCollection` in `infrastructure/database/connection.py` provides in-memory fallback. Data not persisted.

### Placeholder routes
`/tools`, `/resources`, `/prompts`, `/docs`, `/support`, `/settings` routes still point to Index page.

## Testing

```bash
cd backend/mcp_studio_backend
pytest                    # run all tests
pytest tests/unit/        # unit tests only
```

- Unit tests exist for Google Drive integration (`tests/unit/test_google_drive.py`)
- Other test files are empty placeholders
- No frontend tests

## API Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/auth/token` | Login (OAuth2 password flow) |
| GET | `/api/auth/google/auth` | Google OAuth URL |
| GET | `/api/auth/google/callback` | Google OAuth callback |
| GET | `/api/auth/me` | Current user |
| POST/GET/PUT/DELETE | `/api/servers[/{id}]` | Server CRUD |
| POST | `/api/servers/{id}/connect` | Connect & discover tools |
| POST | `/api/servers/{id}/disconnect` | Disconnect |
| GET | `/api/servers/{id}/tools` | List server tools |
| GET | `/api/tools/{id}` | Get tool |
| POST | `/api/servers/{id}/tools/{id}/execute` | Execute tool |

## Key Entry Points

- **Backend app**: `backend/mcp_studio_backend/src/mcp_studio/main.py`
- **DI container**: `backend/mcp_studio_backend/src/mcp_studio/container.py`
- **Settings**: `backend/mcp_studio_backend/src/mcp_studio/config/settings.py`
- **Frontend app**: `frontend/ai-server-forge/src/App.tsx`
- **API types**: `frontend/ai-server-forge/src/types/api.ts`
- **API client**: `frontend/ai-server-forge/src/lib/api/client.ts`
- **Auth store**: `frontend/ai-server-forge/src/stores/auth-store.ts`
- **Tailwind config**: `frontend/ai-server-forge/tailwind.config.ts`
