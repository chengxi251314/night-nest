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
exports.CharactersService = void 0;
const common_1 = require("@nestjs/common");
const characters_repository_1 = require("../../database/repositories/characters.repository");
const prisma_service_1 = require("../../database/prisma.service");
let CharactersService = class CharactersService {
    charactersRepository;
    prisma;
    constructor(charactersRepository, prisma) {
        this.charactersRepository = charactersRepository;
        this.prisma = prisma;
    }
    async findAll() {
        try {
            const rows = await this.prisma.$queryRawUnsafe("SELECT id, name, title, world, imageUrl, profile, creatorId, createdAt FROM Character ORDER BY createdAt ASC");
            return { items: rows.map(r => this.hydrate(r)) };
        }
        catch {
            return { items: [] };
        }
    }
    async findOne(id) {
        try {
            const rows = await this.prisma.$queryRawUnsafe("SELECT id, name, title, world, imageUrl, profile, creatorId, createdAt FROM Character WHERE id = ?", id);
            if (!rows || rows.length === 0)
                return { error: "Not found" };
            return this.hydrate(rows[0]);
        }
        catch (e) {
            return { error: e.message };
        }
    }
    async create(body) {
        const id = "char-" + Date.now();
        const now = new Date().toISOString();
        const profile = JSON.stringify({
            tagline: body.tagline || "",
            intro: body.intro || "",
            traits: body.traits || [],
            stages: body.stages || [],
            quickActions: body.quickActions || [],
            memories: body.memories || [],
            story: body.story || [],
        });
        const imageUrl = body.imageUrl || "";
        const creatorId = body.creatorId || "demo-user";
        try {
            await this.prisma.$executeRawUnsafe("INSERT INTO Character (id, name, title, world, imageUrl, profile, creatorId, createdAt) VALUES (?,?,?,?,?,?,?,?)", id, body.name || "未命名", body.title || "", body.world || "", imageUrl, profile, creatorId, now);
            await this.prisma.$executeRawUnsafe("INSERT OR IGNORE INTO RelationshipState (id, userId, characterId, score, stage, mood, updatedAt) VALUES (?,?,?,?,?,?,?)", "rel-" + id, creatorId, id, 0, "初见", "好奇", now);
            const convId = "conv-" + id;
            await this.prisma.$executeRawUnsafe("INSERT OR IGNORE INTO Conversation (id, userId, characterId, status, createdAt) VALUES (?,?,?,?,?)", convId, creatorId, id, "active", now);
            await this.prisma.$executeRawUnsafe("INSERT OR IGNORE INTO Message (id, conversationId, role, content, createdAt) VALUES (?,?,?,?,?)", "msg-" + id, convId, "character", (body.tagline || "你好") + " ——" + (body.name || ""), now);
            return { id, name: body.name, success: true };
        }
        catch (e) {
            return { error: e.message };
        }
    }
    async update(id, body) {
        try {
            const sets = [];
            const vals = [];
            const simple = ["name", "title", "world", "imageUrl"];
            for (const f of simple) {
                if (body[f] !== undefined) {
                    sets.push(`${f} = ?`);
                    vals.push(body[f]);
                }
            }
            if (body.profile !== undefined) {
                sets.push("profile = ?");
                vals.push(JSON.stringify(body.profile));
            }
            else {
                const profileFields = ["tagline", "intro", "traits", "stages", "quickActions", "memories", "story"];
                const hasProfile = profileFields.some(f => body[f] !== undefined);
                if (hasProfile) {
                    const row = await this.prisma.$queryRawUnsafe("SELECT profile FROM Character WHERE id = ?", id).then(r => r?.[0]);
                    const existing = row?.profile ? JSON.parse(row.profile) : {};
                    for (const f of profileFields) {
                        if (body[f] !== undefined)
                            existing[f] = body[f];
                    }
                    sets.push("profile = ?");
                    vals.push(JSON.stringify(existing));
                }
            }
            if (sets.length === 0)
                return { error: "No fields to update" };
            vals.push(id);
            await this.prisma.$executeRawUnsafe(`UPDATE Character SET ${sets.join(", ")} WHERE id = ?`, ...vals);
            return { success: true };
        }
        catch (e) {
            return { error: e.message };
        }
    }
    async remove(id) {
        try {
            await this.prisma.$executeRawUnsafe("DELETE FROM Message WHERE conversationId IN (SELECT id FROM Conversation WHERE characterId = ?)", id);
            await this.prisma.$executeRawUnsafe("DELETE FROM Conversation WHERE characterId = ?", id);
            await this.prisma.$executeRawUnsafe("DELETE FROM RelationshipState WHERE characterId = ?", id);
            await this.prisma.$executeRawUnsafe("DELETE FROM Character WHERE id = ?", id);
            return { success: true };
        }
        catch (e) {
            return { error: e.message };
        }
    }
    hydrate(row) {
        let profile = {};
        try {
            profile = row.profile ? JSON.parse(row.profile) : {};
        }
        catch { /* */ }
        return {
            id: row.id,
            name: row.name,
            title: row.title,
            world: row.world,
            imageUrl: row.imageUrl || "",
            creatorId: row.creatorId || "system",
            createdAt: row.createdAt,
            tagline: profile.tagline || "",
            intro: profile.intro || "",
            traits: profile.traits || [],
            stages: profile.stages || [],
            quickActions: profile.quickActions || [],
            memories: profile.memories || [],
            story: profile.story || [],
        };
    }
};
exports.CharactersService = CharactersService;
exports.CharactersService = CharactersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [characters_repository_1.CharactersRepository,
        prisma_service_1.PrismaService])
], CharactersService);
