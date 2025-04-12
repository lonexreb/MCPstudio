# File: src/mcp_studio/infrastructure/database/repositories/mongo_tool_repo.py
from typing import List, Optional, Dict, Any
from bson import ObjectId

from mcp_studio.domain.models.tool import Tool
from mcp_studio.domain.repositories.tool_repository import ToolRepository


class MongoToolRepository(ToolRepository):
    """MongoDB implementation of the tool repository."""
    
    def __init__(self, database):
        """Initialize with database connection."""
        self.database = database
        self.collection_name = "tools"
    
    def _get_collection(self):
        """Get the MongoDB collection."""
        return self.database.get_collection(self.collection_name)
    
    def _to_domain_entity(self, db_tool: Dict[str, Any]) -> Tool:
        """Convert database representation to domain entity."""
        if not db_tool:
            return None
        
        tool = Tool(
            id=str(db_tool["_id"]),
            name=db_tool.get("name", ""),
            description=db_tool.get("description", ""),
            parameters=db_tool.get("parameters", {}),
            returns=db_tool.get("returns", {})
        )
        
        # Set timestamps
        tool.created_at = db_tool.get("created_at")
        tool.updated_at = db_tool.get("updated_at")
        
        return tool
    
    def _to_db_entity(self, tool: Tool) -> Dict[str, Any]:
        """Convert domain entity to database representation."""
        return {
            "name": tool.name,
            "description": tool.description,
            "parameters": tool.parameters,
            "returns": tool.returns,
            "server_id": tool.server_id if hasattr(tool, "server_id") else None,
            "created_at": tool.created_at,
            "updated_at": tool.updated_at
        }
    
    async def save(self, tool: Tool) -> Tool:
        """Save a tool to the repository."""
        collection = await self._get_collection()
        
        # Convert to database entity
        db_tool = self._to_db_entity(tool)
        
        if tool.id:
            # Update existing tool
            result = await collection.update_one(
                {"_id": ObjectId(tool.id)},
                {"$set": db_tool}
            )
            
            if result.modified_count == 0:
                # If no document was modified, it might not exist
                if await collection.find_one({"_id": ObjectId(tool.id)}) is None:
                    # Insert with the specified ID
                    db_tool["_id"] = ObjectId(tool.id)
                    await collection.insert_one(db_tool)
        else:
            # Insert new tool
            result = await collection.insert_one(db_tool)
            tool.id = str(result.inserted_id)
        
        return tool
    
    async def find_by_id(self, tool_id: str) -> Optional[Tool]:
        """Find a tool by its ID."""
        collection = await self._get_collection()
        
        try:
            db_tool = await collection.find_one({"_id": ObjectId(tool_id)})
            return self._to_domain_entity(db_tool) if db_tool else None
        except Exception:
            return None
    
    async def find_by_server_id(self, server_id: str) -> List[Tool]:
        """Find all tools for a specific server."""
        collection = await self._get_collection()
        
        tools = []
        async for db_tool in collection.find({"server_id": server_id}):
            tools.append(self._to_domain_entity(db_tool))
        
        return tools
    
    async def find_all(self) -> List[Tool]:
        """Find all tools."""
        collection = await self._get_collection()
        
        tools = []
        async for db_tool in collection.find():
            tools.append(self._to_domain_entity(db_tool))
        
        return tools
    
    async def delete(self, tool_id: str) -> bool:
        """Delete a tool by its ID."""
        collection = await self._get_collection()
        
        try:
            result = await collection.delete_one({"_id": ObjectId(tool_id)})
            return result.deleted_count > 0
        except Exception:
            return False
    
    async def delete_by_server_id(self, server_id: str) -> bool:
        """Delete all tools for a specific server."""
        collection = await self._get_collection()
        
        try:
            result = await collection.delete_many({"server_id": server_id})
            return result.deleted_count > 0
        except Exception:
            return False