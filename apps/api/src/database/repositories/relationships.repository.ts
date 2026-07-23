import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

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
  ],
  fuyanzhi: [
    { max: 29, label: "接诊期", mood: "冷静" },
    { max: 59, label: "探入期", mood: "观察" },
    { max: 84, label: "溃防期", mood: "深入" },
    { max: 100, label: "占有期", mood: "迷恋" }
  ]
};

function resolveStage(characterId: string, score: number): { stage: string; mood: string } {
  const stages = STAGES[characterId] || [{ max: 100, label: "初见", mood: "好奇" }];
  for (const s of stages) {
    if (score <= s.max) return { stage: s.label, mood: s.mood };
  }
  const last = stages[stages.length - 1];
  return { stage: last.label, mood: last.mood };
}

@Injectable()
export class RelationshipsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserAndCharacter(userId: string, characterId: string) {
    try {
      const rows = await this.prisma.$queryRawUnsafe<any[]>(
        "SELECT * FROM RelationshipState WHERE userId = ? AND characterId = ?",
        userId, characterId
      );
      return rows?.[0] || null;
    } catch {
      return null;
    }
  }

  async updateScore(userId: string, characterId: string, delta: number) {
    const current = await this.findByUserAndCharacter(userId, characterId);
    if (!current) return null;
    const newScore = Math.min(100, Math.max(0, (current.score || 0) + delta));
    const { stage, mood } = resolveStage(characterId, newScore);
    const now = new Date().toISOString();
    try {
      await this.prisma.$executeRawUnsafe(
        "UPDATE RelationshipState SET score = ?, stage = ?, mood = ?, updatedAt = ? WHERE userId = ? AND characterId = ?",
        newScore, stage, mood, now, userId, characterId
      );
      return { ...current, score: newScore, stage, mood, updatedAt: now };
    } catch {
      return { ...current, score: newScore, stage, mood };
    }
  }
}
