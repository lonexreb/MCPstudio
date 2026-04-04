# File: src/mcp_studio/domain/models/execution_result.py
from datetime import datetime
from typing import Dict, Any, Optional


class ExecutionResult:
    """Core domain entity representing a tool execution result."""

    def __init__(
        self,
        id: Optional[str] = None,
        server_id: str = "",
        server_name: str = "",
        tool_id: str = "",
        tool_name: str = "",
        parameters: Optional[Dict[str, Any]] = None,
        result: Optional[Dict[str, Any]] = None,
        status: str = "pending",
        execution_time: int = 0,
        user_id: Optional[str] = None,
        error_message: Optional[str] = None,
    ):
        self.id = id
        self.server_id = server_id
        self.server_name = server_name
        self.tool_id = tool_id
        self.tool_name = tool_name
        self.parameters = parameters or {}
        self.result = result or {}
        self.status = status
        self.execution_time = execution_time
        self.user_id = user_id
        self.error_message = error_message
        self.created_at = datetime.now()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "server_id": self.server_id,
            "server_name": self.server_name,
            "tool_id": self.tool_id,
            "tool_name": self.tool_name,
            "parameters": self.parameters,
            "result": self.result,
            "status": self.status,
            "execution_time": self.execution_time,
            "user_id": self.user_id,
            "error_message": self.error_message,
            "created_at": self.created_at,
        }
