from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
def health():
    return {
        "name": "night-nest-ai",
        "status": "ok",
        "date": "2026-07-21"
    }
