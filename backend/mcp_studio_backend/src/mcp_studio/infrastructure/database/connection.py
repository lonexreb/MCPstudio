# File: src/mcp_studio/infrastructure/database/connection.py
import logging
import os
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure
from bson import ObjectId

from mcp_studio.config.settings import settings

logger = logging.getLogger(__name__)


class Database:
    """MongoDB database connection manager."""
    
    def __init__(self):
        self.client = None
        self.db = None
        self.is_connected = False
    
    async def connect_to_database(self) -> None:
        """Connect to MongoDB database."""
        try:
            self.client = AsyncIOMotorClient(settings.mongodb_url, serverSelectionTimeoutMS=5000)
            self.db = self.client[settings.mongodb_db_name]
            
            # Verify connection is successful
            await self.client.admin.command('ping')
            logger.info(f"Connected to MongoDB at {settings.mongodb_url}")
            logger.info(f"Using database: {settings.mongodb_db_name}")
            self.is_connected = True
        except Exception as e:
            logger.error(f"Failed to connect to MongoDB: {e}")
            # Don't raise exception, create a mock database instead
            self.is_connected = False
            logger.warning("Using a mock database - no data will be persisted")
    
    async def close_database_connection(self) -> None:
        """Close MongoDB connection."""
        if self.client:
            self.client.close()
            logger.info("Closed MongoDB connection")
    
    def get_collection(self, collection_name: str):
        """Get a MongoDB collection."""
        if self.is_connected and self.db:
            return self.db[collection_name]
        else:
            # Return a mock collection for development/testing
            return MockCollection(collection_name)


class MockCollection:
    """Mock collection for development/testing when MongoDB is not available."""
    
    def __init__(self, name):
        self.name = name
        self.data = []
        logger.info(f"Using mock collection for {name}")
    
    async def find_one(self, *args, **kwargs):
        logger.debug(f"Mock find_one called on {self.name}")
        return None
    
    async def find(self, *args, **kwargs):
        logger.debug(f"Mock find called on {self.name}")
        
        class AsyncCursor:
            def __init__(self):
                self.data = []
            
            def __aiter__(self):
                return self
            
            async def __anext__(self):
                raise StopAsyncIteration
        
        return AsyncCursor()
    
    async def insert_one(self, *args, **kwargs):
        logger.debug(f"Mock insert_one called on {self.name}")
        
        class InsertOneResult:
            def __init__(self):
                self.inserted_id = ObjectId()
        
        return InsertOneResult()
    
    async def update_one(self, *args, **kwargs):
        logger.debug(f"Mock update_one called on {self.name}")
        
        class UpdateResult:
            def __init__(self):
                self.modified_count = 0
                self.upserted_id = None
        
        return UpdateResult()
    
    async def delete_one(self, *args, **kwargs):
        logger.debug(f"Mock delete_one called on {self.name}")
        
        class DeleteResult:
            def __init__(self):
                self.deleted_count = 0
        
        return DeleteResult()
    
    async def delete_many(self, *args, **kwargs):
        logger.debug(f"Mock delete_many called on {self.name}")
        
        class DeleteResult:
            def __init__(self):
                self.deleted_count = 0
        
        return DeleteResult()


# Create database instance
database = Database()