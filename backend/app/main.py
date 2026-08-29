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
from fastapi.middleware.cors import CORSMiddleware

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
    # ── Create tables ─────────────────────────────────────────────────────
    logger.info("Creating database tables...")
    models.Base.metadata.create_all(bind=engine)

    # ── Seed demo data ────────────────────────────────────────────────────
    logger.info("Seeding demo data...")
    db = SessionLocal()
    try:
        seed(db)
    finally:
        db.close()

    # ── Ensure TrueForge agent exists ─────────────────────────────────────
    logger.info("Checking TrueForge agent setup...")
    try:
        ok = await trueforge_service.ensure_agent_exists()
        if ok:
            logger.info("TrueForge agent 'refundguard' is ready.")
        else:
            logger.warning(
                "TrueForge agent setup failed — "
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

# ── CORS ──────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "https://refundguardai.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── REST API Routers ─────────────────────────────────────────────────────
app.include_router(health.router, tags=["Health"])
app.include_router(customers.router, prefix="/api", tags=["Customers"])
app.include_router(orders.router, prefix="/api", tags=["Orders"])
app.include_router(refund_requests.router, prefix="/api", tags=["Refund Requests"])

# ── MCP Server ────────────────────────────────────────────────────────────
# Mount the MCP server at /mcp so TrueForge can connect to it
# Register in TrueForge as: http://localhost:8000/mcp
mcp_app = mcp.sse_app()
app.mount("/mcp", mcp_app)

logger.info("RefundGuard backend started. MCP server at /mcp")
