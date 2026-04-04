# File: src/mcp_studio/infrastructure/external/registry/github_client.py
import logging
from typing import List, Dict, Any

import httpx

logger = logging.getLogger(__name__)

GITHUB_SEARCH_URL = "https://api.github.com/search/repositories"


async def search_github_mcp_servers(query: str = "mcp server", per_page: int = 20, page: int = 1) -> List[Dict[str, Any]]:
    """Search GitHub for MCP server repositories."""
    try:
        async with httpx.AsyncClient(timeout=15.0, headers={"User-Agent": "MCPStudio/1.0"}) as client:
            response = await client.get(
                GITHUB_SEARCH_URL,
                params={
                    "q": f"{query} in:name,description,topics",
                    "sort": "stars",
                    "order": "desc",
                    "per_page": per_page,
                    "page": page,
                },
                headers={"Accept": "application/vnd.github.v3+json"},
            )
            response.raise_for_status()
            data = response.json()

            results = []
            for repo in data.get("items", []):
                results.append({
                    "source": "github",
                    "package_name": repo.get("full_name", ""),
                    "display_name": repo.get("name", ""),
                    "description": repo.get("description", "") or "",
                    "author": repo.get("owner", {}).get("login", ""),
                    "version": "",
                    "stars": repo.get("stargazers_count", 0),
                    "tags": repo.get("topics", [])[:5],
                    "homepage_url": repo.get("html_url", ""),
                    "install_command": f"git clone {repo.get('clone_url', '')}",
                })
            return results
    except Exception as e:
        logger.error(f"GitHub search error: {e}")
        return []
