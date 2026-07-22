import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { seedStoryNodes, seedStoryTriggers } from "../../../prisma/seed/seed-data";

@Injectable()
export class StoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findCurrentNode(characterId: string) {
    try {
      return await this.prisma.storyNode.findFirst({ where: { characterId }, orderBy: { chapterOrder: "asc" } });
    } catch {
      return seedStoryNodes.filter((item) => item.characterId === characterId).sort((left, right) => left.chapterOrder - right.chapterOrder)[0] ?? null;
    }
  }

  async findTriggers(characterId: string) {
    try {
      return await this.prisma.storyTrigger.findMany({ where: { characterId } });
    } catch {
      return seedStoryTriggers.filter((item) => item.characterId === characterId);
    }
  }
}
