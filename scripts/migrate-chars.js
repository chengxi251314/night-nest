const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient({ datasources: { db: { url: "file:F:/自媒体/night-nest/apps/api/prisma/dev.db" } } });

async function main() {
  const migrations = [
    "ALTER TABLE Character ADD COLUMN imageUrl TEXT DEFAULT ''",
    "ALTER TABLE Character ADD COLUMN profile TEXT DEFAULT '{}'",
    "ALTER TABLE Character ADD COLUMN creatorId TEXT DEFAULT 'system'",
  ];
  for (const sql of migrations) {
    try { await p.$executeRawUnsafe(sql); console.log("OK:", sql.substring(0, 50)); }
    catch (e) { console.log("Skip:", e.message.substring(0, 60)); }
  }
  p.$disconnect();
}
main();
