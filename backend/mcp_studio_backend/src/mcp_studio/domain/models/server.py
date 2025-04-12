# File: src/mcp_studio/domain/models/server.py
from datetime import datetime
from typing import List, Optional, Dict, Any

from mcp_studio.domain.models.tool import Tool


class Server:
    """Core domain entity representing an MCP server."""
    
    def __init__(
        self,
        id: Optional[str] = None,
        name: str = "",
        description: str = "",
        connection_url: str = "",
        status: str = "disconnected"
    ):
        self.id = id
        self.name = name
        self.description = description
        self.connection_url = connection_url
        self.status = status  # connected, disconnected, error
        self.tools: List[Tool] = []
        self.auth_config: Optional[Dict[str, Any]] = None
        self.created_at = datetime.now()
        self.updated_at = datetime.now()
    
    def add_tool(self, tool: "Tool") -> None:
        """Add a tool to the server, ensuring no duplicate tool names."""
        if any(t.name == tool.name for t in self.tools):
            raise ValueError(f"Tool with name {tool.name} already exists on this server")
        self.tools.append(tool)
        self.updated_at = datetime.now()
    
    def update_status(self, new_status: str) -> None:
        """Update the server status."""
        valid_statuses = ["connected", "disconnected", "error"]
        if new_status not in valid_statuses:
            raise ValueError(f"Invalid status: {new_status}")
        self.status = new_status
        self.updated_at = datetime.now()
    
    def set_auth_config(self, auth_config: Dict[str, Any]) -> None:
        """Set the authentication configuration."""
        self.auth_config = auth_config
        self.updated_at = datetime.now()
