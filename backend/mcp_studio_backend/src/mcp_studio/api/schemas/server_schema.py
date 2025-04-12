# File: src/mcp_studio/api/schemas/server_schema.py
from datetime import datetime
from typing import List, Optional, Dict, Any

from pydantic import BaseModel, Field, HttpUrl


class AuthConfigSchema(BaseModel):
    """Schema for authentication configuration."""
    type: str = Field(..., description="Authentication type (oauth2, apikey, etc.)")
    credentials: Dict[str, Any] = Field(..., description="Authentication credentials")


class ServerBase(BaseModel):
    """Base schema for server data."""
    name: str = Field(..., description="Server name")
    description: str = Field("", description="Server description")
    connection_url: str = Field(..., description="Server connection URL")


class ServerCreate(ServerBase):
    """Schema for creating a server."""
    auth_config: Optional[AuthConfigSchema] = Field(None, description="Authentication configuration")


class ServerUpdate(BaseModel):
    """Schema for updating a server."""
    name: Optional[str] = Field(None, description="Server name")
    description: Optional[str] = Field(None, description="Server description")
    connection_url: Optional[str] = Field(None, description="Server connection URL")
    status: Optional[str] = Field(None, description="Server status")
    auth_config: Optional[AuthConfigSchema] = Field(None, description="Authentication configuration")


class ToolReference(BaseModel):
    """Schema for tool reference in server response."""
    id: str = Field(..., description="Tool ID")
    name: str = Field(..., description="Tool name")
    description: str = Field("", description="Tool description")


class ServerResponse(ServerBase):
    """Schema for server response."""
    id: str = Field(..., description="Server ID")
    status: str = Field(..., description="Server status")
    tools: List[ToolReference] = Field([], description="List of tools available on this server")
    auth_config: Optional[Dict[str, Any]] = Field(None, description="Authentication configuration")
    created_at: datetime = Field(..., description="Creation timestamp")
    updated_at: datetime = Field(..., description="Last update timestamp")

    class Config:
        from_attributes = True


class ServerListResponse(BaseModel):
    """Schema for server list response."""
    servers: List[ServerResponse] = Field(..., description="List of servers")
    total: int = Field(..., description="Total number of servers")