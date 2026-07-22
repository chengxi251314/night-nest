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
exports.RelationshipsRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const seed_data_1 = require("../../../prisma/seed/seed-data");
const STAGES = {
    luoyin: [
        { max: 29, label: "试探期", mood: "克制" },
        { max: 59, label: "松动期", mood: "好奇" },
        { max: 84, label: "偏爱期", mood: "依赖" },
        { max: 100, label: "沉沦期", mood: "占有" }
    ],
    shenye: [
        { max: 29, label: "熟悉期", mood: "从容" },
        { max: 59, label: "照看期", mood: "温柔" },
        { max: 84, label: "独占期", mood: "认真" },
        { max: 100, label: "绑定期", mood: "深情" }
    ],
    qinhuai: [
        { max: 29, label: "观察期", mood: "冷静" },
        { max: 59, label: "接纳期", mood: "专注" },
        { max: 84, label: "动心期", mood: "温柔" },
        { max: 100, label: "偏执期", mood: "占有" }
    ]
};
function resolveStage(characterId, score) {
    const stages = STAGES[characterId] || [{ max: 100, label: "试探期", mood: "平静" }];
    for (const s of stages) {
        if (score <= s.max)
            return { stage: s.label, mood: s.mood };
    }
    return { stage: stages[stages.length - 1].label, mood: stages[stages.length - 1].mood };
}
let RelationshipsRepository = class RelationshipsRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByUserAndCharacter(userId, characterId) {
        try {
            return await this.prisma.relationshipState.findUnique({
                where: { userId_characterId: { userId, characterId } }
            });
        }
        catch {
            return seed_data_1.seedRelationships.find((item) => item.userId === userId && item.characterId === characterId) ?? null;
        }
    }
    async updateScore(userId, characterId, delta) {
        const current = await this.findByUserAndCharacter(userId, characterId);
        if (!current)
            return null;
        const newScore = Math.min(100, Math.max(0, current.score + delta));
        const { stage, mood } = resolveStage(characterId, newScore);
        const now = new Date().toISOString();
        try {
            await this.prisma.$executeRawUnsafe(`UPDATE RelationshipState SET score = ?, stage = ?, mood = ?, updatedAt = ? WHERE userId = ? AND characterId = ?`, newScore, stage, mood, now, userId, characterId);
            return { ...current, score: newScore, stage, mood, updatedAt: now };
        }
        catch {
            return { ...current, score: newScore, stage, mood };
        }
    }
};
exports.RelationshipsRepository = RelationshipsRepository;
exports.RelationshipsRepository = RelationshipsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RelationshipsRepository);
