# MCPStudio: The Postman for Model Context Protocol

## Introduction

MCPStudio is a powerful, user-friendly platform designed to create, test, manage, and discover Model Context Protocol (MCP) servers. Similar to how Postman revolutionized API development and testing, MCPStudio provides an intuitive visual interface for interacting with MCP servers, abstracting away the underlying technical complexities of the protocol.

## What is Model Context Protocol (MCP)?

The Model Context Protocol is a standard that enables AI systems (like large language models) to seamlessly connect with external tools, data sources, and services. MCPStudio makes this integration process accessible to both technical and non-technical users through a visual, user-friendly interface.

## Core Architecture

MCPStudio follows a clean domain-driven design with:

### Backend (Python/FastAPI)
- Organized in layers: API, Application, Domain, and Infrastructure
- Uses dependency injection (via the `container.py` file)
- Implements MCP protocol services that can connect to various external tools
- Has MongoDB integration for persistence
- Provides RESTful APIs for server and tool management

### Frontend (React)
- Modern UI with components for servers, tools, and configurations
- Interactive tool testing interface
- Server deployment and management
- Dashboard for monitoring server status

## Key Features

### Server Management
- Create and configure MCP servers through an intuitive UI
- Monitor server status and health in real-time (deployed, deploying, failed)
- Organize servers with tags and collections
- View server details and configurations

### Tool Discovery and Testing
- Visually browse tools exposed by MCP servers
- Test tools with a parameter-driven interface
- View formatted responses with syntax highlighting
- Save tool executions for future reference

### Authentication Management
- OAuth flow support for service integrations
- Secure credential storage
- Automatic token refresh handling
- JWT-based authentication for the platform itself

### Google Drive Integration
- Connect to Google Drive via OAuth
- List and browse files
- Search for content
- Retrieve file content
- Create folders

### Real-time Collaboration
- Share servers and tools with team members
- Collaborate on tool testing
- View execution history

## Implementation Status

### Phase 1: Backend Infrastructure (Completed)
- ✅ MongoDB repository implementations for servers and tools
- ✅ Event Bus for real-time updates via WebSockets
- ✅ JWT authentication system with OAuth integration
- ✅ Google Drive integration with OAuth flow
- ✅ Unit tests for core functionality

### Phase 2: Frontend Development (In Progress)
- React frontend with modern toolchain
- Server connection management panel
- Tool discovery and browsing interface
- Parameter input forms for tool execution
- Response visualization components
- Authentication UI with OAuth flow integration

### Phase 3: End-to-End Integration (Planned)
- API clients in the frontend
- WebSocket connections for real-time updates
- Consistent error handling

### Phase 4: Additional MCP Integrations (Planned)
- GitHub as second integration
- Template system for new integrations

## How It Works

1. Users can create and configure MCP servers through the UI
2. MCPStudio connects to these servers using the MCP protocol
3. It discovers available tools and presents them in a user-friendly interface
4. Users can test tools with different parameters and view responses
5. Servers can be deployed and their status monitored

## Technology Stack

### Backend
- **Language:** Python 3.10+
- **Framework:** FastAPI
- **Database:** MongoDB
- **Package Management:** UV (ultra-fast Python package manager)
- **Authentication:** JWT + OAuth2
- **Real-time Communication:** WebSockets

### Frontend
- **Framework:** React
- **State Management:** Redux
- **UI Components:** Tailwind CSS
- **API Communication:** Axios

## Project Structure

```
MCPstudio/
├── backend/                  # Backend application
│   └── mcp_studio_backend/   # Python package
│       ├── src/              # Source code
│       │   └── mcp_studio/   # Main module
│       └── tests/            # Test suite
└── frontend/                 # Frontend application
    └── ai-server-forge/      # React application
        ├── src/              # Source code
        │   ├── components/   # React components
        │   ├── hooks/        # Custom React hooks
        │   ├── lib/          # Utility functions
        │   ├── pages/        # Page components
        │   └── types/        # TypeScript type definitions
        └── public/           # Static assets
```

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 16+
- MongoDB
- UV package manager (optional, but recommended)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/lonexreb/mcpstudio.git
   cd mcpstudio
   ```

2. Set up the backend
   ```bash
   cd backend/mcp_studio_backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -e .
   ```

3. Set up the frontend
   ```bash
   cd ../../frontend/ai-server-forge
   npm install
   ```

4. Start the development servers
   
   Backend:
   ```bash
   cd ../../backend/mcp_studio_backend
   uvicorn mcp_studio.main:app --reload
   ```
   
   Frontend:
   ```bash
   cd ../../frontend/ai-server-forge
   npm run dev
   ```

5. Open your browser and navigate to http://localhost:3000

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
