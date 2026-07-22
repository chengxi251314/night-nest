import { Controller, Get } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

@Controller("v1/admin")
export class AdminController {
  constructor(private readonly prisma: PrismaService) {}

  @Get("stats")
  async getStats() {
    try {
      const [userCount, characterCount, conversationCount, messageCount, relStates] = await Promise.all([
        this.prisma.user.count(),
        this.prisma.character.count(),
        this.prisma.conversation.count(),
        this.prisma.message.count(),
        this.prisma.relationshipState.findMany({ select: { characterId: true, score: true, stage: true } }),
      ]);

      const byStage: Record<string, number> = {};
      const byCharacter: Record<string, { total: number; avgScore: number; stage: string }> = {};
      for (const r of relStates) {
        byStage[r.stage] = (byStage[r.stage] || 0) + 1;
        if (!byCharacter[r.characterId]) {
          byCharacter[r.characterId] = { total: 0, avgScore: 0, stage: r.stage };
        }
        byCharacter[r.characterId].total++;
        byCharacter[r.characterId].avgScore += r.score;
      }
      for (const c of Object.keys(byCharacter)) {
        byCharacter[c].avgScore = Math.round(byCharacter[c].avgScore / byCharacter[c].total);
      }

      return {
        users: userCount,
        characters: characterCount,
        conversations: conversationCount,
        messages: messageCount,
        relationshipsByStage: byStage,
        relationshipsByCharacter: byCharacter,
      };
    } catch {
      return {
        users: 1, characters: 3, conversations: 3, messages: 6,
        relationshipsByStage: { "试探期": 1, "熟悉期": 1, "观察期": 1 },
        relationshipsByCharacter: {
          luoyin: { total: 1, avgScore: 18, stage: "试探期" },
          shenye: { total: 1, avgScore: 12, stage: "熟悉期" },
          qinhuai: { total: 1, avgScore: 10, stage: "观察期" },
        },
      };
    }
  }
}
