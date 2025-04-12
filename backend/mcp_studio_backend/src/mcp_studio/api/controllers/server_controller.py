# File: src/mcp_studio/api/controllers/server_controller.py
from typing import List, Dict, Any, Optional
from fastapi import HTTPException, status

from mcp_studio.domain.models.server import Server
from mcp_studio.domain.repositories.server_repository import ServerRepository
from mcp_studio.infrastructure.messaging.event_bus import EventBus, ServerStatusEvent
from mcp_studio.api.schemas.server_schema import ServerCreate, ServerUpdate, ServerResponse, ServerListResponse


class ServerController:
    """Controller for server-related operations."""
    
    def __init__(self, server_service, auth_controller):
        self.server_service = server_service
        self.auth_controller = auth_controller
    
    async def create_server(self, server_data: ServerCreate, user: Dict[str, Any]) -> ServerResponse:
        """Create a new server."""
        server_dict = {
            "name": server_data.name,
            "description": server_data.description,
            "connection_url": server_data.connection_url
        }
        
        if server_data.auth_config:
            server_dict["auth_config"] = server_data.auth_config.dict()
        
        # Create server via service
        server = await self.server_service.create_server(server_dict)
        
        return ServerResponse.model_validate(server)
    
    async def get_servers(self, user: Dict[str, Any]) -> ServerListResponse:
        """Get all servers."""
        servers = await self.server_service.get_all_servers()
        return ServerListResponse(
            servers=[ServerResponse.model_validate(server) for server in servers],
            total=len(servers)
        )
    
    async def get_server_by_id(self, server_id: str, user: Dict[str, Any]) -> ServerResponse:
        """Get a server by ID."""
        server = await self.server_service.get_server_by_id(server_id)
        if not server:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Server with ID {server_id} not found"
            )
        return ServerResponse.model_validate(server)
    
    async def update_server(self, server_id: str, server_data: ServerUpdate, user: Dict[str, Any]) -> ServerResponse:
        """Update a server."""
        server_dict = {}
        
        # Prepare update data
        if server_data.name is not None:
            server_dict["name"] = server_data.name
        if server_data.description is not None:
            server_dict["description"] = server_data.description
        if server_data.connection_url is not None:
            server_dict["connection_url"] = server_data.connection_url
        if server_data.status is not None:
            server_dict["status"] = server_data.status
        if server_data.auth_config is not None:
            server_dict["auth_config"] = server_data.auth_config.dict()
        
        # Update server via service
        server = await self.server_service.update_server(server_id, server_dict)
        
        if not server:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Server with ID {server_id} not found"
            )
        
        return ServerResponse.model_validate(server)
    
    async def delete_server(self, server_id: str, user: Dict[str, Any]) -> Dict[str, Any]:
        """Delete a server."""
        result = await self.server_service.delete_server(server_id)
        
        if not result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Server with ID {server_id} not found"
            )
        
        return {"message": f"Server with ID {server_id} deleted successfully"}
    
    async def connect_to_server(self, server_id: str, user: Dict[str, Any]) -> ServerResponse:
        """Connect to a server and discover its tools."""
        server = await self.server_service.connect_to_server(server_id)
        
        if not server:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Server with ID {server_id} not found"
            )
        
        return ServerResponse.model_validate(server)
    
    async def disconnect_from_server(self, server_id: str, user: Dict[str, Any]) -> ServerResponse:
        """Disconnect from a server."""
        server = await self.server_service.disconnect_from_server(server_id)
        
        if not server:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Server with ID {server_id} not found"
            )
        
        return ServerResponse.model_validate(server)
    
    async def execute_tool(self, server_id: str, tool_id: str, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a tool on a server."""
        # First check if the server exists
        server = await self.server_service.get_server_by_id(server_id)
        if not server:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Server with ID {server_id} not found"
            )
        
        try:
            # Execute the tool using the tool service
            result = await self.server_service.tool_service.execute_tool(tool_id, parameters)
            return result
            
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=str(e)
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error executing tool: {str(e)}"
            )