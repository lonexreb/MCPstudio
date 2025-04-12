# File: src/mcp_studio/main.py
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from mcp_studio.api.routes import server_routes, tool_routes, auth_routes
from mcp_studio.api.websocket import server_status, tool_execution
from mcp_studio.config.settings import settings
from mcp_studio.container import container
from mcp_studio.infrastructure.database.connection import database

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


# Startup and shutdown events
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect to the database
    await database.connect_to_database()
    logger.info("Connected to MongoDB")
    
    yield
    
    # Shutdown: Close database connection
    await database.close_database_connection()
    logger.info("Closed MongoDB connection")


# Create FastAPI application
app = FastAPI(
    title=settings.api_title,
    description=settings.api_description,
    version=settings.api_version,
    lifespan=lifespan
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

# Include WebSocket routers
app.include_router(server_status.router, tags=["WebSockets"])
app.include_router(tool_execution.router, tags=["WebSockets"])


@app.get("/", tags=["Health Check"])
async def root():
    """Health check endpoint."""
    return {"status": "ok", "message": "MCPStudio API is running"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "mcp_studio.main:app", 
        host=settings.host, 
        port=settings.port, 
        reload=settings.debug
    )