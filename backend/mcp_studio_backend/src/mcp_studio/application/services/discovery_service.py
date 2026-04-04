# File: src/mcp_studio/application/services/discovery_service.py
import asyncio
import logging
import time
from typing import List, Dict, Any, Optional

from mcp_studio.infrastructure.external.registry.npm_client import search_npm_mcp_servers
from mcp_studio.infrastructure.external.registry.github_client import search_github_mcp_servers

logger = logging.getLogger(__name__)

# Async-safe in-memory cache with TTL
_cache: Dict[str, Any] = {}
_cache_lock = asyncio.Lock()
CACHE_TTL = 300  # 5 minutes


def _cache_key(prefix: str, **kwargs) -> str:
    return f"{prefix}:{':'.join(f'{k}={v}' for k, v in sorted(kwargs.items()))}"


async def _get_cached(key: str):
    async with _cache_lock:
        entry = _cache.get(key)
        if entry and time.time() - entry["ts"] < CACHE_TTL:
            return entry["data"]
        return None


async def _set_cached(key: str, data):
    async with _cache_lock:
        _cache[key] = {"data": data, "ts": time.time()}


class DiscoveryService:
    """Service for discovering MCP servers from public registries."""

    async def search_servers(
        self,
        query: str = "mcp server",
        source: Optional[str] = None,
        page: int = 1,
        limit: int = 20,
    ) -> Dict[str, Any]:
        cache_key = _cache_key("search", query=query, source=source or "all", page=page, limit=limit)
        cached = await _get_cached(cache_key)
        if cached:
            return cached

        results: List[Dict[str, Any]] = []

        if source in (None, "all", "npm"):
            npm_results = await search_npm_mcp_servers(query, size=limit, offset=(page - 1) * limit)
            results.extend(npm_results)

        if source in (None, "all", "github"):
            github_results = await search_github_mcp_servers(query, per_page=limit, page=page)
            results.extend(github_results)

        # Sort by stars/popularity descending
        results.sort(key=lambda r: r.get("stars", 0), reverse=True)

        response = {
            "servers": results[:limit],
            "total": len(results),
            "page": page,
            "pages": max(1, (len(results) + limit - 1) // limit),
        }
        await _set_cached(cache_key, response)
        return response

    async def get_categories(self) -> List[str]:
        return [
            "File Systems",
            "Databases",
            "APIs",
            "AI/ML",
            "DevTools",
            "Communication",
            "Search",
            "Cloud",
            "Other",
        ]
