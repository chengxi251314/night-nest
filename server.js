// Railway entry point - runs NestJS API from pre-compiled dist
const path = require("path");
process.env.DATABASE_URL = "file:./apps/api/prisma/dev.db";
require(path.join(__dirname, "apps", "api", "dist", "apps", "api", "src", "main.js"));
