# File: src/mcp_studio/api/routes/server_routes.py
from fastapi import APIRouter, Depends, HTTPException, status

from mcp_studio.api.controllers.server_controller import ServerController
from mcp_studio.api.controllers.auth_controller import AuthController
from mcp_studio.api.schemas.server_schema import (
    ServerCreate,
    ServerUpdate,
    ServerResponse,
    ServerListResponse
)
from mcp_studio.container import get_container

router = APIRouter()


@router.post("", response_model=ServerResponse, status_code=status.HTTP_201_CREATED)
async def create_server(
    server_data: ServerCreate,
    server_controller: ServerController = Depends(lambda: get_container().resolve(ServerController)),
    auth_controller: AuthController = Depends(lambda: get_container().resolve(AuthController)),
    current_user: dict = Depends(lambda auth_controller=Depends(lambda: get_container().resolve(AuthController)): 
                                auth_controller.get_current_user())
):
    """Create a new server."""
    return await server_controller.create_server(server_data, current_user)


@router.get("", response_model=ServerListResponse)
async def get_servers(
    server_controller: ServerController = Depends(lambda: get_container().resolve(ServerController)),
    auth_controller: AuthController = Depends(lambda: get_container().resolve(AuthController)),
    current_user: dict = Depends(lambda auth_controller=Depends(lambda: get_container().resolve(AuthController)): 
                                auth_controller.get_current_user())
):
    """Get all servers."""
    return await server_controller.get_servers(current_user)


@router.get("/{server_id}", response_model=ServerResponse)
async def get_server_by_id(
    server_id: str,
    server_controller: ServerController = Depends(lambda: get_container().resolve(ServerController)),
    auth_controller: AuthController = Depends(lambda: get_container().resolve(AuthController)),
    current_user: dict = Depends(lambda auth_controller=Depends(lambda: get_container().resolve(AuthController)): 
                                auth_controller.get_current_user())
):
    """Get a server by ID."""
    return await server_controller.get_server_by_id(server_id, current_user)


@router.put("/{server_id}", response_model=ServerResponse)
async def update_server(
    server_id: str,
    server_data: ServerUpdate,
    server_controller: ServerController = Depends(lambda: get_container().resolve(ServerController)),
    auth_controller: AuthController = Depends(lambda: get_container().resolve(AuthController)),
    current_user: dict = Depends(lambda auth_controller=Depends(lambda: get_container().resolve(AuthController)): 
                                auth_controller.get_current_user())
):
    """Update a server."""
    return await server_controller.update_server(server_id, server_data, current_user)


@router.delete("/{server_id}")
async def delete_server(
    server_id: str,
    server_controller: ServerController = Depends(lambda: get_container().resolve(ServerController)),
    auth_controller: AuthController = Depends(lambda: get_container().resolve(AuthController)),
    current_user: dict = Depends(lambda auth_controller=Depends(lambda: get_container().resolve(AuthController)): 
                                auth_controller.get_current_user())
):
    """Delete a server."""
    return await server_controller.delete_server(server_id, current_user)


@router.post("/{server_id}/connect", response_model=ServerResponse)
async def connect_to_server(
    server_id: str,
    server_controller: ServerController = Depends(lambda: get_container().resolve(ServerController)),
    auth_controller: AuthController = Depends(lambda: get_container().resolve(AuthController)),
    current_user: dict = Depends(lambda auth_controller=Depends(lambda: get_container().resolve(AuthController)): 
                                auth_controller.get_current_user())
):
    """Connect to a server and discover its tools."""
    return await server_controller.connect_to_server(server_id, current_user)


@router.post("/{server_id}/disconnect", response_model=ServerResponse)
async def disconnect_from_server(
    server_id: str,
    server_controller: ServerController = Depends(lambda: get_container().resolve(ServerController)),
    auth_controller: AuthController = Depends(lambda: get_container().resolve(AuthController)),
    current_user: dict = Depends(lambda auth_controller=Depends(lambda: get_container().resolve(AuthController)): 
                                auth_controller.get_current_user())
):
    """Disconnect from a server."""
    return await server_controller.disconnect_from_server(server_id, current_user)