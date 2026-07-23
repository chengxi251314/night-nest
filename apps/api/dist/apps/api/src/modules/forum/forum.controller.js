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
exports.ForumController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let ForumController = class ForumController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listTopics() {
        try {
            const topics = await this.prisma.$queryRawUnsafe("SELECT * FROM ForumTopic ORDER BY createdAt DESC");
            return { items: topics };
        }
        catch {
            return { items: [] };
        }
    }
    async getTopic(id) {
        try {
            const rows = await this.prisma.$queryRawUnsafe("SELECT * FROM ForumTopic WHERE id = ?", id);
            if (!rows || rows.length === 0)
                return { error: "Not found" };
            const replies = await this.prisma.$queryRawUnsafe("SELECT * FROM ForumReply WHERE topicId = ? ORDER BY createdAt ASC", id);
            return { topic: rows[0], replies };
        }
        catch {
            return { error: "Failed" };
        }
    }
    async createTopic(body) {
        const id = "topic-" + Date.now();
        const now = new Date().toISOString();
        try {
            await this.prisma.$executeRawUnsafe("INSERT INTO ForumTopic (id, title, content, authorId, tag, replyCount, likes, createdAt) VALUES (?,?,?,?,?,0,0,?)", id, body.title || "", body.content || "", body.authorId || "匿名", body.tag || "general", now);
            return { id, success: true };
        }
        catch (e) {
            return { error: e.message };
        }
    }
    async createReply(topicId, body) {
        const id = "reply-" + Date.now();
        const now = new Date().toISOString();
        try {
            await this.prisma.$executeRawUnsafe("INSERT INTO ForumReply (id, topicId, authorId, content, likes, createdAt) VALUES (?,?,?,?,0,?)", id, topicId, body.authorId || "匿名", body.content || "", now);
            await this.prisma.$executeRawUnsafe("UPDATE ForumTopic SET replyCount = replyCount + 1 WHERE id = ?", topicId);
            // Create notification for topic author
            const topic = await this.prisma.$queryRawUnsafe("SELECT authorId, title FROM ForumTopic WHERE id = ?", topicId);
            if (topic[0] && topic[0].authorId !== body.authorId) {
                const now = new Date().toISOString();
                await this.prisma.$executeRawUnsafe("INSERT INTO Notification (id, userId, type, title, body, link, read, createdAt) VALUES (?,?,?,?,?,?,0,?)", "notif-" + Date.now(), topic[0].authorId, "reply", "有人回复了你的话题", (body.authorId || "匿名") + " 回复了：「" + (body.content || "").slice(0, 40) + "」", "/forum", now);
            }
            return { id, success: true };
        }
        catch (e) {
            return { error: e.message };
        }
    }
    async likeTopic(id) {
        try {
            await this.prisma.$executeRawUnsafe("UPDATE ForumTopic SET likes = likes + 1 WHERE id = ?", id);
            return { success: true };
        }
        catch {
            return { error: "Failed" };
        }
    }
    async likeReply(id) {
        try {
            await this.prisma.$executeRawUnsafe("UPDATE ForumReply SET likes = likes + 1 WHERE id = ?", id);
            return { success: true };
        }
        catch {
            return { error: "Failed" };
        }
    }
};
exports.ForumController = ForumController;
__decorate([
    (0, common_1.Get)("topics"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ForumController.prototype, "listTopics", null);
__decorate([
    (0, common_1.Get)("topics/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ForumController.prototype, "getTopic", null);
__decorate([
    (0, common_1.Post)("topics"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ForumController.prototype, "createTopic", null);
__decorate([
    (0, common_1.Post)("topics/:id/replies"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ForumController.prototype, "createReply", null);
__decorate([
    (0, common_1.Post)("topics/:id/like"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ForumController.prototype, "likeTopic", null);
__decorate([
    (0, common_1.Post)("replies/:id/like"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ForumController.prototype, "likeReply", null);
exports.ForumController = ForumController = __decorate([
    (0, common_1.Controller)("v1/forum"),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ForumController);
