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
exports.StoryRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const seed_data_1 = require("../../../prisma/seed/seed-data");
let StoryRepository = class StoryRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findCurrentNode(characterId) {
        try {
            return await this.prisma.storyNode.findFirst({ where: { characterId }, orderBy: { chapterOrder: "asc" } });
        }
        catch {
            return seed_data_1.seedStoryNodes.filter((item) => item.characterId === characterId).sort((left, right) => left.chapterOrder - right.chapterOrder)[0] ?? null;
        }
    }
    async findTriggers(characterId) {
        try {
            return await this.prisma.storyTrigger.findMany({ where: { characterId } });
        }
        catch {
            return seed_data_1.seedStoryTriggers.filter((item) => item.characterId === characterId);
        }
    }
};
exports.StoryRepository = StoryRepository;
exports.StoryRepository = StoryRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StoryRepository);
