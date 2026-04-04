# File: src/mcp_studio/api/schemas/discovery_schema.py
from typing import List, Optional
from pydantic import BaseModel, Field


class DiscoveredServerResponse(BaseModel):
    """Schema for a discovered MCP server."""

    source: str = Field(..., description="Source registry (npm, github)")
    package_name: str = Field(..., description="Package/repo name")
    display_name: str = Field(..., description="Display name")
    description: str = Field("", description="Description")
    author: str = Field("", description="Author")
    version: str = Field("", description="Version")
    stars: float = Field(0, description="Stars/popularity score")
    tags: List[str] = Field(default_factory=list, description="Tags/keywords")
    homepage_url: str = Field("", description="Homepage URL")
    install_command: str = Field("", description="Install command")


class DiscoverySearchResponse(BaseModel):
    """Schema for discovery search results."""

    servers: List[DiscoveredServerResponse] = Field(..., description="Discovered servers")
    total: int = Field(0, description="Total results")
    page: int = Field(1, description="Current page")
    pages: int = Field(1, description="Total pages")
