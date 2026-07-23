const { PrismaClient } = require("@prisma/client");
(async () => {
  const p = new PrismaClient();
  await p.$executeRawUnsafe("UPDATE RelationshipState SET score=30,stage='松动期',mood='好奇' WHERE characterId='luoyin'");
  await p.$executeRawUnsafe("UPDATE RelationshipState SET score=30,stage='照看期',mood='温柔' WHERE characterId='shenye'");
  await p.$executeRawUnsafe("UPDATE RelationshipState SET score=30,stage='接纳期',mood='专注' WHERE characterId='qinhuai'");
  await p.$executeRawUnsafe("UPDATE RelationshipState SET score=30,stage='探入期',mood='专注' WHERE characterId='fuyanzhi'");
  console.log("All set to 30");
  await p.$disconnect();
})();
