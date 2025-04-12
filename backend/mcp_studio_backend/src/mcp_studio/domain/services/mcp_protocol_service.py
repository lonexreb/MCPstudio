# File: src/mcp_studio/domain/services/mcp_protocol_service.py
import logging
from typing import Dict, Any, List, Optional
from urllib.parse import urlparse

from mcp_studio.infrastructure.external.google_drive.drive_client import GoogleDriveClient
from mcp_studio.infrastructure.external.google_drive.drive_tools import GoogleDriveTools

logger = logging.getLogger(__name__)


class MCPProtocolService:
    """Service for interacting with MCP servers."""
    
    def __init__(self, service_registry: "ServiceRegistry"):
        """
        Initialize with service registry.
        
        Args:
            service_registry: Registry of MCP service implementations
        """
        self.service_registry = service_registry
    
    def parse_url(self, url: str) -> Dict[str, Any]:
        """
        Parse MCP URL to determine service type and endpoint.
        
        Args:
            url: MCP URL (e.g., "googledrive://default")
            
        Returns:
            Dictionary with parsed URL components
        """
        try:
            parsed_url = urlparse(url)
            service_name = parsed_url.scheme
            endpoint = parsed_url.netloc or "default"
            
            return {
                "service_name": service_name,
                "endpoint": endpoint,
                "query": dict(pair.split('=') for pair in parsed_url.query.split('&') if pair)
            }
        except Exception as e:
            logger.error(f"Error parsing MCP URL: {e}")
            raise ValueError(f"Invalid MCP URL: {url}")
    
    async def connect(self, url: str, auth_config: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Connect to an MCP server.
        
        Args:
            url: MCP URL
            auth_config: Optional authentication configuration
            
        Returns:
            Connection object with service implementation
        """
        try:
            parsed = self.parse_url(url)
            service_name = parsed["service_name"]
            
            # Get service implementation from registry
            service = self.service_registry.get_service(service_name)
            if not service:
                raise ValueError(f"Unsupported MCP service: {service_name}")
            
            # Initialize service with auth config
            await service.initialize(auth_config)
            
            return {
                "url": url,
                "service": service,
                "parsed": parsed
            }
        except Exception as e:
            logger.error(f"Error connecting to MCP server: {e}")
            raise
    
    async def discover_tools(self, connection: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Discover tools available on an MCP server.
        
        Args:
            connection: Connection object from connect()
            
        Returns:
            List of tool definitions
        """
        try:
            service = connection["service"]
            return await service.get_tool_definitions()
        except Exception as e:
            logger.error(f"Error discovering tools: {e}")
            raise
    
    async def execute_tool(self, url: str, tool_name: str, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute a tool on an MCP server.
        
        Args:
            url: MCP URL
            tool_name: Name of the tool to execute
            parameters: Tool parameters
            
        Returns:
            Tool execution result
        """
        try:
            connection = await self.connect(url)
            service = connection["service"]
            
            result = await service.execute_tool_by_name(tool_name, parameters)
            return result
        except Exception as e:
            logger.error(f"Error executing tool {tool_name}: {e}")
            raise


class ServiceRegistry:
    """Registry of MCP service implementations."""
    
    def __init__(self):
        """Initialize with empty services dictionary."""
        self.services = {}
    
    def register_service(self, name: str, service_factory) -> None:
        """
        Register a service factory function.
        
        Args:
            name: Service name (e.g., "googledrive")
            service_factory: Factory function that creates service
        """
        self.services[name] = service_factory
    
    def get_service(self, name: str):
        """
        Get a service implementation.
        
        Args:
            name: Service name
            
        Returns:
            Service implementation or None if not found
        """
        service_factory = self.services.get(name)
        if not service_factory:
            return None
        
        return service_factory()


class GoogleDriveService:
    """MCP service implementation for Google Drive."""
    
    def __init__(self):
        """Initialize with None client and tools."""
        self.client = None
        self.tools = None
    
    async def initialize(self, auth_config: Optional[Dict[str, Any]] = None) -> None:
        """
        Initialize with authentication config.
        
        Args:
            auth_config: Authentication configuration
        """
        self.client = GoogleDriveClient(auth_config)
        self.tools = GoogleDriveTools(self.client)
    
    async def get_tool_definitions(self) -> List[Dict[str, Any]]:
        """
        Get tool definitions.
        
        Returns:
            List of tool definitions
        """
        return self.tools.get_tool_definitions()
    
    async def execute_tool_by_name(self, tool_name: str, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute a tool by name.
        
        Args:
            tool_name: Name of the tool to execute
            parameters: Tool parameters
            
        Returns:
            Tool execution result
        """
        return await self.tools.execute_tool_by_name(tool_name, parameters)