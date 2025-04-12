#!/bin/bash
# Script to create a Python-based backend structure for MCPStudio
# This structure follows domain-driven design principles

echo "Creating MCPStudio Python backend structure..."

# Create root project directory
mkdir -p mcp_studio_backend
cd mcp_studio_backend

# Create UV-specific configuration files
touch pyproject.toml      # Project configuration for UV
touch .python-version     # Python version specification
touch .gitignore          # Git ignore file
touch README.md           # Project documentation

# Create application structure
mkdir -p src/mcp_studio   # Main package directory
touch src/mcp_studio/__init__.py

# API Layer (Presentation)
mkdir -p src/mcp_studio/api/controllers
mkdir -p src/mcp_studio/api/routes
mkdir -p src/mcp_studio/api/schemas
mkdir -p src/mcp_studio/api/websocket
touch src/mcp_studio/api/__init__.py
touch src/mcp_studio/api/controllers/__init__.py
touch src/mcp_studio/api/controllers/server_controller.py
touch src/mcp_studio/api/controllers/tool_controller.py
touch src/mcp_studio/api/controllers/auth_controller.py
touch src/mcp_studio/api/routes/__init__.py
touch src/mcp_studio/api/routes/server_routes.py
touch src/mcp_studio/api/routes/tool_routes.py
touch src/mcp_studio/api/routes/auth_routes.py
touch src/mcp_studio/api/schemas/__init__.py
touch src/mcp_studio/api/schemas/server_schema.py
touch src/mcp_studio/api/schemas/tool_schema.py
touch src/mcp_studio/api/schemas/auth_schema.py
touch src/mcp_studio/api/websocket/__init__.py
touch src/mcp_studio/api/websocket/server_status.py
touch src/mcp_studio/api/websocket/tool_execution.py

# Application Layer
mkdir -p src/mcp_studio/application/services
mkdir -p src/mcp_studio/application/dtos
touch src/mcp_studio/application/__init__.py
touch src/mcp_studio/application/services/__init__.py
touch src/mcp_studio/application/services/server_service.py
touch src/mcp_studio/application/services/tool_service.py
touch src/mcp_studio/application/services/auth_service.py
touch src/mcp_studio/application/dtos/__init__.py
touch src/mcp_studio/application/dtos/server_dto.py
touch src/mcp_studio/application/dtos/tool_dto.py

# Domain Layer
mkdir -p src/mcp_studio/domain/models
mkdir -p src/mcp_studio/domain/repositories
mkdir -p src/mcp_studio/domain/services
mkdir -p src/mcp_studio/domain/events
touch src/mcp_studio/domain/__init__.py
touch src/mcp_studio/domain/models/__init__.py
touch src/mcp_studio/domain/models/server.py
touch src/mcp_studio/domain/models/tool.py
touch src/mcp_studio/domain/models/execution_result.py
touch src/mcp_studio/domain/repositories/__init__.py
touch src/mcp_studio/domain/repositories/server_repository.py
touch src/mcp_studio/domain/repositories/tool_repository.py
touch src/mcp_studio/domain/services/__init__.py
touch src/mcp_studio/domain/services/mcp_protocol_service.py
touch src/mcp_studio/domain/services/schema_service.py
touch src/mcp_studio/domain/events/__init__.py
touch src/mcp_studio/domain/events/server_events.py
touch src/mcp_studio/domain/events/tool_events.py

