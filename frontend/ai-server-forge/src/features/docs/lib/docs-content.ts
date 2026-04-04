export interface DocSection {
  id: string;
  title: string;
  content: string;
}

export const docSections: DocSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    content: `MCPStudio is "The Postman for Model Context Protocol" — a web platform for creating, testing, managing, and discovering MCP servers.

Quick Start:
1. Sign up or log in to your account
2. Click "New MCP Server" to add your first server
3. Configure the connection URL and authentication
4. Connect to discover available tools
5. Execute tools, build pipelines, and compare results in the Arena

Prerequisites:
- Backend running on port 8000 (or configure in Settings)
- At least one MCP-compatible server to connect to`,
  },
  {
    id: 'mcp-protocol',
    title: 'MCP Protocol Overview',
    content: `The Model Context Protocol (MCP) is a standard for connecting AI models to external tools and data sources.

Key Concepts:
- Servers: MCP servers expose tools, resources, and prompts
- Tools: Executable functions with typed parameters and return values
- Resources: Data sources (files, APIs, databases) exposed by servers
- Prompts: Reusable prompt templates for tool execution

Connection URLs follow the format: scheme://endpoint
Example: googledrive://default`,
  },
  {
    id: 'server-management',
    title: 'Server Management',
    content: `Servers are the core of MCPStudio. Each server represents a connection to an MCP-compatible service.

Creating a Server:
- Navigate to Dashboard and click "New MCP Server"
- Enter a name, description, and connection URL
- Optionally configure authentication (API key, OAuth, etc.)

Connecting:
- Click "Connect" on any server card or detail page
- MCPStudio will discover all available tools automatically
- Status indicators show: Connected (green), Disconnected (gray), Error (red)

Exporting/Importing:
- Export server config as JSON or YAML from the server detail page
- Import configs via file upload or paste on the Dashboard`,
  },
  {
    id: 'tools-execution',
    title: 'Tools & Execution',
    content: `Tools are executable functions exposed by MCP servers.

Browsing Tools:
- View all tools across servers in the Tools Library (/tools)
- Filter by server or search by name/description
- Click any tool to navigate to its server for execution

Executing Tools:
- Select a tool from the server detail page's Execution tab
- Fill in the parameter form (auto-generated from the tool's schema)
- Click "Execute" to run the tool
- View results in the terminal-style output panel

Execution History:
- All executions are stored locally in your browser (IndexedDB)
- View metrics charts: timing trends, tool distribution, success/error rates`,
  },
  {
    id: 'pipelines',
    title: 'Visual Pipelines',
    content: `Pipelines let you chain multiple tools together in a visual DAG (Directed Acyclic Graph).

Building a Pipeline:
- Navigate to Pipelines and click "New Pipeline"
- Drag tools from the sidebar palette onto the canvas
- Connect nodes by dragging from output handles to input handles
- Configure parameters for each tool node
- Map outputs from upstream nodes to downstream inputs

Execution:
- Click "Run" in the toolbar to execute the pipeline
- Nodes execute in topological order (respecting dependencies)
- Watch real-time status updates on each node
- Failed nodes skip their downstream dependencies

Features:
- Auto-layout with dagre algorithm
- Save/load pipelines (persisted in IndexedDB)
- Export pipeline as JSON`,
  },
  {
    id: 'arena',
    title: 'Execution Arena',
    content: `The Arena provides side-by-side comparison of tool executions.

Usage:
- Navigate to Arena from the sidebar
- Configure left and right panels independently
- Select different servers, tools, or parameters for each panel
- Execute both and compare results
- JSON diff view highlights differences between outputs
- Timing comparison shows relative performance`,
  },
  {
    id: 'resources-prompts',
    title: 'Resources & Prompts',
    content: `Resources:
- MCP servers can expose data sources as resources
- Browse resources per server on the Resources page
- Resources include URIs, descriptions, and MIME types

Prompt Templates:
- Create reusable prompt patterns with variable placeholders
- Use {{variable_name}} syntax for dynamic values
- Tag and organize prompts for easy discovery
- Link prompts to specific servers or tools`,
  },
  {
    id: 'api-reference',
    title: 'API Reference',
    content: `MCPStudio Backend API Endpoints:

Authentication:
  POST /api/auth/register     - Register new user
  POST /api/auth/token        - Login (OAuth2 password flow)
  GET  /api/auth/me           - Current user info

Servers:
  POST   /api/servers              - Create server
  GET    /api/servers              - List all servers
  GET    /api/servers/{id}         - Get server details
  PUT    /api/servers/{id}         - Update server
  DELETE /api/servers/{id}         - Delete server
  POST   /api/servers/{id}/connect    - Connect & discover tools
  POST   /api/servers/{id}/disconnect - Disconnect

Tools:
  GET  /api/tools                            - List all tools
  GET  /api/servers/{id}/tools               - List server tools
  GET  /api/tools/{id}                       - Get tool details
  POST /api/servers/{id}/tools/{id}/execute  - Execute tool

Resources:
  GET /api/servers/{id}/resources - List server resources`,
  },
];
