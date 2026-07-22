import { Injectable } from "@nestjs/common";
import type { ConversationReplyDto, ConversationSeedDto, MessageDto } from "../../../../../packages/config/contracts/api";
import { ConversationsRepository } from "../../database/repositories/conversations.repository";
import { RelationshipsRepository } from "../../database/repositories/relationships.repository";
import { MemoriesRepository } from "../../database/repositories/memories.repository";

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

@Injectable()
export class ConversationsService {
  constructor(
    private readonly conversationsRepository: ConversationsRepository,
    private readonly relationshipsRepository: RelationshipsRepository,
    private readonly memoriesRepository: MemoriesRepository
  ) {}

  async getSeed(characterId: string): Promise<ConversationSeedDto> {
    const conversation = await this.conversationsRepository.findByUserAndCharacter("demo-user", characterId);
    const messages = conversation ? await this.conversationsRepository.findMessages(conversation.id) : [];
    return { characterId, messages: messages.map((item): MessageDto => ({ role: item.role as MessageDto["role"], text: item.content })) };
  }

  async postMessage(characterId: string, content: string, llmConfig?: { apiKey?: string; baseUrl?: string; model?: string }): Promise<ConversationReplyDto> {
    let conversation = await this.conversationsRepository.findByUserAndCharacter("demo-user", characterId);
    if (!conversation) conversation = await this.conversationsRepository.createConversation("demo-user", characterId);

    await this.conversationsRepository.createMessage(conversation.id, "user", content);

    const relationship = await this.relationshipsRepository.findByUserAndCharacter("demo-user", characterId);
    const memoryEntries = await this.memoriesRepository.findByUserAndCharacter("demo-user", characterId);
    const allMessages = await this.conversationsRepository.findMessages(conversation.id);
    const history = allMessages.filter(m => m.role === "user" || m.role === "character").slice(-10).map(m => ({ role: m.role, content: m.content }));

    let aiReply = "...";
    let relationshipDelta = 0;
    let memorySummary: string | null = null;

    try {
      const aiResponse = await fetch(`${AI_SERVICE_URL}/v1/orchestrate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          character_id: characterId,
          user_message: content,
          relationship_stage: relationship?.stage || "script",
          relationship_score: relationship?.score || 0,
          memories: (memoryEntries || []).map(m => m.summary),
          conversation_history: history,
          api_key: llmConfig?.apiKey || "",
          base_url: llmConfig?.baseUrl || "",
          model: llmConfig?.model || ""
        })
      });
      if (aiResponse.ok) {
        const data = await aiResponse.json();
        aiReply = data.reply || aiReply;
        relationshipDelta = data.relationship_delta || 0;
        memorySummary = data.memory_summary || null;
      }
    } catch (err) {
      console.warn("AI unavailable:", err);
    }

    await this.conversationsRepository.createMessage(conversation.id, "character", aiReply);
    if (relationshipDelta !== 0) await this.relationshipsRepository.updateScore("demo-user", characterId, relationshipDelta);

    if (memorySummary) {
      try {
        const { PrismaClient } = require("@prisma/client");
        const p = new PrismaClient();
        await p.$executeRawUnsafe("INSERT INTO MemoryEntry (id, userId, characterId, summary, weight, createdAt) VALUES (?,?,?,?,1,?)", `mem-${Date.now()}`, "demo-user", characterId, memorySummary, new Date().toISOString());
        await p.$disconnect();
      } catch {}
    }

    return { characterId, reply: { role: "character", text: aiReply } };
  }
}
