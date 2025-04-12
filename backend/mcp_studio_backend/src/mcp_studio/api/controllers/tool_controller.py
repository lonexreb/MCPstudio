# File: src/mcp_studio/api/controllers/tool_controller.py
import logging
from typing import List, Dict, Any

from fastapi import HTTPException, status, Depends

from mcp_studio.api.schemas.tool_schema import (
    ToolResponse, 
    ToolExecutionRequest, 
    ToolExecutionResponse,
    ToolListResponse
)
from mcp_studio.application.services.server_service import ServerService
from mcp_studio.application.services.tool_service import ToolService
from mcp_studio.api.controllers.auth_controller import AuthController

logger = logging.getLogger(__name__)


class ToolController:
    """Controller for tool-related endpoints."""
    
    def __init__(
        self,
        tool_service: ToolService,
        server_service: ServerService,
        auth_controller: AuthController
    ):
        self.tool_service = tool_service
        self.server_service = server_service
        self.auth_controller = auth_controller
    
    async def get_tools_for_server(
        self, 
        server_id: str,
        current_user: Dict[str, Any]
    ) -> ToolListResponse:
        """
        Get tools for a server.
        
        Args:
            server_id: ID of the server
            current_user: Current authenticated user
            
        Returns:
            List of tools
        """
        try:
            tools = await self.tool_service.get_tools_for_server(server_id)
            
            return ToolListResponse(
                tools=[
                    ToolResponse(
                        id=tool.id,
                        name=tool.name,
                        description=tool.description,
                        parameters=tool.parameters,
                        returns=tool.returns
                    )
                    for tool in tools
                ]
            )
        except Exception as e:
            logger.error(f"Error getting tools for server: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error getting tools: {str(e)}"
            )
    
    async def get_tool_by_id(
        self, 
        tool_id: str,
        current_user: Dict[str, Any]
    ) -> ToolResponse:
        """
        Get a tool by ID.
        
        Args:
            tool_id: ID of the tool
            current_user: Current authenticated user
            
        Returns:
            Tool details
        """
        try:
            tool = await self.tool_service.get_tool_by_id(tool_id)
            
            if not tool:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Tool with ID {tool_id} not found"
                )
            
            return ToolResponse(
                id=tool.id,
                name=tool.name,
                description=tool.description,
                parameters=tool.parameters,
                returns=tool.returns
            )
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error getting tool: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error getting tool: {str(e)}"
            )
    
    async def execute_tool(
        self, 
        server_id: str,
        tool_id: str,
        request: ToolExecutionRequest,
        current_user: Dict[str, Any]
    ) -> ToolExecutionResponse:
        """
        Execute a tool.
        
        Args:
            server_id: ID of the server
            tool_id: ID of the tool to execute
            request: Tool execution request with parameters
            current_user: Current authenticated user
            
        Returns:
            Tool execution result
        """
        try:
            result = await self.server_service.execute_tool(
                server_id,
                tool_id,
                request.parameters
            )
            
            return ToolExecutionResponse(
                tool_id=tool_id,
                parameters=request.parameters,
                result=result.result,
                status=result.status,
                execution_time=result.execution_time
            )
        except Exception as e:
            logger.error(f"Error executing tool: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error executing tool: {str(e)}"
            )