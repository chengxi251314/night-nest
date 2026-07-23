import { Controller, Get, Post, Param, Body } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

@Controller("v1/forum")
export class ForumController {
  constructor(private readonly prisma: PrismaService) {}

  @Get("topics")
  async listTopics() {
    try {
      const topics = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(
        "SELECT * FROM ForumTopic ORDER BY createdAt DESC"
      );
      return { items: topics };
    } catch { return { items: [] }; }
  }

  @Get("topics/:id")
  async getTopic(@Param("id") id: string) {
    try {
      const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(
        "SELECT * FROM ForumTopic WHERE id = ?", id
      );
      if (!rows || rows.length === 0) return { error: "Not found" };
      const replies = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(
        "SELECT * FROM ForumReply WHERE topicId = ? ORDER BY createdAt ASC", id
      );
      return { topic: rows[0], replies };
    } catch { return { error: "Failed" }; }
  }

  @Post("topics")
  async createTopic(@Body() body: { title: string; content: string; authorId: string; tag?: string }) {
    const id = "topic-" + Date.now();
    const now = new Date().toISOString();
    try {
      await this.prisma.$executeRawUnsafe(
        "INSERT INTO ForumTopic (id, title, content, authorId, tag, replyCount, likes, createdAt) VALUES (?,?,?,?,?,0,0,?)",
        id, body.title || "", body.content || "", body.authorId || "匿名", body.tag || "general", now
      );
      return { id, success: true };
    } catch (e: any) { return { error: e.message }; }
  }

  @Post("topics/:id/replies")
  async createReply(@Param("id") topicId: string, @Body() body: { authorId: string; content: string }) {
    const id = "reply-" + Date.now();
    const now = new Date().toISOString();
    try {
      await this.prisma.$executeRawUnsafe(
        "INSERT INTO ForumReply (id, topicId, authorId, content, likes, createdAt) VALUES (?,?,?,?,0,?)",
        id, topicId, body.authorId || "匿名", body.content || "", now
      );
      await this.prisma.$executeRawUnsafe("UPDATE ForumTopic SET replyCount = replyCount + 1 WHERE id = ?", topicId);
      // Create notification for topic author
      const topic = await this.prisma.$queryRawUnsafe<any[]>("SELECT authorId, title FROM ForumTopic WHERE id = ?", topicId);
      if (topic[0] && topic[0].authorId !== body.authorId) {
        const now = new Date().toISOString();
        await this.prisma.$executeRawUnsafe(
          "INSERT INTO Notification (id, userId, type, title, body, link, read, createdAt) VALUES (?,?,?,?,?,?,0,?)",
          "notif-" + Date.now(), topic[0].authorId, "reply",
          "有人回复了你的话题",
          (body.authorId || "匿名") + " 回复了：「" + (body.content || "").slice(0, 40) + "」",
          "/forum", now
        );
      }
      return { id, success: true };
    } catch (e: any) { return { error: e.message }; }
  }

  @Post("topics/:id/like")
  async likeTopic(@Param("id") id: string) {
    try {
      await this.prisma.$executeRawUnsafe("UPDATE ForumTopic SET likes = likes + 1 WHERE id = ?", id);
      return { success: true };
    } catch { return { error: "Failed" }; }
  }

  @Post("replies/:id/like")
  async likeReply(@Param("id") id: string) {
    try {
      await this.prisma.$executeRawUnsafe("UPDATE ForumReply SET likes = likes + 1 WHERE id = ?", id);
      return { success: true };
    } catch { return { error: "Failed" }; }
  }
}
