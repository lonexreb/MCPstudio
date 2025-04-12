# File: src/mcp_studio/application/services/server_service.py
import logging
from typing import List, Dict, Any, Optional

from mcp_studio.domain.models.server import Server
from mcp_studio.domain.models.tool import Tool
from mcp_studio.domain.repositories.server_repository import ServerRepository
from mcp_studio.domain.repositories.tool_repository import ToolRepository
from mcp_studio.domain.services.mcp_protocol_service import MCPProtocolService
from mcp_studio.infrastructure.messaging.event_bus import EventBus, ServerStatusEvent

logger = logging.getLogger(__name__)


class ServerService:
    """Service for server operations."""
    
    def __init__(
        self,
        server_repository: ServerRepository,
        tool_repository: ToolRepository,
        mcp_protocol_service: MCPProtocolService,
        event_bus: EventBus
    ):
        """Initialize with repositories and services."""
        self.server_repository = server_repository
        self.tool_repository = tool_repository
        self.mcp_protocol_service = mcp_protocol_service
        self.event_bus = event_bus
        self.tool_service = None
    
    def with_tool_service(self, tool_service):
        """Set the tool service reference to resolve circular dependency."""
        self.tool_service = tool_service
        return self
    
    async def create_server(self, server_data: Dict[str, Any]) -> Server:
        """Create a new server."""
        # Create server instance
        server = Server(
            name=server_data.get("name", ""),
            description=server_data.get("description", ""),
            connection_url=server_data.get("connection_url", ""),
            status="disconnected"
        )
        
        # Set auth config if provided
        if "auth_config" in server_data:
            server.set_auth_config(server_data["auth_config"])
        
        # Save to repository
        server = await self.server_repository.save(server)
        
        # Publish event
        await self.event_bus.publish(
            ServerStatusEvent(server_id=server.id, status="disconnected")
        )
        
        return server
    
    async def get_server_by_id(self, server_id: str) -> Optional[Server]:
        """Get a server by ID."""
        return await self.server_repository.find_by_id(server_id)
    
    async def get_all_servers(self) -> List[Server]:
        """Get all servers."""
        return await self.server_repository.find_all()
    
    async def update_server(self, server_id: str, server_data: Dict[str, Any]) -> Optional[Server]:
        """Update a server."""
        # Get existing server
        server = await self.server_repository.find_by_id(server_id)
        if not server:
            return None
        
        # Update fields if provided
        if "name" in server_data:
            server.name = server_data["name"]
        if "description" in server_data:
            server.description = server_data["description"]
        if "connection_url" in server_data:
            server.connection_url = server_data["connection_url"]
        if "status" in server_data:
            server.update_status(server_data["status"])
        if "auth_config" in server_data:
            server.set_auth_config(server_data["auth_config"])
        
        # Save updated server
        server = await self.server_repository.save(server)
        
        # Publish event if status changed
        if "status" in server_data:
            await self.event_bus.publish(
                ServerStatusEvent(server_id=server_id, status=server_data["status"])
            )
        
        return server
    
    async def delete_server(self, server_id: str) -> bool:
        """Delete a server."""
        # Delete the server
        result = await self.server_repository.delete(server_id)
        
        if result:
            # Delete associated tools
            await self.tool_repository.delete_by_server_id(server_id)
            
            # Publish event
            await self.event_bus.publish(
                ServerStatusEvent(server_id=server_id, status="deleted")
            )
        
        return result
    
    async def connect_to_server(self, server_id: str) -> Optional[Server]:
        """Connect to a server and discover its tools."""
        # Get existing server
        server = await self.server_repository.find_by_id(server_id)
        if not server:
            return None
        
        try:
            # Connect to the server
            connection = await self.mcp_protocol_service.connect(
                url=server.connection_url,
                auth_config=server.auth_config
            )
            
            # Discover tools
            tool_definitions = await self.mcp_protocol_service.discover_tools(connection)
            
            # Create tool entities
            for tool_def in tool_definitions:
                tool = Tool(
                    name=tool_def.get("name", ""),
                    description=tool_def.get("description", ""),
                    server_id=server_id,
                    parameters=tool_def.get("parameters", []),
                    returns=tool_def.get("returns", {})
                )
                
                # Save to repository
                tool = await self.tool_repository.save(tool)
                
                # Add to server
                server.add_tool(tool)
            
            # Update server status
            server.update_status("connected")
            server = await self.server_repository.save(server)
            
            # Publish event
            await self.event_bus.publish(
                ServerStatusEvent(server_id=server_id, status="connected")
            )
            
            return server
        except Exception as e:
            logger.error(f"Error connecting to server {server_id}: {e}")
            
            # Update server status to error
            server.update_status("error")
            server = await self.server_repository.save(server)
            
            # Publish event
            await self.event_bus.publish(
                ServerStatusEvent(
                    server_id=server_id, 
                    status="error",
                    message=str(e)
                )
            )
            
            return server
    
    async def disconnect_from_server(self, server_id: str) -> Optional[Server]:
        """Disconnect from a server."""
        # Get existing server
        server = await self.server_repository.find_by_id(server_id)
        if not server:
            return None
        
        # Update server status
        server.update_status("disconnected")
        server = await self.server_repository.save(server)
        
        # Publish event
        await self.event_bus.publish(
            ServerStatusEvent(server_id=server_id, status="disconnected")
        )
        
        return server