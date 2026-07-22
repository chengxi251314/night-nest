import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { seedConversations, seedMessages } from "../../../prisma/seed/seed-data";

const REPLIES: Record<string, string[]> = {
  luoyin: [
    "...你倒是比我想的有耐心。",
    "别用那种眼神看我。我不吃这套。",
    "既然你还没走，那今晚可以再多聊两句。",
    "你的手在抖。紧张什么？",
    "你是不是以为我对谁都这样？"
  ],
  shenye: [
    "你今天的声音比昨天稳了一点。",
    "先把外套穿上。这里空调开得很低。",
    "你不需要在我面前硬撑。",
    "我注意到你刚才停顿了一下。想说什么？",
    "好。我等你说。不急。"
  ],
  qinhuai: [
    "你的出现频率已经超过了我设定的噪声阈值。",
    "我正在分析你的对话模式。很有趣。",
    "你打断了我的实验。……没关系。",
    "我今晚可以空出 37 分钟。",
    "你刚才那句话，我记下来了。"
  ]
};

function pickReply(characterId: string): string {
  const pool = REPLIES[characterId] || ["嗯。"];
  return pool[Math.floor(Math.random() * pool.length)];
}

function cuid(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

@Injectable()
export class ConversationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserAndCharacter(userId: string, characterId: string) {
    try {
      return await this.prisma.conversation.findFirst({ where: { userId, characterId } });
    } catch {
      return seedConversations.find((item) => item.userId === userId && item.characterId === characterId) ?? null;
    }
  }

  async findMessages(conversationId: string) {
    try {
      return await this.prisma.message.findMany({ where: { conversationId }, orderBy: { createdAt: "asc" } });
    } catch {
      return seedMessages.filter((item) => item.conversationId === conversationId);
    }
  }

  async createReply(conversationId: string, characterId: string) {
    const id = cuid();
    const content = pickReply(characterId);
    const now = new Date().toISOString();
    try {
      await this.prisma.$executeRawUnsafe(
        `INSERT INTO Message (id, conversationId, role, content, createdAt) VALUES (?, ?, ?, ?, ?)`,
        id, conversationId, "character", content, now
      );
      return { id, conversationId, role: "character", content, createdAt: now };
    } catch {
      return { id, conversationId, role: "character", content, createdAt: now };
    }
  }

  async createMessage(conversationId: string, role: string, content: string) {
    const id = cuid();
    const now = new Date().toISOString();
    try {
      await this.prisma.$executeRawUnsafe(
        `INSERT INTO Message (id, conversationId, role, content, createdAt) VALUES (?, ?, ?, ?, ?)`,
        id, conversationId, role, content, now
      );
      return { id, conversationId, role, content, createdAt: now };
    } catch {
      return { id, conversationId, role, content, createdAt: now };
    }
  }

  async createConversation(userId: string, characterId: string) {
    const id = `conv-${characterId}-${Date.now()}`;
    const now = new Date().toISOString();
    try {
      await this.prisma.$executeRawUnsafe(
        `INSERT INTO Conversation (id, userId, characterId, status, createdAt) VALUES (?, ?, ?, 'active', ?)`,
        id, userId, characterId, now
      );
      return { id, userId, characterId, status: "active", createdAt: now };
    } catch {
      return { id, userId, characterId, status: "active", createdAt: now };
    }
  }
}
