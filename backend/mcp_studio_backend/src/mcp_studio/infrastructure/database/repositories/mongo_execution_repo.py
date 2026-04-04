# File: src/mcp_studio/infrastructure/database/repositories/mongo_execution_repo.py
from typing import List, Optional, Dict, Any
from bson import ObjectId

from mcp_studio.domain.models.execution_result import ExecutionResult
from mcp_studio.domain.repositories.execution_repository import ExecutionRepository


class MongoExecutionRepository(ExecutionRepository):
    """MongoDB implementation of the execution repository."""

    def __init__(self, database):
        self.database = database
        self.collection_name = "executions"

    def _get_collection(self):
        return self.database.get_collection(self.collection_name)

    def _to_domain_entity(self, doc: Dict[str, Any]) -> ExecutionResult:
        if not doc:
            return None
        result = ExecutionResult(
            id=str(doc["_id"]),
            server_id=doc.get("server_id", ""),
            server_name=doc.get("server_name", ""),
            tool_id=doc.get("tool_id", ""),
            tool_name=doc.get("tool_name", ""),
            parameters=doc.get("parameters", {}),
            result=doc.get("result", {}),
            status=doc.get("status", "pending"),
            execution_time=doc.get("execution_time", 0),
            user_id=doc.get("user_id"),
            error_message=doc.get("error_message"),
        )
        result.created_at = doc.get("created_at", result.created_at)
        return result

    def _to_db_entity(self, result: ExecutionResult) -> Dict[str, Any]:
        return {
            "server_id": result.server_id,
            "server_name": result.server_name,
            "tool_id": result.tool_id,
            "tool_name": result.tool_name,
            "parameters": result.parameters,
            "result": result.result,
            "status": result.status,
            "execution_time": result.execution_time,
            "user_id": result.user_id,
            "error_message": result.error_message,
            "created_at": result.created_at,
        }

    async def save(self, result: ExecutionResult) -> ExecutionResult:
        collection = self._get_collection()
        db_doc = self._to_db_entity(result)
        insert_result = await collection.insert_one(db_doc)
        result.id = str(insert_result.inserted_id)
        return result

    async def find_by_id(self, execution_id: str) -> Optional[ExecutionResult]:
        collection = self._get_collection()
        try:
            doc = await collection.find_one({"_id": ObjectId(execution_id)})
            return self._to_domain_entity(doc) if doc else None
        except Exception:
            return None

    async def find_all(self, limit: int = 100, offset: int = 0) -> List[ExecutionResult]:
        collection = self._get_collection()
        results = []
        cursor = collection.find().sort("created_at", -1).skip(offset).limit(limit)
        async for doc in cursor:
            results.append(self._to_domain_entity(doc))
        return results

    async def find_by_server_id(self, server_id: str, limit: int = 50) -> List[ExecutionResult]:
        collection = self._get_collection()
        results = []
        cursor = collection.find({"server_id": server_id}).sort("created_at", -1).limit(limit)
        async for doc in cursor:
            results.append(self._to_domain_entity(doc))
        return results

    async def find_by_tool_id(self, tool_id: str, limit: int = 50) -> List[ExecutionResult]:
        collection = self._get_collection()
        results = []
        cursor = collection.find({"tool_id": tool_id}).sort("created_at", -1).limit(limit)
        async for doc in cursor:
            results.append(self._to_domain_entity(doc))
        return results

    async def count(self, server_id: Optional[str] = None, tool_id: Optional[str] = None) -> int:
        collection = self._get_collection()
        query: Dict[str, Any] = {}
        if server_id:
            query["server_id"] = server_id
        if tool_id:
            query["tool_id"] = tool_id
        return await collection.count_documents(query)

    async def delete_all(self, server_id: Optional[str] = None) -> bool:
        collection = self._get_collection()
        try:
            query = {"server_id": server_id} if server_id else {}
            result = await collection.delete_many(query)
            return result.deleted_count > 0
        except Exception:
            return False
