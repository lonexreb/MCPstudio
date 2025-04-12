# File: src/mcp_studio/domain/models/server.py
from datetime import datetime
from typing import List, Optional, Dict, Any

from pydantic import BaseModel

from mcp_studio.domain.models.tool import Tool


class Server:
    """Core domain entity representing an MCP server."""
    
    def __init__(
        self,
        id: Optional[str] = None,
        name: str = "",
        description: str = "",
        connection_url: str = "",
        status: str = "disconnected"
    ):
        self.id = id
        self.name = name
        self.description = description
        self.connection_url = connection_url
        self.status = status  # connected, disconnected, error
        self.tools: List[Tool] = []
        self.auth_config: Optional[Dict[str, Any]] = None
        self.created_at = datetime.now()
        self.updated_at = datetime.now()
    
    def add_tool(self, tool: "Tool") -> None:
        """Add a tool to the server, ensuring no duplicate tool names."""
        if any(t.name == tool.name for t in self.tools):
            raise ValueError(f"Tool with name {tool.name} already exists on this server")
        self.tools.append(tool)
        self.updated_at = datetime.now()
    
    def update_status(self, new_status: str) -> None:
        """Update the server status."""
        valid_statuses = ["connected", "disconnected", "error"]
        if new_status not in valid_statuses:
            raise ValueError(f"Invalid status: {new_status}")
        self.status = new_status
        self.updated_at = datetime.now()
    
    def set_auth_config(self, auth_config: Dict[str, Any]) -> None:
        """Set the authentication configuration."""
        self.auth_config = auth_config
        self.updated_at = datetime.now()


# File: src/mcp_studio/domain/models/tool.py
from datetime import datetime
from typing import Optional, Dict, Any


class Tool:
    """Represents a capability exposed by an MCP server."""
    
    def __init__(
        self,
        id: Optional[str] = None,
        name: str = "",
        description: str = "",
        parameters: Optional[Dict[str, Any]] = None,
        returns: Optional[Dict[str, Any]] = None
    ):
        self.id = id
        self.name = name
        self.description = description
        self.parameters = parameters or {}  # JSON Schema object
        self.returns = returns or {}  # JSON Schema object
        self.created_at = datetime.now()
        self.updated_at = datetime.now()
    
    def validate_parameters(self, input_params: Dict[str, Any]) -> Dict[str, Any]:
        """
        Validate input parameters against the tool's parameter schema.
        Returns validation result with is_valid flag and optional errors.
        """
        # This would use a schema validation library
        # Placeholder implementation
        return {"is_valid": True, "errors": []}
    
    def update_schema(self, parameters: Dict[str, Any], returns: Dict[str, Any]) -> None:
        """Update the tool's parameter and return schemas."""
        self.parameters = parameters
        self.returns = returns
        self.updated_at = datetime.now()


# File: src/mcp_studio/domain/models/execution_result.py
from datetime import datetime
from typing import Optional, Dict, Any


class ExecutionResult:
    """Represents the result of a tool execution."""
    
    def __init__(
        self,
        id: Optional[str] = None,
        tool_id: str = "",
        parameters: Dict[str, Any] = None,
        result: Dict[str, Any] = None,
        status: str = "pending",
        execution_time: int = 0
    ):
        self.id = id
        self.tool_id = tool_id
        self.parameters = parameters or {}  # The input parameters used
        self.result = result or {}  # The output from the tool
        self.status = status  # pending, success, error
        self.execution_time = execution_time  # ms
        self.timestamp = datetime.now()
    
    def is_success(self) -> bool:
        """Check if the execution was successful."""
        return self.status == "success"
    
    def get_execution_time_in_seconds(self) -> float:
        """Get the execution time in seconds."""
        return self.execution_time / 1000


# File: src/mcp_studio/domain/repositories/server_repository.py
from abc import ABC, abstractmethod
from typing import List, Optional

from mcp_studio.domain.models.server import Server


class ServerRepository(ABC):
    """Interface for server repository implementations."""
    
    @abstractmethod
    async def save(self, server: Server) -> Server:
        """Save a server to the repository."""
        pass
    
    @abstractmethod
    async def find_by_id(self, server_id: str) -> Optional[Server]:
        """Find a server by its ID."""
        pass
    
    @abstractmethod
    async def find_all(self) -> List[Server]:
        """Find all servers."""
        pass
    
    @abstractmethod
    async def find_by_user_id(self, user_id: str) -> List[Server]:
        """Find all servers owned by a specific user."""
        pass
    
    @abstractmethod
    async def delete(self, server_id: str) -> bool:
        """Delete a server by its ID."""
        pass


