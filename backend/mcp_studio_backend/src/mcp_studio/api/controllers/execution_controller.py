# File: src/mcp_studio/api/controllers/execution_controller.py
import logging
from typing import Optional

from fastapi import HTTPException, status

from mcp_studio.api.schemas.execution_schema import ExecutionResultResponse, ExecutionHistoryResponse
from mcp_studio.application.services.execution_service import ExecutionService

logger = logging.getLogger(__name__)


class ExecutionController:
    """Controller for execution history endpoints."""

    def __init__(self, execution_service: ExecutionService):
        self.execution_service = execution_service

    async def get_executions(
        self,
        server_id: Optional[str] = None,
        tool_id: Optional[str] = None,
        limit: int = 50,
        offset: int = 0,
    ) -> ExecutionHistoryResponse:
        try:
            results = await self.execution_service.get_execution_history(
                server_id=server_id, tool_id=tool_id, limit=limit, offset=offset
            )
            total = await self.execution_service.count_executions(
                server_id=server_id, tool_id=tool_id
            )
            return ExecutionHistoryResponse(
                executions=[
                    ExecutionResultResponse(
                        id=r.id,
                        server_id=r.server_id,
                        server_name=r.server_name,
                        tool_id=r.tool_id,
                        tool_name=r.tool_name,
                        parameters=r.parameters,
                        result=r.result,
                        status=r.status,
                        execution_time=r.execution_time,
                        error_message=r.error_message,
                        created_at=r.created_at.isoformat() if r.created_at else "",
                    )
                    for r in results
                ],
                total=total,
            )
        except Exception as e:
            logger.error(f"Error getting executions: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error getting executions: {str(e)}",
            )

    async def get_execution_by_id(self, execution_id: str) -> ExecutionResultResponse:
        result = await self.execution_service.get_execution_by_id(execution_id)
        if not result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Execution {execution_id} not found",
            )
        return ExecutionResultResponse(
            id=result.id,
            server_id=result.server_id,
            server_name=result.server_name,
            tool_id=result.tool_id,
            tool_name=result.tool_name,
            parameters=result.parameters,
            result=result.result,
            status=result.status,
            execution_time=result.execution_time,
            error_message=result.error_message,
            created_at=result.created_at.isoformat() if result.created_at else "",
        )

    async def clear_history(self, server_id: Optional[str] = None):
        await self.execution_service.clear_history(server_id)
        return {"status": "ok", "message": "Execution history cleared"}
