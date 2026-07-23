import { Injectable } from "@nestjs/common";
import type { ConversationReplyDto, ConversationSeedDto, MessageDto } from "../../../../../packages/config/contracts/api";
import { ConversationsRepository } from "../../database/repositories/conversations.repository";
import { RelationshipsRepository } from "../../database/repositories/relationships.repository";
import { MemoriesRepository } from "../../database/repositories/memories.repository";
import { PrismaService } from "../../database/prisma.service";

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

@Injectable()
export class ConversationsService {
  constructor(
    private readonly conversationsRepository: ConversationsRepository,
    private readonly relationshipsRepository: RelationshipsRepository,
    private readonly memoriesRepository: MemoriesRepository,
    private readonly prisma: PrismaService
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

    // Get last 25 messages for rich context
    const recentMessages = allMessages.filter(m => m.role === "user" || m.role === "character");
    const history = recentMessages.slice(-25).map(m => ({ role: m.role, content: m.content }));

    // Generate a concise history summary
    const historySummary = this.buildHistorySummary(recentMessages.slice(-10));

    // Determine stage label
    const stage = relationship?.stage || "初见";
    const score = relationship?.score || 0;

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
          relationship_stage: stage,
          relationship_score: score,
          memories: (memoryEntries || []).map(m => m.summary),
          conversation_history: history,
          history_summary: historySummary,
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
    await this.relationshipsRepository.updateScore("demo-user", characterId, relationshipDelta);

    // Store new memory
    if (memorySummary) {
      try {
        await this.prisma.$executeRawUnsafe(
          "INSERT INTO MemoryEntry (id, userId, characterId, summary, weight, createdAt) VALUES (?,?,?,?,1,?)",
          "mem-" + Date.now(), "demo-user", characterId, memorySummary, new Date().toISOString()
        );
      } catch {}
    }

    return { characterId, reply: { role: "character", text: aiReply }, relationship_delta: relationshipDelta };
  }

  async persistMessage(characterId: string, role: string, content: string) {
    let conversation = await this.conversationsRepository.findByUserAndCharacter("demo-user", characterId);
    if (!conversation) conversation = await this.conversationsRepository.createConversation("demo-user", characterId);
    await this.conversationsRepository.createMessage(conversation.id, role, content);
    return { success: true };
  }

  private buildHistorySummary(messages: Array<{ role: string; content: string }>): string {
    if (messages.length === 0) return "";
    const lines = messages.slice(-8).map(m => {
      const who = m.role === "user" ? "对方" : "我";
      return who + "：" + m.content.slice(0, 60);
    });
    return "最近对话：\n" + lines.join("\n");
  }
}
