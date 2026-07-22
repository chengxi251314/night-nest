const { PrismaClient } = require("@prisma/client");
(async () => {
  const p = new PrismaClient();
  const updates = [
    ["luoyin", "/characters/luoyin.png"],
    ["shenye", "/characters/shenye.png"],
    ["qinhuai", "/characters/qinhuai.png"],
  ];
  for (const [name, url] of updates) {
    await p.$executeRawUnsafe("UPDATE Script SET imageUrl=? WHERE characterName=?", url, name);
    console.log("Updated", name, url);
  }
  await p.$disconnect();
  console.log("Done");
})();
