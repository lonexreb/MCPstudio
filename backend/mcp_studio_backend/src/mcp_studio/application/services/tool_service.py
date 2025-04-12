# File: src/mcp_studio/application/services/tool_service.py
import logging
import time
from typing import List, Dict, Any, Optional

from mcp_studio.domain.models.tool import Tool
from mcp_studio.domain.repositories.tool_repository import ToolRepository
from mcp_studio.domain.repositories.server_repository import ServerRepository
from mcp_studio.domain.services.mcp_protocol_service import MCPProtocolService
from mcp_studio.infrastructure.messaging.event_bus import EventBus, ToolExecutionEvent

logger = logging.getLogger(__name__)


class ToolService:
    """Service for tool operations."""
    
    def __init__(
        self,
        tool_repository: ToolRepository,
        server_repository: ServerRepository,
        mcp_protocol_service: MCPProtocolService,
        event_bus: EventBus
    ):
        """Initialize with repositories and services."""
        self.tool_repository = tool_repository
        self.server_repository = server_repository
        self.mcp_protocol_service = mcp_protocol_service
        self.event_bus = event_bus
        self.server_service = None
    
    def with_server_service(self, server_service):
        """Set the server service reference to resolve circular dependency."""
        self.server_service = server_service
        return self
    
    async def get_tool_by_id(self, tool_id: str) -> Optional[Tool]:
        """Get a tool by its ID."""
        return await self.tool_repository.find_by_id(tool_id)
    
    async def get_tools_by_server_id(self, server_id: str) -> List[Tool]:
        """Get all tools for a specific server."""
        return await self.tool_repository.find_by_server_id(server_id)
    
    async def get_all_tools(self) -> List[Tool]:
        """Get all tools."""
        return await self.tool_repository.find_all()
    
    async def delete_tool(self, tool_id: str) -> bool:
        """Delete a tool by its ID."""
        return await self.tool_repository.delete(tool_id)
    
    async def execute_tool(self, tool_id: str, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a tool with provided parameters."""
        # Get the tool entity
        tool = await self.tool_repository.find_by_id(tool_id)
        if not tool:
            raise ValueError(f"Tool not found: {tool_id}")
        
        # Get the server entity
        server = await self.server_repository.find_by_id(tool.server_id)
        if not server:
            raise ValueError(f"Server not found for tool: {tool_id}")
        
        # Publish tool execution started event
        await self.event_bus.publish(
            ToolExecutionEvent(
                server_id=server.id,
                tool_id=tool_id,
                status="started"
            )
        )
        
        try:
            # Connect to the server
            connection = await self.mcp_protocol_service.connect(
                url=server.connection_url,
                auth_config=server.auth_config
            )
            
            # Measure execution time
            start_time = time.time()
            
            # Execute the tool
            result = await self.mcp_protocol_service.execute_tool(
                url=server.connection_url,
                tool_name=tool.name,
                parameters=parameters
            )
            
            # Calculate execution time in milliseconds
            execution_time = int((time.time() - start_time) * 1000)
            
            # Create response
            response = {
                "tool_id": tool_id,
                "parameters": parameters,
                "result": result,
                "status": "success",
                "execution_time": execution_time
            }
            
            # Publish tool execution completed event
            await self.event_bus.publish(
                ToolExecutionEvent(
                    server_id=server.id,
                    tool_id=tool_id,
                    status="completed",
                    result=result
                )
            )
            
            return response
        except Exception as e:
            logger.error(f"Error executing tool {tool_id}: {e}")
            
            # Create error response
            error_response = {
                "tool_id": tool_id,
                "parameters": parameters,
                "result": {"error": str(e)},
                "status": "error",
                "execution_time": 0
            }
            
            # Publish tool execution error event
            await self.event_bus.publish(
                ToolExecutionEvent(
                    server_id=server.id,
                    tool_id=tool_id,
                    status="error",
                    result={"error": str(e)}
                )
            )
            
            return error_response