# File: src/mcp_studio/api/schemas/tool_schema.py
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field


class ToolResponse(BaseModel):
    """Schema for tool response."""
    
    id: str = Field(..., description="Tool ID")
    name: str = Field(..., description="Tool name")
    description: str = Field(..., description="Tool description")
    parameters: Dict[str, Any] = Field(..., description="Tool parameters schema")
    returns: Dict[str, Any] = Field(..., description="Tool returns schema")


class ToolListResponse(BaseModel):
    """Schema for tool list response."""
    
    tools: List[ToolResponse] = Field(..., description="List of tools")


class ToolExecutionRequest(BaseModel):
    """Schema for tool execution request."""
    
    parameters: Dict[str, Any] = Field(default_factory=dict, description="Tool parameters")


class ToolExecutionResponse(BaseModel):
    """Schema for tool execution response."""
    
    tool_id: str = Field(..., description="Tool ID")
    parameters: Dict[str, Any] = Field(..., description="Tool parameters used")
    result: Dict[str, Any] = Field(..., description="Tool execution result")
    status: str = Field(..., description="Execution status (success, error)")
    execution_time: int = Field(..., description="Execution time in milliseconds")