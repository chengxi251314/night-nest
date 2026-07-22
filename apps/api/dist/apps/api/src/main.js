"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const path_1 = require("path");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    // Serve Next.js static build in production
    const staticDir = (0, path_1.join)(__dirname, "..", "..", "..", "web", "out");
    const fs = require("fs");
    if (fs.existsSync(staticDir)) {
        const express = require("express");
        const httpAdapter = app.getHttpAdapter();
        const instance = httpAdapter.getInstance();
        instance.use(express.static(staticDir));
        instance.get("*", (req, res) => {
            if (!req.path.startsWith("/v1") && !req.path.startsWith("/health")) {
                res.sendFile((0, path_1.join)(staticDir, "index.html"));
            }
        });
        console.log("Serving static frontend from " + staticDir);
    }
    await app.listen(process.env.PORT ? parseInt(process.env.PORT) : 3100, "0.0.0.0");
}
bootstrap();
