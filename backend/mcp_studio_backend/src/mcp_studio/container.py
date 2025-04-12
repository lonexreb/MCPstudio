# File: src/mcp_studio/container.py
from typing import Dict, Any
from dependency_injector import containers, providers

from mcp_studio.infrastructure.database.repositories.mongo_server_repo import MongoServerRepository
from mcp_studio.infrastructure.database.repositories.mongo_tool_repo import MongoToolRepository
from mcp_studio.infrastructure.database.connection import database
from mcp_studio.infrastructure.messaging.event_bus import EventBus
from mcp_studio.infrastructure.logging.logger import Logger

from mcp_studio.domain.services.mcp_protocol_service import MCPProtocolService, ServiceRegistry, GoogleDriveService

from mcp_studio.application.services.server_service import ServerService
from mcp_studio.application.services.tool_service import ToolService
from mcp_studio.application.services.auth_service import AuthService

from mcp_studio.api.controllers.server_controller import ServerController
from mcp_studio.api.controllers.tool_controller import ToolController
from mcp_studio.api.controllers.auth_controller import AuthController


class Container(containers.DeclarativeContainer):
    """Dependency injection container."""
    
    # Configuration
    config = providers.Configuration()
    
    # Infrastructure
    database = providers.Singleton(lambda: database)
    logger = providers.Singleton(Logger)
    event_bus = providers.Singleton(EventBus)
    
    # Repositories
    server_repository = providers.Singleton(
        MongoServerRepository,
        database=database
    )
    
    tool_repository = providers.Singleton(
        MongoToolRepository,
        database=database
    )
    
    # Domain services
    service_registry = providers.Singleton(ServiceRegistry)
    
    # Register Google Drive service
    google_drive_service_factory = providers.Callable(
        lambda: GoogleDriveService()
    )
    
    register_google_drive = providers.Callable(
        lambda registry, factory: registry.register_service("googledrive", factory),
        registry=service_registry,
        factory=google_drive_service_factory
    )
    
    mcp_protocol_service = providers.Singleton(
        MCPProtocolService,
        service_registry=service_registry
    )
    
    # Application services
    auth_service = providers.Singleton(
        AuthService
    )
    
    server_service = providers.Singleton(
        ServerService,
        server_repository=server_repository,
        tool_repository=tool_repository,
        mcp_protocol_service=mcp_protocol_service,
        event_bus=event_bus
    )
    
    tool_service = providers.Singleton(
        ToolService,
        tool_repository=tool_repository,
        server_repository=server_repository
    )
    
    # Controllers
    auth_controller = providers.Singleton(
        AuthController,
        auth_service=auth_service,
        server_repository=server_repository
    )
    
    server_controller = providers.Singleton(
        ServerController,
        server_service=server_service,
        auth_controller=auth_controller
    )
    
    tool_controller = providers.Singleton(
        ToolController,
        tool_service=tool_service,
        server_service=server_service,
        auth_controller=auth_controller
    )


# Create container
container = Container()

# Register services
container.register_google_drive()


def get_container() -> Container:
    """Get the DI container."""
    return container