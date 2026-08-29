"""
FastAPI application entry point for RefundGuard.

Mounts:
  - REST API routers
  - MCP server at /mcp (for TrueForge to connect to as an MCP server)

Startup:
  - Creates database tables
  - Seeds demo data
  - Ensures TrueForge agent exists
"""
import logging
import contextlib

from fastapi import FastAPI

from app.db.database import engine
from app.db import models
from app.db.seed import seed
from app.db.database import SessionLocal

from app.api import health, customers, orders, refund_requests
from app.mcp.server import mcp
from app.services import trueforge_service

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s  %(message)s",
)
logger = logging.getLogger(__name__)


@contextlib.asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup + shutdown lifecycle."""
    # â”€â”€ Create tables â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    logger.info("Creating database tables...")
    models.Base.metadata.create_all(bind=engine)

    # â”€â”€ Seed demo data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    logger.info("Seeding demo data...")
    db = SessionLocal()
    try:
        seed(db)
    finally:
        db.close()

    # â”€â”€ Ensure TrueForge agent exists â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    logger.info("Checking TrueForge agent setup...")
    try:
        ok = await trueforge_service.ensure_agent_exists()
        if ok:
            logger.info("TrueForge agent 'refundguard' is ready.")
        else:
            logger.warning(
                "TrueForge agent setup failed â€” "
                "make sure TrueForge is running and models/MCP servers are configured."
            )
    except Exception as e:
        logger.warning("TrueForge not available at startup: %s", e)

    yield

    logger.info("RefundGuard backend shutting down.")


app = FastAPI(
    title="RefundGuard API",
    description="AI-powered refund decision and approval agent",
    version="1.0.0",
    lifespan=lifespan,
)


# Raw CORS middleware - works with any origin, no credential restrictions
@app.middleware('http')
async def cors_anywhere(request, call_next):
    if request.method == 'OPTIONS':
        from fastapi.responses import Response as FastResponse
        resp = FastResponse(status_code=204)
        resp.headers['Access-Control-Allow-Origin'] = '*'
        resp.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
        resp.headers['Access-Control-Allow-Headers'] = '*'
        resp.headers['Access-Control-Max-Age'] = '86400'
        return resp
    response = await call_next(request)
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = '*'
    return response



# â”€â”€ REST API Routers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
app.include_router(health.router, tags=["Health"])
app.include_router(customers.router, prefix="/api", tags=["Customers"])
app.include_router(orders.router, prefix="/api", tags=["Orders"])
app.include_router(refund_requests.router, prefix="/api", tags=["Refund Requests"])

# â”€â”€ MCP Server â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
# Mount the MCP server at /mcp so TrueForge can connect to it
# Register in TrueForge as: http://localhost:8000/mcp
mcp_app = mcp.sse_app()
app.mount("/mcp", mcp_app)

logger.info("RefundGuard backend started. MCP server at /mcp")


