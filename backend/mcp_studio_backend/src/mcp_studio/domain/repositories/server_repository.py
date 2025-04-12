# File: src/mcp_studio/domain/repositories/server_repository.py
from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any

from mcp_studio.domain.models.server import Server


class ServerRepository(ABC):
    """Repository interface for Server entities."""
    
    @abstractmethod
    async def save(self, server: Server) -> str:
        """Save a server and return its ID."""
        pass
    
    @abstractmethod
    async def find_by_id(self, server_id: str) -> Optional[Server]:
        """Find a server by ID."""
        pass
    
    @abstractmethod
    async def find_all(self) -> List[Server]:
        """Find all servers."""
        pass
    
    @abstractmethod
    async def delete(self, server_id: str) -> None:
        """Delete a server by ID."""
        pass
    
    @abstractmethod
    async def find_by_criteria(self, criteria: Dict[str, Any]) -> List[Server]:
        """Find servers matching the given criteria."""
        pass