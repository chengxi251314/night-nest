import { Controller, Get, Post, Put, Delete, Param, Body, Req, Res } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import * as fs from "fs";
import * as path from "path";

const uploadDir = path.resolve(__dirname, "..", "..", "..", "..", "..", "..", "..", "..", "apps", "web", "public", "scripts");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

@Controller("v1/scripts")
export class ScriptController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async list() {
    try {
      const scripts = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(
        "SELECT id, title, description, characterName, world, tags, creatorId, participantCount, status, createdAt, imageUrl FROM Script WHERE status != 'deleted' ORDER BY createdAt DESC"
      );
      return { items: scripts };
    } catch { return { items: [] }; }
  }

  @Get(":id")
  async detail(@Param("id") id: string) {
    try {
      const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`SELECT * FROM Script WHERE id = ?`, id);
      if (!rows || rows.length === 0) return { error: "Not found" };
      const participants = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(
        "SELECT sp.userId, sp.joinedAt FROM ScriptParticipant sp WHERE sp.scriptId = ?", id);
      const messages = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(
        "SELECT id, userId, role, content, createdAt FROM ScriptMessage WHERE scriptId = ? ORDER BY createdAt ASC LIMIT 100", id);
      let characters: any[] = [];
      try {
        characters = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(
          "SELECT sc.id, sc.scriptId, sc.name, sc.prompt, sc.imageUrl, sc.characterId, sc.sortOrder, c.imageUrl as charAvatar, c.title as charTitle, c.name as charName FROM ScriptCharacter sc LEFT JOIN Character c ON sc.characterId = c.id WHERE sc.scriptId = ? ORDER BY sc.sortOrder ASC", id
        );
      } catch { characters = []; }
      return { script: rows[0], participants, messages, characters };
    } catch { return { error: "Failed" }; }
  }

  @Post()
  async create(@Body() body: any) {
    const id = "script-" + Date.now();
    const now = new Date().toISOString();
    try {
      await this.prisma.$executeRawUnsafe(
        "INSERT INTO Script (id, title, description, characterName, characterPrompt, world, tags, creatorId, status, participantCount, createdAt, imageUrl) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
        id, body.title || "", body.description || "", body.characterName || "", body.characterPrompt || "",
        body.world || "", body.tags || "", body.creatorId || "demo-user", "published", 1, now, body.imageUrl || "");
      await this.prisma.$executeRawUnsafe(
        "INSERT INTO ScriptParticipant (id, scriptId, userId, joinedAt) VALUES (?,?,?,?)",
        "sp-" + id, id, body.creatorId || "demo-user", now);

      const characters = body.characters || [];
      if (characters.length > 0) {
        for (let i = 0; i < characters.length; i++) {
          const c = characters[i];
          const sql = "INSERT INTO ScriptCharacter (id, scriptId, name, prompt, imageUrl, characterId, sortOrder, createdAt) VALUES (?,?,?,?,?,?,?,?)";
          await this.prisma.$executeRawUnsafe(sql,
            "sc-" + id + "-" + i, id, c.name || ("角色" + (i + 1)), c.prompt || "", c.imageUrl || "", c.characterId || "", i, now
          );
        }
      }
      return { id, title: body.title };
    } catch (e: any) { return { error: "Failed: " + e.message }; }
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() body: any) {
    try {
      const sets: string[] = [];
      const vals: any[] = [];
      const fields = ["title", "description", "characterName", "characterPrompt", "world", "tags", "imageUrl"];
      for (const f of fields) {
        if (body[f] !== undefined) { sets.push(f + " = ?"); vals.push(body[f]); }
      }
      if (sets.length > 0) {
        vals.push(id);
        await this.prisma.$executeRawUnsafe("UPDATE Script SET " + sets.join(", ") + " WHERE id = ?", ...vals);
      }
      if (body.characters && Array.isArray(body.characters)) {
        const now2 = new Date().toISOString();
        await this.prisma.$executeRawUnsafe("DELETE FROM ScriptCharacter WHERE scriptId = ?", id);
        for (let i = 0; i < body.characters.length; i++) {
          const c = body.characters[i];
          const sql2 = "INSERT INTO ScriptCharacter (id, scriptId, name, prompt, imageUrl, characterId, sortOrder, createdAt) VALUES (?,?,?,?,?,?,?,?)";
          await this.prisma.$executeRawUnsafe(sql2,
            "sc-" + id + "-" + i, id, c.name || ("角色" + (i + 1)), c.prompt || "", c.imageUrl || "", c.characterId || "", i, now2
          );
        }
      }
      return { success: true };
    } catch (e: any) { return { error: e.message }; }
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    try {
      await this.prisma.$executeRawUnsafe("UPDATE Script SET status = 'deleted' WHERE id = ?", id);
      return { success: true };
    } catch { return { error: "Delete failed" }; }
  }

  @Post("upload")
  async uploadImage(@Req() req: any, @Res() res: any) {
    try {
      const multer = require("multer");
      multer({ dest: uploadDir, limits: { fileSize: 10 * 1024 * 1024 } }).single("file")(req, res, (err: any) => {
        if (err) return res.json({ error: err.message });
        const file = req.file;
        if (!file) return res.json({ error: "No file" });
        const ext = path.extname(file.originalname) || ".png";
        const newName = "script-" + Date.now() + ext;
        fs.renameSync(file.path, path.join(uploadDir, newName));
        return res.json({ imageUrl: "/scripts/" + newName });
      });
    } catch (e: any) { return res.json({ error: e.message }); }
  }

  @Post(":id/join")
  async join(@Param("id") id: string, @Body() body: { userId: string }) {
    const now = new Date().toISOString();
    const uid = body.userId || "demo-user";
    try {
      await this.prisma.$executeRawUnsafe("INSERT OR IGNORE INTO User (id, email, createdAt) VALUES (?,?,?)", uid, uid + "@script.local", now);
      await this.prisma.$executeRawUnsafe("INSERT OR IGNORE INTO ScriptParticipant (id, scriptId, userId, joinedAt) VALUES (?,?,?,?)", "sp-" + id + "-" + uid, id, uid, now);
      await this.prisma.$executeRawUnsafe("UPDATE Script SET participantCount = (SELECT COUNT(*) FROM ScriptParticipant WHERE scriptId = ?) WHERE id = ?", id, id);
      return { success: true };
    } catch { return { error: "Join failed" }; }
  }

  @Post(":id/leave")
  async leave(@Param("id") id: string, @Body() body: { userId: string }) {
    const uid = body.userId || "demo-user";
    try {
      await this.prisma.$executeRawUnsafe("DELETE FROM ScriptParticipant WHERE scriptId = ? AND userId = ?", id, uid);
      await this.prisma.$executeRawUnsafe("UPDATE Script SET participantCount = (SELECT COUNT(*) FROM ScriptParticipant WHERE scriptId = ?) WHERE id = ?", id, id);
      return { success: true };
    } catch { return { error: "Leave failed" }; }
  }

  @Post(":id/favorite")
  async favorite(@Param("id") id: string, @Body() body: { userId: string }) {
    const uid = body.userId || "demo-user";
    const now = new Date().toISOString();
    try {
      await this.prisma.$executeRawUnsafe("INSERT OR IGNORE INTO ScriptFavorite (id, userId, scriptId, createdAt) VALUES (?,?,?,?)", "fav-" + id + "-" + uid, uid, id, now);
      await this.prisma.$executeRawUnsafe("UPDATE Script SET participantCount = (SELECT COUNT(*) FROM ScriptParticipant WHERE scriptId = ?) + (SELECT COUNT(*) FROM ScriptFavorite WHERE scriptId = ?) WHERE id = ?", id, id, id);
      return { success: true };
    } catch { return { error: "Failed" }; }
  }

  @Get(":id/favorites")
  async getFavorites(@Param("id") id: string) {
    try {
      const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>("SELECT userId FROM ScriptFavorite WHERE scriptId = ?", id);
      return { count: rows.length, users: rows.map(r => r.userId) };
    } catch { return { count: 0, users: [] }; }
  }

  @Post(":id/messages")
  async postMessage(@Param("id") id: string, @Body() body: { userId: string; content: string }) {
    const now = new Date().toISOString();
    const uid = body.userId || "demo-user";
    try {
      await this.prisma.$executeRawUnsafe("INSERT INTO ScriptMessage (id, scriptId, userId, role, content, createdAt) VALUES (?,?,?,?,?,?)", "sm-" + Date.now(), id, uid, "user", body.content, now);
      let reply = "...";
      try {
        const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`SELECT characterName FROM Script WHERE id = ?`, id);
        const charName = rows[0]?.characterName || ""; const charPrompt = rows[0]?.characterPrompt || "";
        const aiRes = await fetch("http://localhost:8000/v1/orchestrate", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ character_id: charName, user_message: body.content, relationship_stage: "script", relationship_score: 0, memories: [], conversation_history: [], custom_prompt: charPrompt })
        });
        if (aiRes.ok) { const d = await aiRes.json(); reply = d.reply || reply; }
      } catch { /* */ }
      await this.prisma.$executeRawUnsafe("INSERT INTO ScriptMessage (id, scriptId, userId, role, content, createdAt) VALUES (?,?,?,?,?,?)", "sm-" + Date.now() + "-r", id, "system", "character", reply, new Date().toISOString());
      return { reply: { role: "character", text: reply } };
    } catch { return { reply: { role: "character", text: "..." } }; }
  }

  @Post(":id/auto-dialogue")
  async autoDialogue(@Param("id") id: string, @Body() body: { rounds?: number }) {
    const rounds = body.rounds || 6;
    const now = new Date().toISOString();
    const results: any[] = [];
    try {
      const characters = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(
        "SELECT sc.id, sc.name, sc.prompt, sc.characterId, c.title, c.world FROM ScriptCharacter sc LEFT JOIN Character c ON sc.characterId = c.id WHERE sc.scriptId = ? ORDER BY sc.sortOrder ASC", id
      );
      if (characters.length < 2) {
        return { error: "需要至少两个角色才能进行自主对话", characters: characters.length };
      }
      const scriptRows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>("SELECT title, world FROM Script WHERE id = ?", id);
      const worldContext = scriptRows[0]?.world || "";
      const historyRows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>("SELECT role, content FROM ScriptMessage WHERE scriptId = ? ORDER BY createdAt DESC LIMIT 20", id);
      const history = historyRows.reverse().map((r: any) => r.role + ": " + r.content).join("\n");
      const [charA, charB] = [characters[0], characters[1]];

      for (let r = 0; r < rounds; r++) {
        const speaker = r % 2 === 0 ? charA : charB;
        const listener = r % 2 === 0 ? charB : charA;
        const dialogueSoFar = results.map(m => m.speaker + ": " + m.content).join("\n");
        const systemPrompt = "你是" + speaker.name + "。你的设定：" + speaker.prompt + "。世界观：" + worldContext + "。你正在和" + listener.name + "对话。" + listener.name + "的设定是：" + listener.prompt + "。请以" + speaker.name + "的身份，用自然的口吻对" + listener.name + "说一句话。保持角色性格，不要重复之前说过的话，推动对话发展。只输出你说的那句话，不要加前缀。";

        let reply = "...";
        try {
          const aiRes = await fetch("http://localhost:8000/v1/orchestrate", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              character_id: (speaker.characterId as string) || (speaker.name as string),
              user_message: systemPrompt,
              relationship_stage: "script",
              relationship_score: 0,
              memories: [],
              conversation_history: [],
              custom_prompt: (speaker.prompt as string) || ""
            })
          });
          if (aiRes.ok) { const d = await aiRes.json(); reply = d.reply || reply; }
        } catch { reply = "..."; }

        results.push({ speaker: speaker.name, content: reply, timestamp: now });
        await this.prisma.$executeRawUnsafe(
          "INSERT INTO ScriptMessage (id, scriptId, userId, role, content, createdAt) VALUES (?,?,?,?,?,?)",
          "sm-auto-" + Date.now() + "-" + r, id, "system", "character", speaker.name + "：" + reply, now
        );
      }
      return { success: true, messages: results };
    } catch (e: any) { return { error: e.message }; }
  }
}
        // Local fallback dialogue if AI is unreachable
        const fallbackLines: Record<string, string[]> = {
          luoyin: ["你胆子不小。","既然来了，就别着急走。","你说这些，是想让我在意吗？","……你还挺会挑话题的。","我不讨厌你问这个。","今晚留下来陪我。"],
          shenye: ["没关系。我在这里听着。","先坐下。我去给你倒杯喝的。","我注意到你在想这件事很久了。","把外套穿上。","我等你。","这里很安全。可以放松。"],
          qinhuai: ["这个问题的变量比我预期的多。","你的假设很有意思。","我在计算你问这个的概率。","你的出现频率已经超过了噪声阈值。","我为你调整了实验计划。"],
          fuyanzhi: ["请坐。不用紧张。这只是聊天。","你觉得呢？","我理解。","为什么会这样想？","然后呢？","我在听。"]
        };
