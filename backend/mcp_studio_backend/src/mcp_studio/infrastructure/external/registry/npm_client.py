# File: src/mcp_studio/infrastructure/external/registry/npm_client.py
import logging
from typing import List, Dict, Any

import httpx

logger = logging.getLogger(__name__)

NPM_SEARCH_URL = "https://registry.npmjs.org/-/v1/search"


async def search_npm_mcp_servers(query: str = "mcp server", size: int = 20, offset: int = 0) -> List[Dict[str, Any]]:
    """Search npm registry for MCP server packages."""
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(
                NPM_SEARCH_URL,
                params={"text": query, "size": size, "from": offset},
            )
            response.raise_for_status()
            data = response.json()

            results = []
            for obj in data.get("objects", []):
                pkg = obj.get("package", {})
                results.append({
                    "source": "npm",
                    "package_name": pkg.get("name", ""),
                    "display_name": pkg.get("name", ""),
                    "description": pkg.get("description", ""),
                    "author": pkg.get("author", {}).get("name", "") if isinstance(pkg.get("author"), dict) else str(pkg.get("author", "")),
                    "version": pkg.get("version", ""),
                    "stars": obj.get("score", {}).get("detail", {}).get("popularity", 0),
                    "tags": pkg.get("keywords", [])[:5],
                    "homepage_url": pkg.get("links", {}).get("homepage", ""),
                    "install_command": f"npm install {pkg.get('name', '')}",
                })
            return results
    except Exception as e:
        logger.error(f"npm search error: {e}")
        return []
