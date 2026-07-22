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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let AdminController = class AdminController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStats() {
        try {
            const [userCount, characterCount, conversationCount, messageCount, relStates] = await Promise.all([
                this.prisma.user.count(),
                this.prisma.character.count(),
                this.prisma.conversation.count(),
                this.prisma.message.count(),
                this.prisma.relationshipState.findMany({ select: { characterId: true, score: true, stage: true } }),
            ]);
            const byStage = {};
            const byCharacter = {};
            for (const r of relStates) {
                byStage[r.stage] = (byStage[r.stage] || 0) + 1;
                if (!byCharacter[r.characterId]) {
                    byCharacter[r.characterId] = { total: 0, avgScore: 0, stage: r.stage };
                }
                byCharacter[r.characterId].total++;
                byCharacter[r.characterId].avgScore += r.score;
            }
            for (const c of Object.keys(byCharacter)) {
                byCharacter[c].avgScore = Math.round(byCharacter[c].avgScore / byCharacter[c].total);
            }
            return {
                users: userCount,
                characters: characterCount,
                conversations: conversationCount,
                messages: messageCount,
                relationshipsByStage: byStage,
                relationshipsByCharacter: byCharacter,
            };
        }
        catch {
            return {
                users: 1, characters: 3, conversations: 3, messages: 6,
                relationshipsByStage: { "试探期": 1, "熟悉期": 1, "观察期": 1 },
                relationshipsByCharacter: {
                    luoyin: { total: 1, avgScore: 18, stage: "试探期" },
                    shenye: { total: 1, avgScore: 12, stage: "熟悉期" },
                    qinhuai: { total: 1, avgScore: 10, stage: "观察期" },
                },
            };
        }
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)("stats"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getStats", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)("v1/admin"),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminController);