# Infrastructure Layer
mkdir -p src/mcp_studio/infrastructure/database
mkdir -p src/mcp_studio/infrastructure/database/models
mkdir -p src/mcp_studio/infrastructure/database/repositories
mkdir -p src/mcp_studio/infrastructure/external/google_drive
mkdir -p src/mcp_studio/infrastructure/logging
mkdir -p src/mcp_studio/infrastructure/messaging
touch src/mcp_studio/infrastructure/__init__.py
touch src/mcp_studio/infrastructure/database/__init__.py
touch src/mcp_studio/infrastructure/database/connection.py
touch src/mcp_studio/infrastructure/database/models/__init__.py
touch src/mcp_studio/infrastructure/database/models/server_model.py
touch src/mcp_studio/infrastructure/database/models/tool_model.py
touch src/mcp_studio/infrastructure/database/repositories/__init__.py
touch src/mcp_studio/infrastructure/database/repositories/mongo_server_repo.py
touch src/mcp_studio/infrastructure/database/repositories/mongo_tool_repo.py
touch src/mcp_studio/infrastructure/external/__init__.py
touch src/mcp_studio/infrastructure/external/google_drive/__init__.py
touch src/mcp_studio/infrastructure/external/google_drive/drive_client.py
touch src/mcp_studio/infrastructure/external/google_drive/drive_tools.py
touch src/mcp_studio/infrastructure/external/google_drive/drive_auth.py
touch src/mcp_studio/infrastructure/logging/__init__.py
touch src/mcp_studio/infrastructure/logging/logger.py
touch src/mcp_studio/infrastructure/messaging/__init__.py
touch src/mcp_studio/infrastructure/messaging/event_bus.py

# Utilities
mkdir -p src/mcp_studio/utils
touch src/mcp_studio/utils/__init__.py
touch src/mcp_studio/utils/errors.py
touch src/mcp_studio/utils/validation.py
touch src/mcp_studio/utils/security.py

# Configuration
mkdir -p src/mcp_studio/config
touch src/mcp_studio/config/__init__.py
touch src/mcp_studio/config/settings.py
touch src/mcp_studio/config/database.py
touch src/mcp_studio/config/auth.py

# Main application files
touch src/mcp_studio/main.py        # FastAPI application entry point
touch src/mcp_studio/container.py   # Dependency injection container

# Tests
mkdir -p tests/unit
mkdir -p tests/integration
mkdir -p tests/e2e
touch tests/__init__.py
touch tests/conftest.py
touch tests/unit/__init__.py
touch tests/unit/test_domain_models.py
touch tests/integration/__init__.py
touch tests/integration/test_api.py
touch tests/e2e/__init__.py
touch tests/e2e/test_server_flow.py

# Create scripts directory
mkdir -p scripts
touch scripts/seed_data.py
touch scripts/deploy.py

# Sample configuration files
mkdir -p deployment
touch deployment/docker-compose.yml
touch deployment/Dockerfile

# Create example .env file
touch .env.example

# Create core files with initial content
cat > pyproject.toml << EOF
[project]
name = "mcp-studio-backend"
version = "0.1.0"
description = "Backend for MCPStudio - The Postman for Model Context Protocol"
readme = "README.md"
requires-python = ">=3.10"
dependencies = [
    "fastapi>=0.109.0",
    "uvicorn[standard]>=0.27.0",
    "pydantic>=2.5.0",
    "motor>=3.3.0",
    "python-jose[cryptography]>=3.3.0",
    "passlib[bcrypt]>=1.7.4",
    "google-api-python-client>=2.117.0",
    "google-auth-oauthlib>=1.2.0",
    "websockets>=12.0",
    "python-multipart>=0.0.9",
    "pydantic-settings>=2.1.0"
]

[project.optional-dependencies]
dev = [
    "pytest>=7.4.0",
    "pytest-asyncio>=0.21.1",
    "black>=23.7.0",
    "isort>=5.12.0",
    "mypy>=1.5.1",
    "ruff>=0.1.0",
]

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"
EOF

echo "Python backend structure created successfully!"
echo ""
echo "Next steps:"
echo "1. Navigate to the project directory: cd mcp_studio_backend"
echo "2. Create a virtual environment with UV: uv venv"
echo "3. Activate the virtual environment: source .venv/bin/activate"
echo "4. Install dependencies: uv pip sync"
echo "5. Start the development server: python -m src.mcp_studio.main"