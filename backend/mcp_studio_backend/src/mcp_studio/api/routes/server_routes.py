# File: src/mcp_studio/api/routes/server_routes.py
from fastapi import APIRouter, Depends, HTTPException, status

from mcp_studio.api.controllers.server_controller import ServerController
from mcp_studio.api.schemas.server_schema import (
    ServerCreate,
    ServerUpdate,
    ServerResponse,
    ServerListResponse
)
from mcp_studio.container import get_container

router = APIRouter()


def get_server_controller() -> ServerController:
    return get_container().server_controller()


@router.post("", response_model=ServerResponse, status_code=status.HTTP_201_CREATED)
async def create_server(
    server_data: ServerCreate,
    server_controller: ServerController = Depends(get_server_controller),
):
    """Create a new server."""
    return await server_controller.create_server(server_data, {"id": "1", "username": "user"})


@router.get("", response_model=ServerListResponse)
async def get_servers(
    server_controller: ServerController = Depends(get_server_controller),
):
    """Get all servers."""
    return await server_controller.get_servers({"id": "1", "username": "user"})


@router.get("/{server_id}", response_model=ServerResponse)
async def get_server_by_id(
    server_id: str,
    server_controller: ServerController = Depends(get_server_controller),
):
    """Get a server by ID."""
    return await server_controller.get_server_by_id(server_id, {"id": "1", "username": "user"})


@router.put("/{server_id}", response_model=ServerResponse)
async def update_server(
    server_id: str,
    server_data: ServerUpdate,
    server_controller: ServerController = Depends(get_server_controller),
):
    """Update a server."""
    return await server_controller.update_server(server_id, server_data, {"id": "1", "username": "user"})


@router.delete("/{server_id}")
async def delete_server(
    server_id: str,
    server_controller: ServerController = Depends(get_server_controller),
):
    """Delete a server."""
    return await server_controller.delete_server(server_id, {"id": "1", "username": "user"})


@router.post("/{server_id}/connect", response_model=ServerResponse)
async def connect_to_server(
    server_id: str,
    server_controller: ServerController = Depends(get_server_controller),
):
    """Connect to a server and discover its tools."""
    return await server_controller.connect_to_server(server_id, {"id": "1", "username": "user"})


@router.get("/{server_id}/resources")
async def get_resources_for_server(
    server_id: str,
    server_controller: ServerController = Depends(get_server_controller),
):
    """Get resources for a server."""
    return await server_controller.get_resources(server_id, {"id": "1", "username": "user"})


@router.post("/{server_id}/disconnect", response_model=ServerResponse)
async def disconnect_from_server(
    server_id: str,
    server_controller: ServerController = Depends(get_server_controller),
):
    """Disconnect from a server."""
    return await server_controller.disconnect_from_server(server_id, {"id": "1", "username": "user"})
