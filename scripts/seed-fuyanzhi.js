const { PrismaClient } = require("@prisma/client");
(async () => {
  const p = new PrismaClient();
  const now = new Date().toISOString();

  // Character
  await p.$executeRawUnsafe(
    "INSERT OR IGNORE INTO Character (id, name, title, world, createdAt) VALUES (?,?,?,?,?)",
    "fuyanzhi", "傅衍之", "斯文败类 · 精神操纵者", "三甲医院心理卫生中心", now
  );

  // Relationship
  await p.$executeRawUnsafe(
    "INSERT OR IGNORE INTO RelationshipState (id, userId, characterId, score, stage, mood, updatedAt) VALUES (?,?,?,?,?,?,?)",
    "rel-fuyanzhi", "demo-user", "fuyanzhi", 0, "接诊期", "观察", now
  );

  // Conversation
  await p.$executeRawUnsafe(
    "INSERT OR IGNORE INTO Conversation (id, userId, characterId, status, createdAt) VALUES (?,?,?,?,?)",
    "conv-fuyanzhi-001", "demo-user", "fuyanzhi", "active", now
  );

  // Opening messages
  await p.$executeRawUnsafe(
    "INSERT OR IGNORE INTO Message (id, conversationId, role, content, createdAt) VALUES (?,?,?,?,?)",
    "msg-fy-sys-001", "conv-fuyanzhi-001", "system", "角色已载入：傅衍之", now
  );
  await p.$executeRawUnsafe(
    "INSERT OR IGNORE INTO Message (id, conversationId, role, content, createdAt) VALUES (?,?,?,?,?)",
    "msg-fy-char-001", "conv-fuyanzhi-001", "character", "请坐。不用紧张。这只是聊天。", now
  );

  // Memories
  await p.$executeRawUnsafe(
    "INSERT OR IGNORE INTO MemoryEntry (id, userId, characterId, summary, weight, createdAt) VALUES (?,?,?,?,?,?)",
    "mem-fy-001", "demo-user", "fuyanzhi", "他说「我理解」的时候，眼神里有三秒钟的真东西。", 2, now
  );

  // Story
  await p.$executeRawUnsafe(
    "INSERT OR IGNORE INTO StoryNode (id, characterId, title, body, chapterOrder) VALUES (?,?,?,?,?)",
    "story-fy-001", "fuyanzhi", "第 01 章 · 初次诊疗", "第一次走进他的诊室。他递来一杯温水，说：不用紧张。这只是聊天。", 1
  );

  console.log("Fu Yanzhi added to database");
  await p.$disconnect();
})();
