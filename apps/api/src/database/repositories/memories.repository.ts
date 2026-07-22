import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { seedMemories } from "../../../prisma/seed/seed-data";

@Injectable()
export class MemoriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserAndCharacter(userId: string, characterId: string) {
    try {
      return await this.prisma.memoryEntry.findMany({ where: { userId, characterId }, orderBy: { createdAt: "desc" } });
    } catch {
      return seedMemories.filter((item) => item.userId === userId && item.characterId === characterId);
    }
  }
}
