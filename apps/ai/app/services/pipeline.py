"""Orchestration pipeline: loads character profile, builds context, calls LLM, parses result."""

from app.characters.profiles import build_system_prompt
from app.services.llm import chat, is_available


async def run_pipeline(
    character_id: str,
    user_message: str,
    relationship_stage: str = "script",
    relationship_score: int = 0,
    memories: list[str] = [],
    conversation_history: list[dict] = [],
    custom_prompt: str = "",
    api_key: str = "",
    base_url: str = "",
    model: str = ""
) -> dict:
    if custom_prompt:
        system_prompt = custom_prompt
    else:
        system_prompt = build_system_prompt(character_id, relationship_stage, memories)

    llm_result = await chat(
        system_prompt=system_prompt,
        user_message=user_message,
        conversation_history=conversation_history,
        character_id=character_id,
        api_key=api_key,
        base_url=base_url,
        model=model
    )

    result = {
        "reply": llm_result["reply"],
        "relationship_delta": llm_result.get("delta", 0),
        "memory_summary": llm_result.get("memory"),
        "triggered_story_node": None
    }

    new_score = relationship_score + llm_result.get("delta", 0)
    story_triggers = _check_story_triggers(character_id, relationship_score, new_score)
    if story_triggers:
        result["triggered_story_node"] = story_triggers

    return result


def _check_story_triggers(character_id: str, old_score: int, new_score: int) -> str | None:
    thresholds: dict[str, list[tuple[int, str, str]]] = {
        "luoyin": [(30, "story-luoyin-002", "ch02"), (60, "story-luoyin-003", "ch03")],
        "shenye": [(30, "story-shenye-002", "ch02"), (60, "story-shenye-003", "ch03")],
        "qinhuai": [(30, "story-qinhuai-002", "ch02"), (60, "story-qinhuai-003", "ch03")],
    }
    for threshold, node_id, _title in thresholds.get(character_id, []):
        if old_score < threshold <= new_score:
            return node_id
    return None


def get_pipeline_status() -> dict:
    return {
        "pipeline": [
            "load-character-profile", "load-relationship-state",
            "retrieve-relevant-memories", "check-story-trigger",
            "generate-response", "safety-review", "write-memory-if-needed"
        ],
        "llm_available": is_available(),
        "characters": ["luoyin", "shenye", "qinhuai", "fuyanzhi"]
    }