# File: src/mcp_studio/infrastructure/external/google_drive/drive_client.py
import base64
from typing import Dict, Any, Optional, List

from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
from google_auth_oauthlib.flow import Flow

import io


class GoogleDriveClient:
    """Client for interacting with the Google Drive API."""
    
    def __init__(self, auth_config: Optional[Dict[str, Any]] = None):
        """Initialize the Google Drive client with optional auth config."""
        self.auth = None
        self.drive = None
        
        if auth_config:
            self._create_auth_client(auth_config)
    
    def _create_auth_client(self, auth_config: Dict[str, Any]) -> None:
        """Create an OAuth2 client from auth config."""
        if "credentials" in auth_config:
            creds = Credentials.from_authorized_user_info(
                auth_config["credentials"]
            )
            self.auth = creds
            self.drive = build("drive", "v3", credentials=creds)
        else:
            # Create auth client for OAuth flow
            flow = Flow.from_client_config(
                client_config={
                    "installed": {
                        "client_id": auth_config.get("client_id", ""),
                        "client_secret": auth_config.get("client_secret", ""),
                        "redirect_uris": [auth_config.get("redirect_uri", "urn:ietf:wg:oauth:2.0:oob")],
                        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                        "token_uri": "https://oauth2.googleapis.com/token"
                    }
                },
                scopes=[
                    "https://www.googleapis.com/auth/drive.readonly",
                    "https://www.googleapis.com/auth/drive.metadata.readonly"
                ]
            )
            flow.redirect_uri = auth_config.get("redirect_uri", "urn:ietf:wg:oauth:2.0:oob")
            self.auth = flow
    
    def get_auth_url(self) -> str:
        """Get authentication URL for OAuth flow."""
        if not isinstance(self.auth, Flow):
            raise ValueError("Auth client not initialized for OAuth flow")
        
        auth_url, _ = self.auth.authorization_url(
            access_type="offline",
            prompt="consent"  # Force to get refresh token
        )
        return auth_url
    
    async def get_tokens_from_code(self, code: str) -> Dict[str, Any]:
        """Exchange authorization code for tokens."""
        if not isinstance(self.auth, Flow):
            raise ValueError("Auth client not initialized for OAuth flow")
        
        self.auth.fetch_token(code=code)
        creds = self.auth.credentials
        self.drive = build("drive", "v3", credentials=creds)
        
        return {
            "access_token": creds.token,
            "refresh_token": creds.refresh_token,
            "expires_in": creds._expires_in
        }
    
    async def list_files(self, options: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        List files in Google Drive, optionally filtered by folder.
        
        Args:
            options: Dictionary of options including:
                - folderId: ID of the folder to list files from
                - pageSize: Maximum number of files to return
                - query: Additional query filters
                
        Returns:
            Dictionary containing file list and nextPageToken if applicable.
        """
        if not self.drive:
            raise ValueError("Drive client not initialized")
        
        options = options or {}
        
        # Default request parameters
        params = {
            "pageSize": options.get("pageSize", 30),
            "fields": "nextPageToken, files(id, name, mimeType, size, modifiedTime)"
        }
        
        # Build query for folder filtering
        query_parts = []
        
        if options.get("folderId"):
            query_parts.append(f"'{options['folderId']}' in parents")
        else:
            query_parts.append("'root' in parents")
        
        query_parts.append("trashed = false")
        
        # Add any custom query
        if options.get("query"):
            query_parts.append(options["query"])
        
        params["q"] = " and ".join(query_parts)
        
        response = self.drive.files().list(**params).execute()
        return response
    
    async def get_file_content(self, file_id: str) -> Dict[str, Any]:
        """
        Get the content of a file from Google Drive.
        
        Args:
            file_id: ID of the file to retrieve
            
        Returns:
            Dictionary containing file content and metadata.
        """
        if not self.drive:
            raise ValueError("Drive client not initialized")
        
        # Get file metadata
        file_metadata = self.drive.files().get(
            fileId=file_id,
            fields="name, mimeType, size"
        ).execute()
        
        # Download file content
        request = self.drive.files().get_media(fileId=file_id)
        file_io = io.BytesIO()
        downloader = MediaIoBaseDownload(file_io, request)
        
        done = False
        while not done:
            _, done = downloader.next_chunk()
        
        # Convert content to base64 for text transfer
        content = base64.b64encode(file_io.getvalue()).decode("utf-8")
        
        return {
            "content": content,
            "mimeType": file_metadata.get("mimeType", ""),
            "name": file_metadata.get("name", ""),
            "size": file_metadata.get("size", 0)
        }
    
    async def search_files(self, query: str, options: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Search for files in Google Drive.
        
        Args:
            query: Search query string
            options: Additional options like pageSize
            
        Returns:
            Dictionary containing file list and nextPageToken if applicable.
        """
        if not self.drive:
            raise ValueError("Drive client not initialized")
        
        options = options or {}
        
        params = {
            "q": query,
            "pageSize": options.get("pageSize", 30),
            "fields": "nextPageToken, files(id, name, mimeType, size, modifiedTime)"
        }
        
        response = self.drive.files().list(**params).execute()
        return response


# File: src/mcp_studio/main.py
import logging
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from mcp_studio.api.routes import server_routes, tool_routes, auth_routes
from mcp_studio.config.settings import settings

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Create FastAPI application
app = FastAPI(
    title="MCPStudio API",
    description="API for MCPStudio - The Postman for Model Context Protocol",
    version="0.1.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_routes.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(server_routes.router, prefix="/api/servers", tags=["Servers"])
app.include_router(tool_routes.router, prefix="/api", tags=["Tools"])

@app.get("/", tags=["Health Check"])
async def root():
    """Health check endpoint."""
    return {"status": "ok", "message": "MCPStudio API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("mcp_studio.main:app", host="0.0.0.0", port=8000, reload=True)


# File: src/mcp_studio/config/settings.py
from typing import List, Optional, Dict, Any
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # API settings
    api_title: str = "MCPStudio API"
    api_description: str = "API for MCPStudio - The Postman for Model Context Protocol"
    api_version: str = "0.1.0"
    
    # Server settings
    host: str = "0.0.0.0"
    port: int = 8000
    debug: bool = True
    
    # Security settings
    secret_key: str = "change_this_in_production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # CORS settings
    cors_origins: List[str] = ["http://localhost:3000", "http://localhost:8080"]
    
    # Database settings
    mongodb_url: str = "mongodb://localhost:27017"
    database_name: str = "mcp_studio"
    
    # Google Drive settings
    google_client_id: Optional[str] = None
    google_client_secret: Optional[str] = None
    google_redirect_uri: str = "http://localhost:8000/api/auth/google/callback"
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


# Create settings instance
settings = Settings()


# File: src/mcp_studio/infrastructure/database/connection.py
import logging
from motor.motor_asyncio import AsyncIOMotorClient
from mcp_studio.config.settings import settings

logger = logging.getLogger(__name__)


class Database:
    """Database connection manager."""
    
    client: AsyncIOMotorClient = None
    
    async def connect_to_database(self):
        """Connect to MongoDB database."""
        logger.info("Connecting to MongoDB...")
        self.client = AsyncIOMotorClient(
            settings.mongodb_url,
            maxPoolSize=10,
            minPoolSize=1,
        )
        logger.info("Connected to MongoDB")
    
    async def close_database_connection(self):
        """Close MongoDB connection."""
        logger.info("Closing connection to MongoDB...")
        if self.client:
            self.client.close()
        logger.info("MongoDB connection closed")
    
    @property
    def db(self):
        """Get database instance."""
        return self.client[settings.database_name]


# Create database instance
database = Database()


# File: src/mcp_studio/application/services/server_service.py
from typing import List, Optional, Dict, Any
import logging

from mcp_studio.domain.models.server import Server
from mcp_studio.domain.models.tool import Tool
from mcp_studio.domain.models.execution_result import ExecutionResult
from mcp_studio.domain.repositories.server_repository import ServerRepository
from mcp_studio.domain.repositories.tool_repository import ToolRepository
from mcp_studio.domain.services.mcp_protocol_service import MCPProtocolService

logger = logging.getLogger(__name__)


class ServerService:
    """Application service for MCP server management."""
    
    def __init__(
        self,
        server_repository: ServerRepository,
        tool_repository: ToolRepository,
        mcp_protocol_service: MCPProtocolService,
        event_bus: Any
    ):
        self.server_repository = server_repository
        self.tool_repository = tool_repository
        self.mcp_protocol_service = mcp_protocol_service
        self.event_bus = event_bus
    
    async def register_server(self, server_data: Dict[str, Any]) -> Server:
        """
        Register a new MCP server.
        
        Args:
            server_data: Dictionary containing server information
            
        Returns:
            Created server entity
        """
        try:
            # Create domain entity
            server = Server(
                name=server_data.get("name", ""),
                description=server_data.get("description", ""),
                connection_url=server_data.get("connection_url", "")
            )
            
            # Set authentication if provided
            if "auth_config" in server_data:
                server.set_auth_config(server_data["auth_config"])
            
            # Save to repository
            saved_server = await self.server_repository.save(server)
            
            # Emit domain event
            await self.event_bus.publish("server.created", {"server_id": saved_server.id})
            
            return saved_server
        
        except Exception as e:
            logger.error(f"Error registering server: {e}")
            raise
    
    async def connect_and_discover_tools(self, server_id: str) -> Server:
        """
        Connect to MCP server and discover available tools.
        
        Args:
            server_id: ID of the server to connect to
            
        Returns:
            Updated server entity with discovered tools
        """
        try:
            # Get server from repository
            server = await self.server_repository.find_by_id(server_id)
            if not server:
                raise ValueError(f"Server with ID {server_id} not found")
            
            # Update status to connecting
            server.update_status("connecting")
            await self.server_repository.save(server)
            
            try:
                # Connect to server using MCP protocol service
                connection = await self.mcp_protocol_service.connect(
                    server.connection_url,
                    server.auth_config
                )
                
                # Discover tools
                discovered_tools = await self.mcp_protocol_service.discover_tools(connection)
                
                # Add tools to server
                for tool_data in discovered_tools:
                    tool = Tool(
                        name=tool_data.get("name", ""),
                        description=tool_data.get("description", ""),
                        parameters=tool_data.get("parameters", {}),
                        returns=tool_data.get("returns", {})
                    )
                    server.add_tool(tool)
                    await self.tool_repository.save(tool)
                
                # Update server status
                server.update_status("connected")
                await self.server_repository.save(server)
                
                # Emit domain event
                await self.event_bus.publish(
                    "server.connected",
                    {
                        "server_id": server.id,
                        "tool_count": len(discovered_tools)
                    }
                )
                
                return server
            
            except Exception as connection_error:
                # Handle connection failure
                server.update_status("error")
                await self.server_repository.save(server)
                raise connection_error
        
        except Exception as e:
            logger.error(f"Error connecting to server: {e}")
            raise
    
    async def execute_tool(
        self, server_id: str, tool_id: str, parameters: Dict[str, Any]
    ) -> ExecutionResult:
        """
        Execute a tool on an MCP server.
        
        Args:
            server_id: ID of the server
            tool_id: ID of the tool to execute
            parameters: Input parameters for the tool
            
        Returns:
            Execution result
        """
        try:
            # Get server and tool
            server = await self.server_repository.find_by_id(server_id)
            if not server:
                raise ValueError(f"Server with ID {server_id} not found")
            
            tool = await self.tool_repository.find_by_id(tool_id)
            if not tool:
                raise ValueError(f"Tool with ID {tool_id} not found")
            
            # Validate parameters against tool schema
            validation = tool.validate_parameters(parameters)
            if not validation.get("is_valid", False):
                raise ValueError(f"Invalid parameters: {validation.get('errors', [])}")
            
            # Start execution timer
            import time
            start_time = time.time()
            
            try:
                # Connect to server if not connected
                if server.status != "connected":
                    await self.mcp_protocol_service.connect(
                        server.connection_url,
                        server.auth_config
                    )
                    server.update_status("connected")
                    await self.server_repository.save(server)
                
                # Execute tool
                result = await self.mcp_protocol_service.execute_tool(
                    server.connection_url,
                    tool.name,
                    parameters
                )
                
                # Record execution time
                execution_time = int((time.time() - start_time) * 1000)
                
                # Create execution result
                execution_result = ExecutionResult(
                    tool_id=tool_id,