# File: src/mcp_studio/api/routes/execution_routes.py
from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, Query

from mcp_studio.api.controllers.execution_controller import ExecutionController
from mcp_studio.api.schemas.execution_schema import ExecutionResultResponse, ExecutionHistoryResponse
from mcp_studio.api.deps import get_current_user
from mcp_studio.container import get_container

router = APIRouter()


def get_execution_controller() -> ExecutionController:
    return get_container().execution_controller()


@router.get("/executions", response_model=ExecutionHistoryResponse)
async def get_executions(
    server_id: Optional[str] = Query(None),
    tool_id: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
    current_user: Dict[str, Any] = Depends(get_current_user),
    controller: ExecutionController = Depends(get_execution_controller),
):
    """Get execution history with optional filters."""
    return await controller.get_executions(
        server_id=server_id, tool_id=tool_id, limit=limit, offset=offset
    )


@router.get("/executions/{execution_id}", response_model=ExecutionResultResponse)
async def get_execution_by_id(
    execution_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
    controller: ExecutionController = Depends(get_execution_controller),
):
    """Get a specific execution by ID."""
    return await controller.get_execution_by_id(execution_id)


@router.delete("/executions")
async def clear_executions(
    server_id: Optional[str] = Query(None),
    current_user: Dict[str, Any] = Depends(get_current_user),
    controller: ExecutionController = Depends(get_execution_controller),
):
    """Clear execution history."""
    return await controller.clear_history(server_id)
