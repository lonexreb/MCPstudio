# File: src/mcp_studio/domain/repositories/execution_repository.py
from abc import ABC, abstractmethod
from typing import List, Optional

from mcp_studio.domain.models.execution_result import ExecutionResult


class ExecutionRepository(ABC):
    """Interface for execution result repository implementations."""

    @abstractmethod
    async def save(self, result: ExecutionResult) -> ExecutionResult:
        pass

    @abstractmethod
    async def find_by_id(self, execution_id: str) -> Optional[ExecutionResult]:
        pass

    @abstractmethod
    async def find_all(self, limit: int = 100, offset: int = 0) -> List[ExecutionResult]:
        pass

    @abstractmethod
    async def find_by_server_id(self, server_id: str, limit: int = 50) -> List[ExecutionResult]:
        pass

    @abstractmethod
    async def find_by_tool_id(self, tool_id: str, limit: int = 50) -> List[ExecutionResult]:
        pass

    @abstractmethod
    async def count(self, server_id: Optional[str] = None, tool_id: Optional[str] = None) -> int:
        pass

    @abstractmethod
    async def delete_all(self, server_id: Optional[str] = None) -> bool:
        pass
