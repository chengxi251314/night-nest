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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let SearchController = class SearchController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async search(q) {
        if (!q || q.trim().length < 1)
            return { scripts: [], topics: [], characters: [] };
        const term = "%" + q.trim() + "%";
        try {
            const [scripts, topics, characters] = await Promise.all([
                this.prisma.$queryRawUnsafe("SELECT id, title, description, characterName, tags, participantCount, imageUrl FROM Script WHERE status != 'deleted' AND (title LIKE ? OR description LIKE ? OR tags LIKE ? OR characterName LIKE ?) ORDER BY createdAt DESC LIMIT 8", term, term, term, term),
                this.prisma.$queryRawUnsafe("SELECT id, title, content, authorId, tag, replyCount, createdAt FROM ForumTopic WHERE title LIKE ? OR content LIKE ? ORDER BY createdAt DESC LIMIT 8", term, term),
                this.prisma.$queryRawUnsafe("SELECT id, name, title, world, imageUrl FROM Character WHERE name LIKE ? OR title LIKE ? OR world LIKE ? ORDER BY createdAt ASC LIMIT 8", term, term, term),
            ]);
            return { scripts, topics, characters };
        }
        catch {
            return { scripts: [], topics: [], characters: [] };
        }
    }
};
exports.SearchController = SearchController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("q")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SearchController.prototype, "search", null);
exports.SearchController = SearchController = __decorate([
    (0, common_1.Controller)("v1/search"),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SearchController);
