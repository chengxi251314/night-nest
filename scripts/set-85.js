const { PrismaClient } = require("@prisma/client");
(async () => {
  const p = new PrismaClient();
  await p.$executeRawUnsafe("UPDATE RelationshipState SET score=85,stage='偏爱期',mood='依赖' WHERE characterId='luoyin'");
  await p.$executeRawUnsafe("UPDATE RelationshipState SET score=85,stage='独占期',mood='认真' WHERE characterId='shenye'");
  await p.$executeRawUnsafe("UPDATE RelationshipState SET score=85,stage='动心期',mood='温柔' WHERE characterId='qinhuai'");
  await p.$executeRawUnsafe("UPDATE RelationshipState SET score=85,stage='占有期',mood='温柔' WHERE characterId='fuyanzhi'");
  console.log("All at 85");
  await p.$disconnect();
})();
