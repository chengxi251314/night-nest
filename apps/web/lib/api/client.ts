import type {
  CharacterSummaryDto,
  ConversationSeedDto,
  MemoryListDto,
  RelationshipStateDto,
  StoryNodeDto,
  ConversationReplyDto
} from "../../../../packages/config/contracts/api";
import { characters } from "@/lib/data";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3100";

async function safeFetch<T>(path: string, init?: RequestInit): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      ...init,
      cache: "no-store"
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchCharacters(): Promise<{ items: CharacterSummaryDto[] }> {
  const live = await safeFetch<{ items: CharacterSummaryDto[] }>("/v1/characters");
  if (live) return live;
  return {
    items: characters.map(({ id, name, title, world }) => ({ id, name, title, world }))
  };
}

export async function fetchRelationship(characterId: string): Promise<RelationshipStateDto> {
  const live = await safeFetch<RelationshipStateDto>(`/v1/relationships/${characterId}`);
  if (live) return live;

  const map: Record<string, RelationshipStateDto> = {
    luoyin: { characterId: "luoyin", score: 18, stage: "试探期", mood: "克制" },
    shenye: { characterId: "shenye", score: 12, stage: "熟悉期", mood: "从容" },
    qinhuai: { characterId: "qinhuai", score: 10, stage: "观察期", mood: "冷静" }
  };
  return map[characterId];
}

export async function fetchConversationSeed(characterId: string): Promise<ConversationSeedDto> {
  const live = await safeFetch<ConversationSeedDto>(`/v1/conversations/${characterId}/seed`);
  if (live) return live;
  return {
    characterId,
    messages: [
      { role: "system", text: `角色已载入：${characterId}` },
      { role: "character", text: "欢迎来到正式工程版本。" }
    ]
  };
}

export async function postMessage(characterId: string, content: string): Promise<ConversationReplyDto | null> {
  return safeFetch<ConversationReplyDto>(`/v1/conversations/${characterId}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content })
  });
}

export async function fetchMemories(characterId: string): Promise<MemoryListDto> {
  const live = await safeFetch<MemoryListDto>(`/v1/memories/${characterId}`);
  if (live) return live;

  const fallback: Record<string, string[]> = {
    luoyin: ["你第一次没有被他的危险感逼退。", "他开始记住你疲惫时的语气变化。"],
    shenye: ["他记住了你习惯先说没事再说真话。"],
    qinhuai: ["他第一次为你暂停了模型运算。"]
  };
  return { characterId, items: fallback[characterId] || [] };
}

export async function fetchStory(characterId: string): Promise<StoryNodeDto> {
  const live = await safeFetch<StoryNodeDto>(`/v1/story/${characterId}`);
  if (live) return live;

  const fallback: Record<string, StoryNodeDto> = {
    luoyin: { characterId: "luoyin", title: "第 01 章 · 夜色试探", body: "第一步不是进攻，而是让他确认你不会把靠近当成游戏。" },
    shenye: { characterId: "shenye", title: "第 01 章 · 柔软接管", body: "先享受照顾，还是先试探边界？" },
    qinhuai: { characterId: "qinhuai", title: "第 01 章 · 变量接近", body: "你要做的，是让他继续失衡。" }
  };
  return fallback[characterId];
}
