import { Controller, Get, Query } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

@Controller("v1/search")
export class SearchController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async search(@Query("q") q: string) {
    if (!q || q.trim().length < 1) return { scripts: [], topics: [], characters: [] };
    const term = "%" + q.trim() + "%";
    try {
      const [scripts, topics, characters] = await Promise.all([
        this.prisma.$queryRawUnsafe<any[]>(
          "SELECT id, title, description, characterName, tags, participantCount, imageUrl FROM Script WHERE status != 'deleted' AND (title LIKE ? OR description LIKE ? OR tags LIKE ? OR characterName LIKE ?) ORDER BY createdAt DESC LIMIT 8",
          term, term, term, term
        ),
        this.prisma.$queryRawUnsafe<any[]>(
          "SELECT id, title, content, authorId, tag, replyCount, createdAt FROM ForumTopic WHERE title LIKE ? OR content LIKE ? ORDER BY createdAt DESC LIMIT 8",
          term, term
        ),
        this.prisma.$queryRawUnsafe<any[]>(
          "SELECT id, name, title, world, imageUrl FROM Character WHERE name LIKE ? OR title LIKE ? OR world LIKE ? ORDER BY createdAt ASC LIMIT 8",
          term, term, term
        ),
      ]);
      return { scripts, topics, characters };
    } catch {
      return { scripts: [], topics: [], characters: [] };
    }
  }
}
