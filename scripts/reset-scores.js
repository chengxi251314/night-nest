const { PrismaClient } = require("@prisma/client");
(async () => {
  const p = new PrismaClient();
  await p.$executeRawUnsafe("UPDATE RelationshipState SET score=0,stage='试探期',mood='克制' WHERE characterId='luoyin'");
  await p.$executeRawUnsafe("UPDATE RelationshipState SET score=0,stage='熟悉期',mood='从容' WHERE characterId='shenye'");
  await p.$executeRawUnsafe("UPDATE RelationshipState SET score=0,stage='观察期',mood='冷静' WHERE characterId='qinhuai'");
  await p.$executeRawUnsafe("UPDATE RelationshipState SET score=0,stage='接诊期',mood='观察' WHERE characterId='fuyanzhi'");
  console.log("All scores reset to 0");
  await p.$disconnect();
})();
