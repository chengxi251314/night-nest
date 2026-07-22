import os
from pathlib import Path

# Load .env file
_env = Path(__file__).parent.parent / ".env"
if _env.exists():
    with open(_env, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip())

from fastapi import FastAPI
from app.routers.health import router as health_router
from app.routers.orchestrator import router as orchestrator_router

app = FastAPI(title="night-nest-ai", version="0.2.0")
app.include_router(health_router)
app.include_router(orchestrator_router, prefix="/v1")
