import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { seedRelationships } from "../../../prisma/seed/seed-data";

const STAGES: Record<string, { max: number; label: string; mood: string }[]> = {
  luoyin: [
    { max: 29, label: "试探期", mood: "克制" },
    { max: 59, label: "松动期", mood: "好奇" },
    { max: 84, label: "偏爱期", mood: "依赖" },
    { max: 100, label: "沉沦期", mood: "占有" }
  ],
  shenye: [
    { max: 29, label: "熟悉期", mood: "从容" },
    { max: 59, label: "照看期", mood: "温柔" },
    { max: 84, label: "独占期", mood: "认真" },
    { max: 100, label: "绑定期", mood: "深情" }
  ],
  qinhuai: [
    { max: 29, label: "观察期", mood: "冷静" },
    { max: 59, label: "接纳期", mood: "专注" },
    { max: 84, label: "动心期", mood: "温柔" },
    { max: 100, label: "偏执期", mood: "占有" }
  ]
};

function resolveStage(characterId: string, score: number): { stage: string; mood: string } {
  const stages = STAGES[characterId] || [{ max: 100, label: "试探期", mood: "平静" }];
  for (const s of stages) {
    if (score <= s.max) return { stage: s.label, mood: s.mood };
  }
  return { stage: stages[stages.length - 1].label, mood: stages[stages.length - 1].mood };
}

@Injectable()
export class RelationshipsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserAndCharacter(userId: string, characterId: string) {
    try {
      return await this.prisma.relationshipState.findUnique({
        where: { userId_characterId: { userId, characterId } }
      });
    } catch {
      return seedRelationships.find((item) => item.userId === userId && item.characterId === characterId) ?? null;
    }
  }

  async updateScore(userId: string, characterId: string, delta: number) {
    const current = await this.findByUserAndCharacter(userId, characterId);
    if (!current) return null;
    const newScore = Math.min(100, Math.max(0, current.score + delta));
    const { stage, mood } = resolveStage(characterId, newScore);
    const now = new Date().toISOString();
    try {
      await this.prisma.$executeRawUnsafe(
        `UPDATE RelationshipState SET score = ?, stage = ?, mood = ?, updatedAt = ? WHERE userId = ? AND characterId = ?`,
        newScore, stage, mood, now, userId, characterId
      );
      return { ...current, score: newScore, stage, mood, updatedAt: now };
    } catch {
      return { ...current, score: newScore, stage, mood };
    }
  }
}
