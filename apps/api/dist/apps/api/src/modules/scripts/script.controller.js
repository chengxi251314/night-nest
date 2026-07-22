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
exports.ScriptController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const uploadDir = path.resolve(__dirname, "../../../../../../apps/web/public/scripts");
if (!fs.existsSync(uploadDir))
    fs.mkdirSync(uploadDir, { recursive: true });
let ScriptController = class ScriptController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    // --- LIST ---
    async list() {
        try {
            const scripts = await this.prisma.$queryRawUnsafe(`SELECT id, title, description, characterName, world, tags, creatorId, participantCount, status, createdAt, imageUrl FROM Script WHERE status != 'deleted' ORDER BY createdAt DESC`);
            return { items: scripts };
        }
        catch {
            return { items: [] };
        }
    }
    // --- DETAIL ---
    async detail(id) {
        try {
            const rows = await this.prisma.$queryRawUnsafe(`SELECT * FROM Script WHERE id = ?`, id);
            if (!rows || rows.length === 0)
                return { error: "Not found" };
            const participants = await this.prisma.$queryRawUnsafe(`SELECT sp.userId, sp.joinedAt, u.email FROM ScriptParticipant sp JOIN User u ON sp.userId = u.id WHERE sp.scriptId = ?`, id);
            const messages = await this.prisma.$queryRawUnsafe(`SELECT id, userId, role, content, createdAt FROM ScriptMessage WHERE scriptId = ? ORDER BY createdAt ASC LIMIT 50`, id);
            return { script: rows[0], participants, messages };
        }
        catch {
            return { error: "Failed" };
        }
    }
    // --- CREATE ---
    async create(body) {
        const id = `script-${Date.now()}`;
        const now = new Date().toISOString();
        try {
            await this.prisma.$executeRawUnsafe(`INSERT INTO Script (id, title, description, characterName, characterPrompt, world, tags, creatorId, status, participantCount, createdAt, imageUrl) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`, id, body.title || "", body.description || "", body.characterName || "", body.characterPrompt || "", body.world || "", body.tags || "", body.creatorId || "demo-user", "published", 1, now, body.imageUrl || "");
            await this.prisma.$executeRawUnsafe(`INSERT INTO ScriptParticipant (id, scriptId, userId, joinedAt) VALUES (?,?,?,?)`, `sp-${id}`, id, body.creatorId || "demo-user", now);
            return { id, title: body.title };
        }
        catch (e) {
            return { error: "Failed: " + e.message };
        }
    }
    // --- UPDATE ---
    async update(id, body) {
        try {
            const sets = [];
            const vals = [];
            const fields = ["title", "description", "characterName", "characterPrompt", "world", "tags", "imageUrl"];
            for (const f of fields) {
                if (body[f] !== undefined) {
                    sets.push(`${f} = ?`);
                    vals.push(body[f]);
                }
            }
            if (sets.length === 0)
                return { error: "No fields to update" };
            vals.push(id);
            await this.prisma.$executeRawUnsafe(`UPDATE Script SET ${sets.join(", ")} WHERE id = ?`, ...vals);
            return { success: true };
        }
        catch (e) {
            return { error: e.message };
        }
    }
    // --- DELETE (soft) ---
    async remove(id) {
        try {
            await this.prisma.$executeRawUnsafe(`UPDATE Script SET status = 'deleted' WHERE id = ?`, id);
            return { success: true };
        }
        catch {
            return { error: "Delete failed" };
        }
    }
    // --- UPLOAD IMAGE ---
    async uploadImage(req, res) {
        try {
            const multer = require("multer");
            multer({ dest: uploadDir, limits: { fileSize: 10 * 1024 * 1024 } }).single("file")(req, res, (err) => {
                if (err)
                    return res.json({ error: err.message });
                const file = req.file;
                if (!file)
                    return res.json({ error: "No file" });
                const ext = path.extname(file.originalname) || ".png";
                const newName = `script-${Date.now()}${ext}`;
                fs.renameSync(file.path, path.join(uploadDir, newName));
                return res.json({ imageUrl: `/scripts/${newName}` });
            });
        }
        catch (e) {
            return res.json({ error: e.message });
        }
    }
    // --- JOIN ---
    async join(id, body) {
        const now = new Date().toISOString();
        const uid = body.userId || "demo-user";
        try {
            await this.prisma.$executeRawUnsafe(`INSERT OR IGNORE INTO ScriptParticipant (id, scriptId, userId, joinedAt) VALUES (?,?,?,?)`, `sp-${id}-${uid}`, id, uid, now);
            await this.prisma.$executeRawUnsafe(`UPDATE Script SET participantCount = (SELECT COUNT(*) FROM ScriptParticipant WHERE scriptId = ?) WHERE id = ?`, id, id);
            return { success: true };
        }
        catch {
            return { error: "Join failed" };
        }
    }
    // --- MESSAGES ---
    async postMessage(id, body) {
        const now = new Date().toISOString();
        const uid = body.userId || "demo-user";
        try {
            await this.prisma.$executeRawUnsafe(`INSERT INTO ScriptMessage (id, scriptId, userId, role, content, createdAt) VALUES (?,?,?,?,?,?)`, `sm-${Date.now()}`, id, uid, "user", body.content, now);
            let reply = "...";
            try {
                const rows = await this.prisma.$queryRawUnsafe(`SELECT characterName FROM Script WHERE id = ?`, id);
                const charName = rows[0]?.characterName || "";
                const charPrompt = rows[0]?.characterPrompt || "";
                const aiRes = await fetch(`http://localhost:8000/v1/orchestrate`, {
                    method: "POST", headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ character_id: charName, user_message: body.content, relationship_stage: "script", relationship_score: 0, memories: [], conversation_history: [], custom_prompt: charPrompt })
                });
                if (aiRes.ok) {
                    const d = await aiRes.json();
                    reply = d.reply || reply;
                }
            }
            catch { /* */ }
            await this.prisma.$executeRawUnsafe(`INSERT INTO ScriptMessage (id, scriptId, userId, role, content, createdAt) VALUES (?,?,?,?,?,?)`, `sm-${Date.now()}-r`, id, "system", "character", reply, new Date().toISOString());
            return { reply: { role: "character", text: reply } };
        }
        catch {
            return { reply: { role: "character", text: "..." } };
        }
    }
};
exports.ScriptController = ScriptController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ScriptController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ScriptController.prototype, "detail", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ScriptController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ScriptController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ScriptController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)("upload"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ScriptController.prototype, "uploadImage", null);
__decorate([
    (0, common_1.Post)(":id/join"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ScriptController.prototype, "join", null);
__decorate([
    (0, common_1.Post)(":id/messages"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ScriptController.prototype, "postMessage", null);
exports.ScriptController = ScriptController = __decorate([
    (0, common_1.Controller)("v1/scripts"),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ScriptController);
