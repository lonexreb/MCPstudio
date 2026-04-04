# File: src/mcp_studio/api/routes/discovery_routes.py
from typing import Optional
from fastapi import APIRouter, Depends, Query

from mcp_studio.api.controllers.discovery_controller import DiscoveryController
from mcp_studio.api.schemas.discovery_schema import DiscoverySearchResponse
from mcp_studio.container import get_container

router = APIRouter()

# TODO: Replace with real auth dependency when auth is fully wired
_current_user = {"id": "1", "username": "user"}


def get_discovery_controller() -> DiscoveryController:
    return get_container().discovery_controller()


@router.get("/discovery/search", response_model=DiscoverySearchResponse)
async def search_servers(
    query: str = Query("mcp server", description="Search query"),
    source: Optional[str] = Query(None, description="Filter by source (npm, github)"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    controller: DiscoveryController = Depends(get_discovery_controller),
):
    """Search for MCP servers in public registries."""
    return await controller.search(query=query, source=source, page=page, limit=limit)


@router.get("/discovery/categories")
async def get_categories(
    controller: DiscoveryController = Depends(get_discovery_controller),
):
    """Get available server categories."""
    return await controller.get_categories()
