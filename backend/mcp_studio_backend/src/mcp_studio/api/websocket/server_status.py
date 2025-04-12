# File: src/mcp_studio/api/websocket/server_status.py
import logging
from typing import Dict, Any

from fastapi import APIRouter, WebSocket, Depends, HTTPException, status
from fastapi.websockets import WebSocketDisconnect

from mcp_studio.container import container
from mcp_studio.infrastructure.messaging.event_bus import EventBus
from mcp_studio.api.controllers.auth_controller import AuthController

logger = logging.getLogger(__name__)

router = APIRouter()
event_bus = container.event_bus()
auth_controller = container.auth_controller()


@router.websocket("/ws/servers/{server_id}/status")
async def server_status_websocket(
    websocket: WebSocket,
    server_id: str,
    token: str = None
):
    """WebSocket endpoint for server status updates."""
    # Accept the connection
    await websocket.accept()
    
    try:
        # Validate token if provided
        if token:
            try:
                user = await auth_controller.get_current_user(token)
                if not user:
                    await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
                    return
            except HTTPException:
                await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
                return
        
        # Register the websocket with the event bus
        event_type = f"server_status_changed:{server_id}"
        await event_bus.register_websocket(event_type, websocket)
        
        # Keep the connection open and handle messages
        while True:
            data = await websocket.receive_text()
            # We don't expect any messages from the client for this endpoint
            # Just keep the connection alive
    except WebSocketDisconnect:
        logger.info(f"WebSocket disconnected for server {server_id}")
    except Exception as e:
        logger.error(f"Error in server status websocket: {e}")
        await websocket.close(code=status.WS_1011_INTERNAL_ERROR)


@router.websocket("/ws/servers/all/status")
async def all_servers_status_websocket(
    websocket: WebSocket,
    token: str = None
):
    """WebSocket endpoint for all server status updates."""
    # Accept the connection
    await websocket.accept()
    
    try:
        # Validate token if provided
        if token:
            try:
                user = await auth_controller.get_current_user(token)
                if not user:
                    await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
                    return
            except HTTPException:
                await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
                return
        
        # Register the websocket with the event bus
        event_type = "server_status_changed"
        await event_bus.register_websocket(event_type, websocket)
        
        # Keep the connection open and handle messages
        while True:
            data = await websocket.receive_text()
            # We don't expect any messages from the client for this endpoint
            # Just keep the connection alive
    except WebSocketDisconnect:
        logger.info("WebSocket disconnected for all servers status")
    except Exception as e:
        logger.error(f"Error in all servers status websocket: {e}")
        await websocket.close(code=status.WS_1011_INTERNAL_ERROR)