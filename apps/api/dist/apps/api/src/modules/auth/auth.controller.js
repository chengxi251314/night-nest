"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const auth_helper_1 = require("./auth-helper");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const avatarDir = path.resolve(__dirname, "..", "..", "..", "..", "..", "..", "..", "..", "apps", "web", "public", "avatars");
if (!fs.existsSync(avatarDir))
    fs.mkdirSync(avatarDir, { recursive: true });
function toUser(row) {
    if (!row)
        return null;
    return { id: row.id, email: row.email, nickname: row.nickname || "", avatar: row.avatar || "", gender: row.gender || "", bio: row.bio || "" };
}
let AuthController = class AuthController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async register(body) {
        if (!body.email || !body.password)
            return { error: "Email and password required" };
        try {
            const existing = await this.prisma.user.findUnique({ where: { email: body.email } });
            if (existing)
                return { error: "Email already registered" };
            const id = "user-" + Date.now();
            const nickname = body.nickname || body.email.split("@")[0];
            const now = new Date().toISOString();
            await this.prisma.$executeRawUnsafe("INSERT INTO User (id, email, nickname, avatar, gender, bio, createdAt) VALUES (?,?,?,?,?,?,?)", id, body.email, nickname, "", "", "", now);
            const token = (0, auth_helper_1.generateAuthToken)(id);
            return { token, user: { id, email: body.email, nickname, avatar: "", gender: "", bio: "" } };
        }
        catch {
            return { error: "Registration failed" };
        }
    }
    async login(body) {
        if (!body.email)
            return { error: "Email required" };
        try {
            const rows = await this.prisma.$queryRawUnsafe("SELECT * FROM User WHERE email = ?", body.email);
            let user = rows?.[0] || null;
            if (!user) {
                const id = "user-" + Date.now();
                const nickname = body.email.split("@")[0];
                const now = new Date().toISOString();
                await this.prisma.$executeRawUnsafe("INSERT INTO User (id, email, nickname, avatar, gender, bio, createdAt) VALUES (?,?,?,?,?,?,?)", id, body.email, nickname, "", "", "", now);
                const token = (0, auth_helper_1.generateAuthToken)(id);
                return { token, user: { id, email: body.email, nickname, avatar: "", gender: "", bio: "" }, created: true };
            }
            const token = (0, auth_helper_1.generateAuthToken)(user.id);
            return { token, user: toUser(user) };
        }
        catch {
            return { error: "Login failed" };
        }
    }
    async me(auth) {
        const userId = (0, auth_helper_1.getUserIdFromAuth)(auth);
        if (!userId || userId === "demo-user")
            return { user: null };
        try {
            const rows = await this.prisma.$queryRawUnsafe("SELECT * FROM User WHERE id = ?", userId);
            return { user: toUser(rows?.[0]) };
        }
        catch {
            return { user: null };
        }
    }
    async updateProfile(auth, body) {
        const userId = (0, auth_helper_1.getUserIdFromAuth)(auth);
        if (!userId || userId === "demo-user")
            return { error: "Not logged in" };
        try {
            const sets = [];
            const vals = [];
            if (body.nickname !== undefined) {
                sets.push("nickname = ?");
                vals.push(body.nickname);
            }
            if (body.gender !== undefined) {
                sets.push("gender = ?");
                vals.push(body.gender);
            }
            if (body.bio !== undefined) {
                sets.push("bio = ?");
                vals.push(body.bio);
            }
            if (body.avatar !== undefined) {
                sets.push("avatar = ?");
                vals.push(body.avatar);
            }
            if (sets.length === 0)
                return { error: "No fields" };
            vals.push(userId);
            await this.prisma.$executeRawUnsafe("UPDATE User SET " + sets.join(", ") + " WHERE id = ?", ...vals);
            const rows = await this.prisma.$queryRawUnsafe("SELECT * FROM User WHERE id = ?", userId);
            return { success: true, user: toUser(rows?.[0]) };
        }
        catch (e) {
            return { error: e.message };
        }
    }
    async uploadAvatar(req, res) {
        try {
            const multer = require("multer");
            const storage = multer.diskStorage({
                destination: function (_req, _file, cb) { cb(null, avatarDir); },
                filename: function (_req, file, cb) { const ext = path.extname(file.originalname) || ".png"; cb(null, "avatar-" + Date.now() + "-" + Math.random().toString(36).slice(2, 5) + ext); }
            });
            const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }).single("file");
            upload(req, res, (err) => {
                if (err)
                    return res.json({ error: err.message });
                const file = req.file;
                if (!file)
                    return res.json({ error: "No file" });
                return res.json({ avatarUrl: "/avatars/" + file.filename });
            });
        }
        catch (e) {
            return res.json({ error: e.message });
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
__decorate([
    (0, common_1.Put)("profile"),
    __param(0, (0, common_1.Headers)("authorization")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Post)("avatar"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "uploadAvatar", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)("v1/auth"),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuthController);
