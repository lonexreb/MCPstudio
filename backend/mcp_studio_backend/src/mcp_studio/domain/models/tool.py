# File: src/mcp_studio/domain/models/tool.py
from datetime import datetime
from typing import List, Dict, Any, Optional


class Tool:
    """Core domain entity representing an MCP tool."""
    
    def __init__(
        self,
        id: Optional[str] = None,
        name: str = "",
        description: str = "",
        server_id: Optional[str] = None,
        parameters: Optional[List[Dict[str, Any]]] = None,
        returns: Optional[Dict[str, Any]] = None
    ):
        self.id = id
        self.name = name
        self.description = description
        self.server_id = server_id
        self.parameters = parameters or []
        self.returns = returns or {}
        self.created_at = datetime.now()
        self.updated_at = datetime.now()
    
    def update_parameters(self, parameters: List[Dict[str, Any]]) -> None:
        """Update the tool parameters."""
        self.parameters = parameters
        self.updated_at = datetime.now()
    
    def update_returns(self, returns: Dict[str, Any]) -> None:
        """Update the tool return type."""
        self.returns = returns
        self.updated_at = datetime.now()
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert the tool to a dictionary."""
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "server_id": self.server_id,
            "parameters": self.parameters,
            "returns": self.returns,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }