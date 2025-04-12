# File: src/mcp_studio/infrastructure/messaging/event_bus.py
import asyncio
import json
import logging
from typing import Dict, List, Any, Callable, Awaitable, Optional
from datetime import datetime

from fastapi import WebSocket

logger = logging.getLogger(__name__)


class Event:
    """Base event class for the event bus."""
    
    def __init__(self, event_type: str, data: Dict[str, Any]):
        self.event_type = event_type
        self.data = data
        self.timestamp = datetime.now().isoformat()
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert event to dictionary for serialization."""
        return {
            "event_type": self.event_type,
            "data": self.data,
            "timestamp": self.timestamp
        }
    
    def to_json(self) -> str:
        """Convert event to JSON string."""
        return json.dumps(self.to_dict())
    
    @classmethod
    def from_dict(cls, event_dict: Dict[str, Any]) -> 'Event':
        """Create event from dictionary."""
        return cls(
            event_type=event_dict["event_type"],
            data=event_dict["data"]
        )


class ServerStatusEvent(Event):
    """Event for server status changes."""
    
    def __init__(self, server_id: str, status: str, message: Optional[str] = None):
        super().__init__(
            event_type="server_status_changed",
            data={
                "server_id": server_id,
                "status": status,
                "message": message
            }
        )


class ToolExecutionEvent(Event):
    """Event for tool execution status."""
    
    def __init__(self, server_id: str, tool_id: str, status: str, result: Optional[Dict[str, Any]] = None):
        super().__init__(
            event_type="tool_execution_status",
            data={
                "server_id": server_id,
                "tool_id": tool_id,
                "status": status,
                "result": result
            }
        )


class EventBus:
    """Event bus for publishing and subscribing to events."""
    
    def __init__(self):
        """Initialize with empty subscribers dictionary."""
        self.subscribers: Dict[str, List[Callable[[Event], Awaitable[None]]]] = {}
        self.websocket_connections: Dict[str, List[WebSocket]] = {}
        self.event_history: Dict[str, List[Event]] = {}
        self.max_history_size = 100
    
    async def publish(self, event: Event) -> None:
        """Publish an event to all subscribers."""
        event_type = event.event_type
        
        # Store in event history
        if event_type not in self.event_history:
            self.event_history[event_type] = []
        
        history = self.event_history[event_type]
        history.append(event)
        
        # Trim history if needed
        if len(history) > self.max_history_size:
            self.event_history[event_type] = history[-self.max_history_size:]
        
        # Notify subscribers
        if event_type in self.subscribers:
            for callback in self.subscribers[event_type]:
                try:
                    await callback(event)
                except Exception as e:
                    logger.error(f"Error in event subscriber: {e}")
        
        # Send to websocket connections
        if event_type in self.websocket_connections:
            message = event.to_json()
            disconnected = []
            
            for i, websocket in enumerate(self.websocket_connections[event_type]):
                try:
                    await websocket.send_text(message)
                except Exception as e:
                    logger.error(f"Error sending to websocket: {e}")
                    disconnected.append(i)
            
            # Remove disconnected websockets
            for i in sorted(disconnected, reverse=True):
                self.websocket_connections[event_type].pop(i)
    
    def subscribe(self, event_type: str, callback: Callable[[Event], Awaitable[None]]) -> None:
        """Subscribe to an event type."""
        if event_type not in self.subscribers:
            self.subscribers[event_type] = []
        
        self.subscribers[event_type].append(callback)
    
    def unsubscribe(self, event_type: str, callback: Callable[[Event], Awaitable[None]]) -> None:
        """Unsubscribe from an event type."""
        if event_type in self.subscribers and callback in self.subscribers[event_type]:
            self.subscribers[event_type].remove(callback)
    
    async def register_websocket(self, event_type: str, websocket: WebSocket) -> None:
        """Register a websocket connection for an event type."""
        if event_type not in self.websocket_connections:
            self.websocket_connections[event_type] = []
        
        self.websocket_connections[event_type].append(websocket)
        
        # Send event history to the new connection
        if event_type in self.event_history:
            for event in self.event_history[event_type]:
                try:
                    await websocket.send_text(event.to_json())
                except Exception as e:
                    logger.error(f"Error sending history to websocket: {e}")
                    return
    
    def get_event_history(self, event_type: str) -> List[Event]:
        """Get event history for an event type."""
        return self.event_history.get(event_type, [])