const { PrismaClient } = require("@prisma/client");
(async () => {
  const p = new PrismaClient();
  await p.$executeRawUnsafe("UPDATE RelationshipState SET score=58 WHERE characterId='shenye'");
  console.log("shenye set to 58");
  await p.$disconnect();
})();
