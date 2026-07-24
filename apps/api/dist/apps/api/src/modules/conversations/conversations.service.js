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
const prisma_service_1 = require("../../database/prisma.service");
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";
let ConversationsService = class ConversationsService {
    conversationsRepository;
    relationshipsRepository;
    memoriesRepository;
    prisma;
    constructor(conversationsRepository, relationshipsRepository, memoriesRepository, prisma) {
        this.conversationsRepository = conversationsRepository;
        this.relationshipsRepository = relationshipsRepository;
        this.memoriesRepository = memoriesRepository;
        this.prisma = prisma;
    }
    async getSeed(characterId, userId) {
        const conversation = await this.conversationsRepository.findByUserAndCharacter(userId, characterId);
        const messages = conversation ? await this.conversationsRepository.findMessages(conversation.id) : [];
        return { characterId, messages: messages.map((item) => ({ role: item.role, text: item.content })) };
    }
    async postMessage(characterId, content, userId, llmConfig) {
        let conversation = await this.conversationsRepository.findByUserAndCharacter(userId, characterId);
        if (!conversation)
            conversation = await this.conversationsRepository.createConversation(userId, characterId);
        await this.conversationsRepository.createMessage(conversation.id, "user", content);
        const relationship = await this.relationshipsRepository.findByUserAndCharacter(userId, characterId);
        const memoryEntries = await this.memoriesRepository.findByUserAndCharacter(userId, characterId);
        const allMessages = await this.conversationsRepository.findMessages(conversation.id);
        const recentMessages = allMessages.filter(m => m.role === "user" || m.role === "character");
        const history = recentMessages.slice(-25).map(m => ({ role: m.role, content: m.content }));
        const historySummary = this.buildHistorySummary(recentMessages.slice(-10));
        const stage = relationship?.stage || "初见";
        const score = relationship?.score || 0;
        let aiReply = "...";
        let relationshipDelta = 0;
        let memorySummary = null;
        try {
            const aiResponse = await fetch(`${AI_SERVICE_URL}/v1/orchestrate`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    character_id: characterId, user_message: content, relationship_stage: stage, relationship_score: score,
                    memories: (memoryEntries || []).map(m => m.summary), conversation_history: history, history_summary: historySummary,
                    api_key: llmConfig?.apiKey || "", base_url: llmConfig?.baseUrl || "", model: llmConfig?.model || ""
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
        await this.relationshipsRepository.updateScore(userId, characterId, relationshipDelta);
        if (memorySummary) {
            try {
                await this.prisma.$executeRawUnsafe("INSERT INTO MemoryEntry (id, userId, characterId, summary, weight, createdAt) VALUES (?,?,?,?,1,?)", "mem-" + Date.now(), userId, characterId, memorySummary, new Date().toISOString());
            }
            catch { }
        }
        return { characterId, reply: { role: "character", text: aiReply }, relationship_delta: relationshipDelta };
    }
    async persistMessage(characterId, role, content, userId) {
        let conversation = await this.conversationsRepository.findByUserAndCharacter(userId, characterId);
        if (!conversation)
            conversation = await this.conversationsRepository.createConversation(userId, characterId);
        await this.conversationsRepository.createMessage(conversation.id, role, content);
        return { success: true };
    }
    buildHistorySummary(messages) {
        if (messages.length === 0)
            return "";
        const lines = messages.slice(-8).map(m => { const who = m.role === "user" ? "对方" : "我"; return who + "：" + m.content.slice(0, 60); });
        return "最近对话：\n" + lines.join("\n");
    }
};
exports.ConversationsService = ConversationsService;
exports.ConversationsService = ConversationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [conversations_repository_1.ConversationsRepository,
        relationships_repository_1.RelationshipsRepository,
        memories_repository_1.MemoriesRepository,
        prisma_service_1.PrismaService])
], ConversationsService);
