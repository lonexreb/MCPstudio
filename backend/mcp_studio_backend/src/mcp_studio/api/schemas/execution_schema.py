# File: src/mcp_studio/api/schemas/execution_schema.py
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field


class ExecutionResultResponse(BaseModel):
    """Schema for execution result response."""

    id: str = Field(..., description="Execution ID")
    server_id: str = Field(..., description="Server ID")
    server_name: str = Field("", description="Server name")
    tool_id: str = Field(..., description="Tool ID")
    tool_name: str = Field("", description="Tool name")
    parameters: Dict[str, Any] = Field(default_factory=dict, description="Parameters used")
    result: Dict[str, Any] = Field(default_factory=dict, description="Execution result")
    status: str = Field(..., description="Status (success, error)")
    execution_time: int = Field(0, description="Execution time in ms")
    error_message: Optional[str] = Field(None, description="Error message if failed")
    created_at: str = Field(..., description="Timestamp")


class ExecutionHistoryResponse(BaseModel):
    """Schema for execution history list response."""

    executions: List[ExecutionResultResponse] = Field(..., description="List of executions")
    total: int = Field(0, description="Total count")
