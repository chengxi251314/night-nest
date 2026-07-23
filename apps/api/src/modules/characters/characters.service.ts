import { Injectable } from "@nestjs/common";
import type { CharacterSummaryDto } from "../../../../../packages/config/contracts/api";
import { CharactersRepository } from "../../database/repositories/characters.repository";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class CharactersService {
  constructor(
    private readonly charactersRepository: CharactersRepository,
    private readonly prisma: PrismaService
  ) {}

  async findAll(): Promise<{ items: any[] }> {
    try {
      const rows = await this.prisma.$queryRawUnsafe<any[]>(
        "SELECT id, name, title, world, imageUrl, profile, creatorId, createdAt FROM Character ORDER BY createdAt ASC"
      );
      return { items: rows.map(r => this.hydrate(r)) };
    } catch {
      return { items: [] };
    }
  }

  async findOne(id: string) {
    try {
      const rows = await this.prisma.$queryRawUnsafe<any[]>(
        "SELECT id, name, title, world, imageUrl, profile, creatorId, createdAt FROM Character WHERE id = ?", id
      );
      if (!rows || rows.length === 0) return { error: "Not found" };
      return this.hydrate(rows[0]);
    } catch (e: any) {
      return { error: e.message };
    }
  }

  async create(body: any) {
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
      await this.prisma.$executeRawUnsafe(
        "INSERT INTO Character (id, name, title, world, imageUrl, profile, creatorId, createdAt) VALUES (?,?,?,?,?,?,?,?)",
        id, body.name || "未命名", body.title || "", body.world || "", imageUrl, profile, creatorId, now
      );
      await this.prisma.$executeRawUnsafe(
        "INSERT OR IGNORE INTO RelationshipState (id, userId, characterId, score, stage, mood, updatedAt) VALUES (?,?,?,?,?,?,?)",
        "rel-" + id, creatorId, id, 0, "初见", "好奇", now
      );
      const convId = "conv-" + id;
      await this.prisma.$executeRawUnsafe(
        "INSERT OR IGNORE INTO Conversation (id, userId, characterId, status, createdAt) VALUES (?,?,?,?,?)",
        convId, creatorId, id, "active", now
      );
      await this.prisma.$executeRawUnsafe(
        "INSERT OR IGNORE INTO Message (id, conversationId, role, content, createdAt) VALUES (?,?,?,?,?)",
        "msg-" + id, convId, "character", (body.tagline || "你好") + " ——" + (body.name || ""), now
      );
      return { id, name: body.name, success: true };
    } catch (e: any) {
      return { error: e.message };
    }
  }

  async update(id: string, body: any) {
    try {
      const sets: string[] = [];
      const vals: any[] = [];
      const simple = ["name", "title", "world", "imageUrl"];
      for (const f of simple) {
        if (body[f] !== undefined) { sets.push(`${f} = ?`); vals.push(body[f]); }
      }
      if (body.profile !== undefined) {
        sets.push("profile = ?");
        vals.push(JSON.stringify(body.profile));
      } else {
        const profileFields = ["tagline", "intro", "traits", "stages", "quickActions", "memories", "story"];
        const hasProfile = profileFields.some(f => body[f] !== undefined);
        if (hasProfile) {
          const row: any = await this.prisma.$queryRawUnsafe<any[]>(
            "SELECT profile FROM Character WHERE id = ?", id
          ).then(r => r?.[0]);
          const existing = row?.profile ? JSON.parse(row.profile) : {};
          for (const f of profileFields) {
            if (body[f] !== undefined) existing[f] = body[f];
          }
          sets.push("profile = ?");
          vals.push(JSON.stringify(existing));
        }
      }
      if (sets.length === 0) return { error: "No fields to update" };
      vals.push(id);
      await this.prisma.$executeRawUnsafe(
        `UPDATE Character SET ${sets.join(", ")} WHERE id = ?`, ...vals
      );
      return { success: true };
    } catch (e: any) {
      return { error: e.message };
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.$executeRawUnsafe("DELETE FROM Message WHERE conversationId IN (SELECT id FROM Conversation WHERE characterId = ?)", id);
      await this.prisma.$executeRawUnsafe("DELETE FROM Conversation WHERE characterId = ?", id);
      await this.prisma.$executeRawUnsafe("DELETE FROM RelationshipState WHERE characterId = ?", id);
      await this.prisma.$executeRawUnsafe("DELETE FROM Character WHERE id = ?", id);
      return { success: true };
    } catch (e: any) {
      return { error: e.message };
    }
  }

  private hydrate(row: any) {
    let profile: any = {};
    try { profile = row.profile ? JSON.parse(row.profile) : {}; } catch { /* */ }
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
}
