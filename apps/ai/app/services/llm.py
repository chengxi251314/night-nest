"""LLM service wrapper. Supports OpenAI-compatible APIs and local fallback."""

import os, re, random

try:
    from openai import OpenAI
    _openai_available = True
except ImportError:
    _openai_available = False

API_KEY = os.environ.get("OPENAI_API_KEY", "")
BASE_URL = os.environ.get("OPENAI_BASE_URL", "https://api.openai.com/v1")
MODEL = os.environ.get("LLM_MODEL", "gpt-4.1-mini")


def is_available() -> bool:
    return _openai_available and bool(API_KEY)


def _llm_available(api_key: str = "") -> bool:
    return _openai_available and bool(api_key or API_KEY)


def _parse_response(text: str) -> dict:
    reply = text; delta = 0; memory = None
    m = re.search(r'\[REPLY\]\s*\n?(.*?)(?=\[DELTA\]|\[MEMORY\]|$)', text, re.DOTALL)
    if m: reply = m.group(1).strip()
    m = re.search(r'\[DELTA\]\s*\n?([+-]?\d+)', text)
    if m:
        try: delta = int(m.group(1))
        except ValueError: pass
    m = re.search(r'\[MEMORY\]\s*\n?(.*?)(?=$)', text, re.DOTALL)
    if m:
        mem = m.group(1).strip()
        if mem.upper() != "NONE": memory = mem
    return {"reply": reply, "delta": delta, "memory": memory}


async def chat(
    system_prompt: str,
    user_message: str,
    conversation_history: list[dict] = [],
    character_id: str = "",
    api_key: str = "",
    base_url: str = "",
    model: str = ""
) -> dict:
    key = api_key or API_KEY
    url = base_url or BASE_URL
    mdl = model or MODEL

    if not _llm_available(key):
        return _fallback(character_id, user_message, system_prompt)

    messages = [{"role": "system", "content": system_prompt}]
    for msg in conversation_history[-10:]:
        role = "assistant" if msg.get("role") == "character" else "user"
        messages.append({"role": role, "content": msg.get("content", "")})
    messages.append({"role": "user", "content": user_message})

    try:
        client = OpenAI(api_key=key, base_url=url)
        resp = client.chat.completions.create(model=mdl, messages=messages, temperature=0.85, max_tokens=300)
        return _parse_response(resp.choices[0].message.content or "")
    except Exception as e:
        print(f"LLM error: {e}")
        return _fallback(character_id, user_message, system_prompt)


def _fallback(character_id: str, user_message: str, system_prompt: str = "") -> dict:
    builtin: dict[str, list[str]] = {
        "luoyin": ["你说这些，是想让我在意吗？", "……你还挺会挑话题的。", "我不讨厌你问这个。"],
        "shenye": ["我注意到你在想这件事很久了。", "没关系。我在这里听着。"],
        "qinhuai": ["这个问题比我想象的有深度。", "我在计算你问这个的概率。"],
        "fuyanzhi": ["请坐。不用紧张。这只是聊天。", "你觉得呢？", "我理解。"],
    }
    if not system_prompt or character_id in builtin:
        pool = builtin.get(character_id, ["嗯。"])
        return {"reply": random.choice(pool), "delta": random.randint(1, 4), "memory": None}

    sp = system_prompt
    if any(w in sp for w in ["傅衍之", "精神科", "操纵者", "医者"]):
        pool = ["请坐。不用紧张。这只是聊天。", "你觉得呢？", "我理解。"]
    elif any(w in sp for w in ["洛因", "魅魔", "魔域"]):
        pool = ["你胆子不小。", "既然来了，就别着急走。"]
    elif any(w in sp for w in ["深野", "俱乐部", "夜航"]):
        pool = ["先坐下。我去给你倒杯喝的。", "这里很安全。可以放松。"]
    elif any(w in sp for w in ["秦淮", "实验", "模型", "研究"]):
        pool = ["这个问题的变量比我预期的多。", "你的假设很有意思。"]
    else:
        pool = ["（以自定义设定回应你）"]

    return {"reply": random.choice(pool), "delta": random.randint(1, 5), "memory": None}
