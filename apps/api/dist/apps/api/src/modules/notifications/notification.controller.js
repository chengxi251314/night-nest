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
exports.NotificationController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const tokens = new Map();
let NotificationController = class NotificationController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(auth) {
        const token = auth?.replace("Bearer ", "");
        const userId = token ? tokens.get(token) : null;
        const uid = userId || "demo-user";
        try {
            const rows = await this.prisma.$queryRawUnsafe("SELECT * FROM Notification WHERE userId = ? OR userId = 'all' ORDER BY createdAt DESC LIMIT 30", uid);
            const unread = rows.filter(r => !r.read).length;
            return { items: rows, unread };
        }
        catch {
            return { items: [], unread: 0 };
        }
    }
    async readAll(auth) {
        const token = auth?.replace("Bearer ", "");
        const userId = token ? tokens.get(token) : null;
        const uid = userId || "demo-user";
        try {
            await this.prisma.$executeRawUnsafe("UPDATE Notification SET read = 1 WHERE userId = ?", uid);
            return { success: true };
        }
        catch {
            return { error: "Failed" };
        }
    }
};
exports.NotificationController = NotificationController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Headers)("authorization")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "list", null);
__decorate([
    (0, common_1.Post)("read-all"),
    __param(0, (0, common_1.Headers)("authorization")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "readAll", null);
exports.NotificationController = NotificationController = __decorate([
    (0, common_1.Controller)("v1/notifications"),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationController);
