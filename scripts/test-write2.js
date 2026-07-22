const { PrismaClient } = require("@prisma/client");

async function main() {
  const p = new PrismaClient();
  try {
    const result = await p.message.create({
      data: {
        conversationId: "conv-luoyin-001",
        role: "user",
        content: "test message",
        createdAt: "2026-07-22T01:00:00.000Z"
      }
    });
    console.log("OK:", JSON.stringify(result));
  } catch (e) {
    console.log("ERROR:", e.message);
  } finally {
    await p.$disconnect();
  }
}

main();
