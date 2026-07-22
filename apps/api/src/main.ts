import "reflect-metadata";

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { join } from "path";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Serve Next.js static build in production
  const staticDir = join(__dirname, "..", "..", "..", "web", "out");
  const fs = require("fs");
  if (fs.existsSync(staticDir)) {
    const express = require("express");
    const httpAdapter = app.getHttpAdapter();
    const instance = httpAdapter.getInstance();
    instance.use(express.static(staticDir));
    instance.get("*", (req: any, res: any) => {
      if (!req.path.startsWith("/v1") && !req.path.startsWith("/health")) {
        res.sendFile(join(staticDir, "index.html"));
      }
    });
    console.log("Serving static frontend from " + staticDir);
  }

  await app.listen(process.env.PORT ? parseInt(process.env.PORT) : 3100, "0.0.0.0");
}

bootstrap();
