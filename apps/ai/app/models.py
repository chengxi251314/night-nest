"""Request and response models for the AI orchestration API."""

from pydantic import BaseModel


class OrchestrateRequest(BaseModel):
    character_id: str
    user_message: str
    relationship_stage: str = "script"
    relationship_score: int = 0
    memories: list[str] = []
    conversation_history: list[dict] = []
    custom_prompt: str = ""
    api_key: str = ""
    base_url: str = ""
    model: str = ""


class OrchestrateResponse(BaseModel):
    reply: str
    relationship_delta: int = 0
    memory_summary: str | None = None
    triggered_story_node: str | None = None
