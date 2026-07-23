const { PrismaClient } = require("@prisma/client");
(async () => {
  const p = new PrismaClient();
  await p.$executeRawUnsafe("UPDATE RelationshipState SET score=30,stage='松动期',mood='好奇' WHERE characterId='luoyin'");
  await p.$executeRawUnsafe("UPDATE RelationshipState SET score=60,stage='照看期',mood='温柔' WHERE characterId='shenye'");
  await p.$executeRawUnsafe("UPDATE RelationshipState SET score=92,stage='偏执期',mood='占有' WHERE characterId='qinhuai'");
  await p.$executeRawUnsafe("UPDATE RelationshipState SET score=92,stage='占有期',mood='温柔' WHERE characterId='fuyanzhi'");
  console.log("Scores: luoyin=30, shenye=60, qinhuai=92, fuyanzhi=92");
  await p.$disconnect();
})();
