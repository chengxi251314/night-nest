const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient({ datasources: { db: { url: "file:F:/自媒体/night-nest/apps/api/prisma/dev.db" } } });
p.character.findMany().then(r => {
  console.log("Characters:", r.length);
  r.forEach(c => console.log(`  ${c.id} | ${c.name} | ${c.title}`));
  p.$disconnect();
}).catch(e => { console.error(e); p.$disconnect(); });
