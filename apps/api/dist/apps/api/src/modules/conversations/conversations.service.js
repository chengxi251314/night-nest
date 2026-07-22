"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationsService = void 0;
const common_1 = require("@nestjs/common");
const conversations_repository_1 = require("../../database/repositories/conversations.repository");
const relationships_repository_1 = require("../../database/repositories/relationships.repository");
const memories_repository_1 = require("../../database/repositories/memories.repository");
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";
let ConversationsService = class ConversationsService {
    conversationsRepository;
    relationshipsRepository;
    memoriesRepository;
    constructor(conversationsRepository, relationshipsRepository, memoriesRepository) {
        this.conversationsRepository = conversationsRepository;
        this.relationshipsRepository = relationshipsRepository;
        this.memoriesRepository = memoriesRepository;
    }
    async getSeed(characterId) {
        const conversation = await this.conversationsRepository.findByUserAndCharacter("demo-user", characterId);
        const messages = conversation ? await this.conversationsRepository.findMessages(conversation.id) : [];
        return { characterId, messages: messages.map((item) => ({ role: item.role, text: item.content })) };
    }
    async postMessage(characterId, content, llmConfig) {
        let conversation = await this.conversationsRepository.findByUserAndCharacter("demo-user", characterId);
        if (!conversation)
            conversation = await this.conversationsRepository.createConversation("demo-user", characterId);
        await this.conversationsRepository.createMessage(conversation.id, "user", content);
        const relationship = await this.relationshipsRepository.findByUserAndCharacter("demo-user", characterId);
        const memoryEntries = await this.memoriesRepository.findByUserAndCharacter("demo-user", characterId);
        const allMessages = await this.conversationsRepository.findMessages(conversation.id);
        const history = allMessages.filter(m => m.role === "user" || m.role === "character").slice(-10).map(m => ({ role: m.role, content: m.content }));
        let aiReply = "...";
        let relationshipDelta = 0;
        let memorySummary = null;
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
        }
        catch (err) {
            console.warn("AI unavailable:", err);
        }
        await this.conversationsRepository.createMessage(conversation.id, "character", aiReply);
        if (relationshipDelta !== 0)
            await this.relationshipsRepository.updateScore("demo-user", characterId, relationshipDelta);
        if (memorySummary) {
            try {
                const { PrismaClient } = require("@prisma/client");
                const p = new PrismaClient();
                await p.$executeRawUnsafe("INSERT INTO MemoryEntry (id, userId, characterId, summary, weight, createdAt) VALUES (?,?,?,?,1,?)", `mem-${Date.now()}`, "demo-user", characterId, memorySummary, new Date().toISOString());
                await p.$disconnect();
            }
            catch { }
        }
        return { characterId, reply: { role: "character", text: aiReply } };
    }
};
exports.ConversationsService = ConversationsService;
exports.ConversationsService = ConversationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [conversations_repository_1.ConversationsRepository,
        relationships_repository_1.RelationshipsRepository,
        memories_repository_1.MemoriesRepository])
], ConversationsService);
