import { Controller, Get, Post, Put, Delete, Param, Body, Req, Res } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import * as fs from "fs";
import * as path from "path";

const uploadDir = path.resolve(__dirname, "../../../../../../apps/web/public/scripts");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

@Controller("v1/scripts")
export class ScriptController {
  constructor(private readonly prisma: PrismaService) {}

  // --- LIST ---
  @Get()
  async list() {
    try {
      const scripts = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(
        `SELECT id, title, description, characterName, world, tags, creatorId, participantCount, status, createdAt, imageUrl FROM Script WHERE status != 'deleted' ORDER BY createdAt DESC`
      );
      return { items: scripts };
    } catch { return { items: [] }; }
  }

  // --- DETAIL ---
  @Get(":id")
  async detail(@Param("id") id: string) {
    try {
      const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`SELECT * FROM Script WHERE id = ?`, id);
      if (!rows || rows.length === 0) return { error: "Not found" };

      const participants = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(
        `SELECT sp.userId, sp.joinedAt, u.email FROM ScriptParticipant sp JOIN User u ON sp.userId = u.id WHERE sp.scriptId = ?`, id);

      const messages = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(
        `SELECT id, userId, role, content, createdAt FROM ScriptMessage WHERE scriptId = ? ORDER BY createdAt ASC LIMIT 50`, id);

      return { script: rows[0], participants, messages };
    } catch { return { error: "Failed" }; }
  }

  // --- CREATE ---
  @Post()
  async create(@Body() body: any) {
    const id = `script-${Date.now()}`;
    const now = new Date().toISOString();
    try {
      await this.prisma.$executeRawUnsafe(
        `INSERT INTO Script (id, title, description, characterName, characterPrompt, world, tags, creatorId, status, participantCount, createdAt, imageUrl) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
        id, body.title || "", body.description || "", body.characterName || "", body.characterPrompt || "",
        body.world || "", body.tags || "", body.creatorId || "demo-user", "published", 1, now, body.imageUrl || "");
      await this.prisma.$executeRawUnsafe(
        `INSERT INTO ScriptParticipant (id, scriptId, userId, joinedAt) VALUES (?,?,?,?)`,
        `sp-${id}`, id, body.creatorId || "demo-user", now);
      return { id, title: body.title };
    } catch (e: any) { return { error: "Failed: " + e.message }; }
  }

  // --- UPDATE ---
  @Put(":id")
  async update(@Param("id") id: string, @Body() body: any) {
    try {
      const sets: string[] = [];
      const vals: any[] = [];
      const fields = ["title", "description", "characterName", "characterPrompt", "world", "tags", "imageUrl"];
      for (const f of fields) {
        if (body[f] !== undefined) { sets.push(`${f} = ?`); vals.push(body[f]); }
      }
      if (sets.length === 0) return { error: "No fields to update" };
      vals.push(id);
      await this.prisma.$executeRawUnsafe(`UPDATE Script SET ${sets.join(", ")} WHERE id = ?`, ...vals);
      return { success: true };
    } catch (e: any) { return { error: e.message }; }
  }

  // --- DELETE (soft) ---
  @Delete(":id")
  async remove(@Param("id") id: string) {
    try {
      await this.prisma.$executeRawUnsafe(`UPDATE Script SET status = 'deleted' WHERE id = ?`, id);
      return { success: true };
    } catch { return { error: "Delete failed" }; }
  }

  // --- UPLOAD IMAGE ---
  @Post("upload")
  async uploadImage(@Req() req: any, @Res() res: any) {
    try {
      const multer = require("multer");
      multer({ dest: uploadDir, limits: { fileSize: 10 * 1024 * 1024 } }).single("file")(req, res, (err: any) => {
        if (err) return res.json({ error: err.message });
        const file = req.file;
        if (!file) return res.json({ error: "No file" });
        const ext = path.extname(file.originalname) || ".png";
        const newName = `script-${Date.now()}${ext}`;
        fs.renameSync(file.path, path.join(uploadDir, newName));
        return res.json({ imageUrl: `/scripts/${newName}` });
      });
    } catch (e: any) { return res.json({ error: e.message }); }
  }

  // --- JOIN ---
  @Post(":id/join")
  async join(@Param("id") id: string, @Body() body: { userId: string }) {
    const now = new Date().toISOString();
    const uid = body.userId || "demo-user";
    try {
      await this.prisma.$executeRawUnsafe(`INSERT OR IGNORE INTO ScriptParticipant (id, scriptId, userId, joinedAt) VALUES (?,?,?,?)`, `sp-${id}-${uid}`, id, uid, now);
      await this.prisma.$executeRawUnsafe(`UPDATE Script SET participantCount = (SELECT COUNT(*) FROM ScriptParticipant WHERE scriptId = ?) WHERE id = ?`, id, id);
      return { success: true };
    } catch { return { error: "Join failed" }; }
  }

  // --- MESSAGES ---
  @Post(":id/messages")
  async postMessage(@Param("id") id: string, @Body() body: { userId: string; content: string }) {
    const now = new Date().toISOString();
    const uid = body.userId || "demo-user";
    try {
      await this.prisma.$executeRawUnsafe(`INSERT INTO ScriptMessage (id, scriptId, userId, role, content, createdAt) VALUES (?,?,?,?,?,?)`, `sm-${Date.now()}`, id, uid, "user", body.content, now);
      let reply = "...";
      try {
        const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`SELECT characterName FROM Script WHERE id = ?`, id);
        const charName = rows[0]?.characterName || ""; const charPrompt = rows[0]?.characterPrompt || "";
        const aiRes = await fetch(`http://localhost:8000/v1/orchestrate`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ character_id: charName, user_message: body.content, relationship_stage: "script", relationship_score: 0, memories: [], conversation_history: [], custom_prompt: charPrompt })
        });
        if (aiRes.ok) { const d = await aiRes.json(); reply = d.reply || reply; }
      } catch { /* */ }
      await this.prisma.$executeRawUnsafe(`INSERT INTO ScriptMessage (id, scriptId, userId, role, content, createdAt) VALUES (?,?,?,?,?,?)`, `sm-${Date.now()}-r`, id, "system", "character", reply, new Date().toISOString());
      return { reply: { role: "character", text: reply } };
    } catch { return { reply: { role: "character", text: "..." } }; }
  }
}
