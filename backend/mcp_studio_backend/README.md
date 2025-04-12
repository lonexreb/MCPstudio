# MCPStudio: The Postman for Model Context Protocol

## Backend

## Introduction

MCPStudio is a powerful, user-friendly platform designed to create, test, manage, and discover Model Context Protocol (MCP) servers. Similar to how Postman revolutionized API development and testing, MCPStudio provides an intuitive visual interface for interacting with MCP servers, abstracting away the underlying technical complexities of the protocol.

## What is Model Context Protocol (MCP)?

The Model Context Protocol is a standard that enables AI systems (like large language models) to seamlessly connect with external tools, data sources, and services. MCPStudio makes this integration process accessible to both technical and non-technical users through a visual, user-friendly interface.

## Why MCPStudio?

Current MCP implementation requires significant technical expertise and involves manual configuration of servers. MCPStudio democratizes this process by providing:

- A visual interface for creating and testing MCP servers
- Simplified authentication flows
- Real-time monitoring of server status
- A consistent management experience across different tool integrations

## Key Features

### Server Management
- Create and configure MCP servers through an intuitive UI
- Monitor server status and health in real-time
- Organize servers with tags and collections

### Tool Discovery and Testing
- Visually browse tools exposed by MCP servers
- Test tools with a parameter-driven interface
- View formatted responses with syntax highlighting
- Save tool executions for future reference

### Authentication Management
- OAuth flow support for service integrations
- Secure credential storage
- Automatic token refresh handling

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

## Technology Stack

### Backend
- **Language:** Python 3.10+
- **Framework:** FastAPI
- **Database:** MongoDB
- **Package Management:** UV (ultra-fast Python package manager)
- **Authentication:** JWT + OAuth2
- **Real-time Communication:** WebSockets

## Project Structure

The backend follows a domain-driven design architecture with clear separation of concerns:

```
mcp_studio_backend/
├── src/
│   └── mcp_studio/
│       ├── api/                # API layer (controllers, routes, schemas)
│       │   ├── controllers/    # Request handlers
│       │   ├── routes/         # API endpoint definitions
│       │   └── schemas/        # Pydantic models for request/response
│       ├── application/        # Application layer
│       │   ├── services/       # Business logic
│       │   └── use_cases/      # Use case implementations
│       ├── domain/             # Domain layer
│       │   ├── entities/       # Core business entities
│       │   ├── repositories/   # Repository interfaces
│       │   └── value_objects/  # Value objects
│       ├── infrastructure/     # Infrastructure layer
│       │   ├── database/       # Database implementations
│       │   ├── repositories/   # Repository implementations
│       │   └── services/       # External service integrations
│       ├── container.py        # Dependency injection container
│       └── main.py             # Application entry point
├── tests/                      # Test suite
└── pyproject.toml             # Project configuration
```

## Getting Started

### Prerequisites

- Python 3.10+
- MongoDB
- UV package manager (optional, but recommended)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/mcpstudio.git
   cd mcpstudio/backend/mcp_studio_backend
   ```

2. Set up a virtual environment
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies
   ```bash
   pip install -e .
   # Or with UV
   uv pip install -e .
   ```

4. Configure environment variables
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. Start the development server
   ```bash
   uvicorn mcp_studio.main:app --reload
   ```

### Running Tests

```bash
pytest
```

## API Documentation

Once the server is running, you can access the API documentation at:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.