# File: src/mcp_studio/api/routes/tool_routes.py
from fastapi import APIRouter, Depends, HTTPException, status

from mcp_studio.api.controllers.tool_controller import ToolController
from mcp_studio.api.schemas.tool_schema import (
    ToolResponse,
    ToolExecutionRequest,
    ToolExecutionResponse,
    ToolListResponse
)
from mcp_studio.container import get_container

router = APIRouter()


def get_tool_controller() -> ToolController:
    return get_container().tool_controller()


@router.get("/servers/{server_id}/tools", response_model=ToolListResponse)
async def get_tools_for_server(
    server_id: str,
    tool_controller: ToolController = Depends(get_tool_controller),
):
    """Get tools for a server."""
    return await tool_controller.get_tools_for_server(server_id, {"id": "1", "username": "user"})


@router.get("/tools/{tool_id}", response_model=ToolResponse)
async def get_tool_by_id(
    tool_id: str,
    tool_controller: ToolController = Depends(get_tool_controller),
):
    """Get a tool by ID."""
    return await tool_controller.get_tool_by_id(tool_id, {"id": "1", "username": "user"})


@router.post("/servers/{server_id}/tools/{tool_id}/execute", response_model=ToolExecutionResponse)
async def execute_tool(
    server_id: str,
    tool_id: str,
    request: ToolExecutionRequest,
    tool_controller: ToolController = Depends(get_tool_controller),
):
    """Execute a tool."""
    return await tool_controller.execute_tool(server_id, tool_id, request, {"id": "1", "username": "user"})
