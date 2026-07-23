const { PrismaClient } = require("@prisma/client");
(async () => {
  const p = new PrismaClient();
  await p.$executeRawUnsafe("UPDATE RelationshipState SET score=86 WHERE characterId='luoyin'");
  await p.$executeRawUnsafe("UPDATE RelationshipState SET score=86 WHERE characterId='shenye'");
  await p.$executeRawUnsafe("UPDATE RelationshipState SET score=86 WHERE characterId='qinhuai'");
  await p.$executeRawUnsafe("UPDATE RelationshipState SET score=86 WHERE characterId='fuyanzhi'");
  console.log("set to 86");
  await p.$disconnect();
})();
