# File: src/mcp_studio/infrastructure/database/repositories/mongo_server_repo.py
from typing import List, Optional, Dict, Any
from bson import ObjectId

from mcp_studio.domain.models.server import Server
from mcp_studio.domain.models.tool import Tool
from mcp_studio.domain.repositories.server_repository import ServerRepository


class MongoServerRepository(ServerRepository):
    """MongoDB implementation of the server repository."""
    
    def __init__(self, database):
        """Initialize with database connection."""
        self.database = database
        self.collection_name = "servers"
    
    async def _get_collection(self):
        """Get the MongoDB collection."""
        db = await self.database.db()
        return db[self.collection_name]
    
    def _to_domain_entity(self, db_server: Dict[str, Any]) -> Server:
        """Convert database representation to domain entity."""
        if not db_server:
            return None
        
        # Create server instance
        server = Server(
            id=str(db_server["_id"]),
            name=db_server.get("name", ""),
            description=db_server.get("description", ""),
            connection_url=db_server.get("connection_url", ""),
            status=db_server.get("status", "disconnected")
        )
        
        # Set additional properties
        server.auth_config = db_server.get("auth_config")
        server.created_at = db_server.get("created_at")
        server.updated_at = db_server.get("updated_at")
        
        # Add tools
        for tool_data in db_server.get("tools", []):
            tool = Tool(
                id=str(tool_data.get("_id", ObjectId())),
                name=tool_data.get("name", ""),
                description=tool_data.get("description", ""),
                parameters=tool_data.get("parameters", {}),
                returns=tool_data.get("returns", {})
            )
            tool.created_at = tool_data.get("created_at")
            tool.updated_at = tool_data.get("updated_at")
            server.tools.append(tool)
        
        return server
    
    def _to_db_entity(self, server: Server) -> Dict[str, Any]:
        """Convert domain entity to database representation."""
        db_server = {
            "name": server.name,
            "description": server.description,
            "connection_url": server.connection_url,
            "status": server.status,
            "auth_config": server.auth_config,
            "created_at": server.created_at,
            "updated_at": server.updated_at,
            "tools": []
        }
        
        # Convert tools
        for tool in server.tools:
            db_tool = {
                "_id": ObjectId(tool.id) if tool.id else ObjectId(),
                "name": tool.name,
                "description": tool.description,
                "parameters": tool.parameters,
                "returns": tool.returns,
                "created_at": tool.created_at,
                "updated_at": tool.updated_at
            }
            db_server["tools"].append(db_tool)
        
        return db_server
    
    async def save(self, server: Server) -> Server:
        """Save a server to the repository."""
        collection = await self._get_collection()
        
        # Convert to database entity
        db_server = self._to_db_entity(server)
        
        if server.id:
            # Update existing server
            result = await collection.update_one(
                {"_id": ObjectId(server.id)},
                {"$set": db_server}
            )
            
            if result.modified_count == 0:
                # If no document was modified, it might not exist
                if await collection.find_one({"_id": ObjectId(server.id)}) is None:
                    # Insert with the specified ID
                    db_server["_id"] = ObjectId(server.id)
                    await collection.insert_one(db_server)
        else:
            # Insert new server
            result = await collection.insert_one(db_server)
            server.id = str(result.inserted_id)
        
        return server
    
    async def find_by_id(self, server_id: str) -> Optional[Server]:
        """Find a server by its ID."""
        collection = await self._get_collection()
        
        try:
            db_server = await collection.find_one({"_id": ObjectId(server_id)})
            return self._to_domain_entity(db_server) if db_server else None
        except Exception:
            return None
    
    async def find_all(self) -> List[Server]:
        """Find all servers."""
        collection = await self._get_collection()
        
        servers = []
        async for db_server in collection.find():
            servers.append(self._to_domain_entity(db_server))
        
        return servers
    
    async def find_by_user_id(self, user_id: str) -> List[Server]:
        """Find all servers owned by a specific user."""
        collection = await self._get_collection()
        
        servers = []
        async for db_server in collection.find({"user_id": user_id}):
            servers.append(self._to_domain_entity(db_server))
        
        return servers
    
    async def delete(self, server_id: str) -> bool:
        """Delete a server by its ID."""
        collection = await self._get_collection()
        
        try:
            result = await collection.delete_one({"_id": ObjectId(server_id)})
            return result.deleted_count > 0
        except Exception:
            return False