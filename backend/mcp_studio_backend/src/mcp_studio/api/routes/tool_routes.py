# File: src/mcp_studio/api/routes/tool_routes.py
from fastapi import APIRouter, Depends, HTTPException, status

from mcp_studio.api.controllers.tool_controller import ToolController
from mcp_studio.api.controllers.auth_controller import AuthController
from mcp_studio.api.schemas.tool_schema import (
    ToolResponse, 
    ToolExecutionRequest, 
    ToolExecutionResponse,
    ToolListResponse
)
from mcp_studio.container import get_container

router = APIRouter()


@router.get("/servers/{server_id}/tools", response_model=ToolListResponse)
async def get_tools_for_server(
    server_id: str,
    tool_controller: ToolController = Depends(lambda: get_container().resolve(ToolController)),
    auth_controller: AuthController = Depends(lambda: get_container().resolve(AuthController)),
    current_user: dict = Depends(lambda auth_controller=Depends(lambda: get_container().resolve(AuthController)): 
                                auth_controller.get_current_user())
):
    """
    Get tools for a server.
    """
    return await tool_controller.get_tools_for_server(server_id, current_user)


@router.get("/tools/{tool_id}", response_model=ToolResponse)
async def get_tool_by_id(
    tool_id: str,
    tool_controller: ToolController = Depends(lambda: get_container().resolve(ToolController)),
    auth_controller: AuthController = Depends(lambda: get_container().resolve(AuthController)),
    current_user: dict = Depends(lambda auth_controller=Depends(lambda: get_container().resolve(AuthController)): 
                                auth_controller.get_current_user())
):
    """
    Get a tool by ID.
    """
    return await tool_controller.get_tool_by_id(tool_id, current_user)


@router.post("/servers/{server_id}/tools/{tool_id}/execute", response_model=ToolExecutionResponse)
async def execute_tool(
    server_id: str,
    tool_id: str,
    request: ToolExecutionRequest,
    tool_controller: ToolController = Depends(lambda: get_container().resolve(ToolController)),
    auth_controller: AuthController = Depends(lambda: get_container().resolve(AuthController)),
    current_user: dict = Depends(lambda auth_controller=Depends(lambda: get_container().resolve(AuthController)): 
                                auth_controller.get_current_user())
):
    """
    Execute a tool.
    """
    return await tool_controller.execute_tool(server_id, tool_id, request, current_user)