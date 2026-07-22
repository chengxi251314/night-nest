const { PrismaClient } = require("@prisma/client");

async function main() {
  const p = new PrismaClient();
  try {
    const chars = await p.character.findMany();
    console.log("Characters:", JSON.stringify(chars, null, 2));

    const msgs = await p.message.findMany({
      where: { conversationId: "conv-luoyin-001" },
      orderBy: { createdAt: "asc" }
    });
    console.log("Messages:", JSON.stringify(msgs, null, 2));

    const rel = await p.relationshipState.findUnique({
      where: { userId_characterId: { userId: "demo-user", characterId: "luoyin" } }
    });
    console.log("Relationship:", JSON.stringify(rel, null, 2));

    console.log("\nPrisma Client OK - all queries work!");
  } catch (e) {
    console.error("ERROR:", e.message);
  } finally {
    await p.$disconnect();
  }
}

main();
