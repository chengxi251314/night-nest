const { PrismaClient } = require("@prisma/client");

async function main() {
  const p = new PrismaClient();

  // Test 1: Using $executeRawUnsafe with parameters
  const content = "测试中文test";
  console.log("Original:", content, "len:", content.length);

  await p.$executeRawUnsafe(
    `INSERT INTO Message (id, conversationId, role, content, createdAt) VALUES (?, ?, ?, ?, ?)`,
    "test-msg-1", "conv-luoyin-001", "user", content, "2026-07-22T02:00:00.000Z"
  );

  // Test 2: Read it back
  const msg = await p.message.findUnique({ where: { id: "test-msg-1" } });
  console.log("Read back:", msg.content, "len:", msg.content.length);
  console.log("Hex:", Buffer.from(msg.content, "utf8").toString("hex"));

  await p.$disconnect();
}

main().catch(e => console.error(e));
