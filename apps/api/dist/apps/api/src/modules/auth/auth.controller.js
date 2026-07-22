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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
// Simple token-based auth for demo purposes
const tokens = new Map(); // token -> userId
function generateToken() {
    return `nn_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}
let AuthController = class AuthController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async register(body) {
        if (!body.email || !body.password) {
            return { error: "Email and password required" };
        }
        try {
            const existing = await this.prisma.user.findUnique({ where: { email: body.email } });
            if (existing)
                return { error: "Email already registered" };
            const id = `user-${Date.now()}`;
            await this.createUser(id, body.email);
            const token = generateToken();
            tokens.set(token, id);
            return { token, user: { id, email: body.email } };
        }
        catch {
            return { error: "Registration failed" };
        }
    }
    async login(body) {
        if (!body.email)
            return { error: "Email required" };
        try {
            const user = await this.prisma.user.findUnique({ where: { email: body.email } });
            if (!user) {
                // Auto-register for demo
                const id = `user-${Date.now()}`;
                await this.createUser(id, body.email);
                const token = generateToken();
                tokens.set(token, id);
                return { token, user: { id, email: body.email }, created: true };
            }
            const token = generateToken();
            tokens.set(token, user.id);
            return { token, user: { id: user.id, email: user.email } };
        }
        catch {
            return { error: "Login failed" };
        }
    }
    async me(auth) {
        const token = auth?.replace("Bearer ", "");
        const userId = token ? tokens.get(token) : null;
        if (!userId)
            return { user: null };
        try {
            const user = await this.prisma.user.findUnique({ where: { id: userId } });
            return { user: user ? { id: user.id, email: user.email } : null };
        }
        catch {
            return { user: null };
        }
    }
    async createUser(id, email) {
        try {
            await this.prisma.$executeRawUnsafe(`INSERT INTO User (id, email, createdAt) VALUES (?, ?, ?)`, id, email, new Date().toISOString());
        }
        catch {
            // User might already exist
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)("register"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)("login"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)("me"),
    __param(0, (0, common_1.Headers)("authorization")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "me", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)("v1/auth"),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuthController);
