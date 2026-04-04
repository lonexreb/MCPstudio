# File: src/mcp_studio/application/services/execution_service.py
import logging
from typing import List, Optional, Dict, Any

from mcp_studio.domain.models.execution_result import ExecutionResult
from mcp_studio.domain.repositories.execution_repository import ExecutionRepository

logger = logging.getLogger(__name__)


class ExecutionService:
    """Service for execution history operations."""

    def __init__(self, execution_repository: ExecutionRepository):
        self.execution_repository = execution_repository

    async def save_execution(
        self,
        server_id: str,
        server_name: str,
        tool_id: str,
        tool_name: str,
        parameters: Dict[str, Any],
        result: Dict[str, Any],
        status: str,
        execution_time: int,
        user_id: Optional[str] = None,
        error_message: Optional[str] = None,
    ) -> ExecutionResult:
        execution = ExecutionResult(
            server_id=server_id,
            server_name=server_name,
            tool_id=tool_id,
            tool_name=tool_name,
            parameters=parameters,
            result=result,
            status=status,
            execution_time=execution_time,
            user_id=user_id,
            error_message=error_message,
        )
        return await self.execution_repository.save(execution)

    async def get_execution_by_id(self, execution_id: str) -> Optional[ExecutionResult]:
        return await self.execution_repository.find_by_id(execution_id)

    async def get_execution_history(
        self,
        server_id: Optional[str] = None,
        tool_id: Optional[str] = None,
        limit: int = 50,
        offset: int = 0,
    ) -> List[ExecutionResult]:
        if server_id:
            return await self.execution_repository.find_by_server_id(server_id, limit)
        if tool_id:
            return await self.execution_repository.find_by_tool_id(tool_id, limit)
        return await self.execution_repository.find_all(limit, offset)

    async def count_executions(
        self,
        server_id: Optional[str] = None,
        tool_id: Optional[str] = None,
    ) -> int:
        return await self.execution_repository.count(server_id, tool_id)

    async def clear_history(self, server_id: Optional[str] = None) -> bool:
        return await self.execution_repository.delete_all(server_id)
