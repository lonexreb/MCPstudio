# File: src/mcp_studio/api/controllers/discovery_controller.py
import logging
from typing import Optional

from fastapi import HTTPException, status

from mcp_studio.api.schemas.discovery_schema import DiscoveredServerResponse, DiscoverySearchResponse
from mcp_studio.application.services.discovery_service import DiscoveryService

logger = logging.getLogger(__name__)


class DiscoveryController:
    """Controller for MCP server discovery endpoints."""

    def __init__(self, discovery_service: DiscoveryService):
        self.discovery_service = discovery_service

    async def search(
        self,
        query: str = "mcp server",
        source: Optional[str] = None,
        page: int = 1,
        limit: int = 20,
    ) -> DiscoverySearchResponse:
        try:
            result = await self.discovery_service.search_servers(
                query=query, source=source, page=page, limit=limit
            )
            return DiscoverySearchResponse(
                servers=[DiscoveredServerResponse(**s) for s in result["servers"]],
                total=result["total"],
                page=result["page"],
                pages=result["pages"],
            )
        except Exception as e:
            logger.error(f"Discovery search error: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Discovery search failed: {str(e)}",
            )

    async def get_categories(self):
        categories = await self.discovery_service.get_categories()
        return {"categories": categories}
