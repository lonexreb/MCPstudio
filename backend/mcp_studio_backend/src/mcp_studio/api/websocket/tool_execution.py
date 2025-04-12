# File: src/mcp_studio/api/websocket/tool_execution.py
import logging
import json
from typing import Dict, Any

from fastapi import APIRouter, WebSocket, Depends, HTTPException, status
from fastapi.websockets import WebSocketDisconnect

from mcp_studio.container import container
from mcp_studio.infrastructure.messaging.event_bus import EventBus, ToolExecutionEvent
from mcp_studio.api.controllers.auth_controller import AuthController
from mcp_studio.api.controllers.tool_controller import ToolController

logger = logging.getLogger(__name__)

router = APIRouter()
event_bus = container.event_bus()
auth_controller = container.auth_controller()
tool_controller = container.tool_controller()


@router.websocket("/ws/servers/{server_id}/tools/{tool_id}/execution")
async def tool_execution_websocket(
    websocket: WebSocket,
    server_id: str,
    tool_id: str,
    token: str = None
):
    """WebSocket endpoint for tool execution updates."""
    # Accept the connection
    await websocket.accept()
    
    try:
        # Validate token if provided
        user = None
        if token:
            try:
                user = await auth_controller.get_current_user(token)
                if not user:
                    await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
                    return
            except HTTPException:
                await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
                return
        
        # Register the websocket with the event bus for specific tool execution updates
        event_type = f"tool_execution_status:{server_id}:{tool_id}"
        await event_bus.register_websocket(event_type, websocket)
        
        # Keep the connection open and handle messages
        while True:
            data = await websocket.receive_text()
            
            # Handle execution requests from client
            try:
                message = json.loads(data)
                if message.get("action") == "execute" and "parameters" in message:
                    # Execute the tool
                    execution_result = await tool_controller.execute_tool(
                        server_id=server_id,
                        tool_id=tool_id,
                        request={"parameters": message["parameters"]},
                        current_user=user or {}
                    )
                    
                    # Send the result back directly
                    await websocket.send_text(json.dumps(execution_result.dict()))
            except json.JSONDecodeError:
                logger.warning(f"Received invalid JSON from client: {data}")
            except Exception as e:
                logger.error(f"Error executing tool: {e}")
                await websocket.send_text(json.dumps({
                    "error": str(e),
                    "status": "error"
                }))
    except WebSocketDisconnect:
        logger.info(f"WebSocket disconnected for tool {tool_id} on server {server_id}")
    except Exception as e:
        logger.error(f"Error in tool execution websocket: {e}")
        await websocket.close(code=status.WS_1011_INTERNAL_ERROR)


@router.websocket("/ws/servers/{server_id}/tools/executions")
async def server_tools_execution_websocket(
    websocket: WebSocket,
    server_id: str,
    token: str = None
):
    """WebSocket endpoint for all tool executions on a server."""
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
        
        # Register the websocket with the event bus for all tool executions on this server
        event_type = f"tool_execution_status:{server_id}"
        await event_bus.register_websocket(event_type, websocket)
        
        # Keep the connection open and handle messages
        while True:
            data = await websocket.receive_text()
            # We don't expect any messages from the client for this endpoint
            # Just keep the connection alive
    except WebSocketDisconnect:
        logger.info(f"WebSocket disconnected for all tools on server {server_id}")
    except Exception as e:
        logger.error(f"Error in server tools execution websocket: {e}")
        await websocket.close(code=status.WS_1011_INTERNAL_ERROR)