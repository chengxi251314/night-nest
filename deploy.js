// Railway production entry point
const { spawn } = require("child_process");
const path = require("path");

const ROOT = __dirname;

// Start Next.js (port 3000)
console.log("[deploy] Starting Web...");
const web = spawn("node", [path.join(ROOT, "node_modules", "next", "dist", "bin", "next"), "start", "-p", "3000"], {
  cwd: path.join(ROOT, "apps", "web"), stdio: "inherit",
  env: { ...process.env, NEXT_PUBLIC_API_BASE_URL: process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : "" }
});

// Start API (PORT from Railway)
console.log("[deploy] Starting API...");
const api = spawn("node", [path.join(ROOT, "apps", "api", "dist", "apps", "api", "src", "main.js")], {
  cwd: path.join(ROOT, "apps", "api"), stdio: "inherit",
  env: { ...process.env, DATABASE_URL: "file:./prisma/dev.db", NEXT_PUBLIC_API_BASE_URL: process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : "" }
});

process.on("SIGTERM", () => { web.kill(); api.kill(); process.exit(0); });
process.on("SIGINT", () => { web.kill(); api.kill(); process.exit(0); });
