# File: src/mcp_studio/domain/repositories/tool_repository.py
from abc import ABC, abstractmethod
from typing import List, Optional

from mcp_studio.domain.models.tool import Tool


class ToolRepository(ABC):
    """Interface for tool repository implementations."""
    
    @abstractmethod
    async def save(self, tool: Tool) -> Tool:
        """Save a tool to the repository."""
        pass
    
    @abstractmethod
    async def find_by_id(self, tool_id: str) -> Optional[Tool]:
        """Find a tool by its ID."""
        pass
    
    @abstractmethod
    async def find_by_server_id(self, server_id: str) -> List[Tool]:
        """Find all tools for a specific server."""
        pass
    
    @abstractmethod
    async def find_all(self) -> List[Tool]:
        """Find all tools."""
        pass
    
    @abstractmethod
    async def delete(self, tool_id: str) -> bool:
        """Delete a tool by its ID."""
        pass
    
    @abstractmethod
    async def delete_by_server_id(self, server_id: str) -> bool:
        """Delete all tools for a specific server."""
        pass