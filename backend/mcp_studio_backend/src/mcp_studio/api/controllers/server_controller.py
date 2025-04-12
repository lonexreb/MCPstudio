# File: src/mcp_studio/api/controllers/server_controller.py
from typing import List, Dict, Any, Optional
from fastapi import HTTPException, status

from mcp_studio.domain.models.server import Server
from mcp_studio.domain.repositories.server_repository import ServerRepository
from mcp_studio.infrastructure.messaging.event_bus import EventBus, ServerStatusEvent
from mcp_studio.api.schemas.server_schema import ServerCreate, ServerUpdate, ServerResponse, ServerListResponse


class ServerController:
    """Controller for server-related operations."""
    
    def __init__(self, server_repository: ServerRepository, event_bus: EventBus):
        self.server_repository = server_repository
        self.event_bus = event_bus
    
    async def create_server(self, server_data: ServerCreate, user: Dict[str, Any]) -> ServerResponse:
        """Create a new server."""
        server = Server(
            name=server_data.name,
            description=server_data.description,
            connection_url=server_data.connection_url,
            status="disconnected"
        )
        
        if server_data.auth_config:
            server.set_auth_config(server_data.auth_config.dict())
        
        # Save to repository
        server_id = await self.server_repository.save(server)
        server.id = server_id
        
        # Publish event
        await self.event_bus.publish(
            ServerStatusEvent(server_id=str(server_id), status="disconnected")
        )
        
        return ServerResponse.model_validate(server)
    
    async def get_servers(self, user: Dict[str, Any]) -> ServerListResponse:
        """Get all servers."""
        servers = await self.server_repository.find_all()
        return ServerListResponse(
            servers=[ServerResponse.model_validate(server) for server in servers],
            total=len(servers)
        )
    
    async def get_server_by_id(self, server_id: str, user: Dict[str, Any]) -> ServerResponse:
        """Get a server by ID."""
        server = await self.server_repository.find_by_id(server_id)
        if not server:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Server with ID {server_id} not found"
            )
        return ServerResponse.model_validate(server)
    
    async def update_server(self, server_id: str, server_data: ServerUpdate, user: Dict[str, Any]) -> ServerResponse:
        """Update a server."""
        server = await self.server_repository.find_by_id(server_id)
        if not server:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Server with ID {server_id} not found"
            )
        
        # Update fields if provided
        if server_data.name is not None:
            server.name = server_data.name
        if server_data.description is not None:
            server.description = server_data.description
        if server_data.connection_url is not None:
            server.connection_url = server_data.connection_url
        if server_data.status is not None:
            server.update_status(server_data.status)
        if server_data.auth_config is not None:
            server.set_auth_config(server_data.auth_config.dict())
        
        # Save updated server
        await self.server_repository.save(server)
        
        # Publish event if status changed
        if server_data.status is not None:
            await self.event_bus.publish(
                ServerStatusEvent(server_id=str(server_id), status=server_data.status)
            )
        
        return ServerResponse.model_validate(server)
    
    async def delete_server(self, server_id: str, user: Dict[str, Any]) -> Dict[str, Any]:
        """Delete a server."""
        server = await self.server_repository.find_by_id(server_id)
        if not server:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Server with ID {server_id} not found"
            )
        
        # Delete the server
        await self.server_repository.delete(server_id)
        
        # Publish event
        await self.event_bus.publish(
            ServerStatusEvent(server_id=str(server_id), status="deleted")
        )
        
        return {"message": f"Server with ID {server_id} deleted successfully"}
    
    async def connect_to_server(self, server_id: str, user: Dict[str, Any]) -> ServerResponse:
        """Connect to a server and discover its tools."""
        server = await self.server_repository.find_by_id(server_id)
        if not server:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Server with ID {server_id} not found"
            )
        
        # TODO: Implement actual connection logic
        # For now, just update the status
        server.update_status("connected")
        await self.server_repository.save(server)
        
        # Publish event
        await self.event_bus.publish(
            ServerStatusEvent(server_id=str(server_id), status="connected")
        )
        
        return ServerResponse.model_validate(server)
    
    async def disconnect_from_server(self, server_id: str, user: Dict[str, Any]) -> ServerResponse:
        """Disconnect from a server."""
        server = await self.server_repository.find_by_id(server_id)
        if not server:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Server with ID {server_id} not found"
            )
        
        # Update status
        server.update_status("disconnected")
        await self.server_repository.save(server)
        
        # Publish event
        await self.event_bus.publish(
            ServerStatusEvent(server_id=str(server_id), status="disconnected")
        )
        
        return ServerResponse.model_validate(server)