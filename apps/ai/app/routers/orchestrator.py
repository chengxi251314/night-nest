from fastapi import APIRouter

from app.models import OrchestrateRequest, OrchestrateResponse
from app.services.pipeline import run_pipeline, get_pipeline_status

router = APIRouter()


@router.get("/pipeline-status")
def pipeline_status():
    return get_pipeline_status()


@router.post("/orchestrate", response_model=OrchestrateResponse)
async def orchestrate(request: OrchestrateRequest):
    result = await run_pipeline(
        character_id=request.character_id,
        user_message=request.user_message,
        relationship_stage=request.relationship_stage,
        relationship_score=request.relationship_score,
        memories=request.memories,
        conversation_history=request.conversation_history,
        history_summary=request.history_summary or "",
        custom_prompt=request.custom_prompt,
        api_key=request.api_key,
        base_url=request.base_url,
        model=request.model
    )
    return OrchestrateResponse(
        reply=result["reply"],
        relationship_delta=result["relationship_delta"],
        memory_summary=result["memory_summary"],
        triggered_story_node=result["triggered_story_node"]
    )
