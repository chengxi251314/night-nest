FROM node:22-slim
WORKDIR /app

# Copy API dist files and Prisma
COPY apps/api/dist/ ./dist/
COPY apps/api/prisma/ ./prisma/
COPY packages/config/contracts/ ./packages/config/contracts/

# Minimal package.json - no workspaces
RUN echo '{"dependencies":{"@nestjs/common":"^11.0.0","@nestjs/core":"^11.0.0","@nestjs/platform-express":"^11.0.0","@prisma/client":"^6.0.0","reflect-metadata":"^0.2.2","rxjs":"^7.8.1"}}' > package.json

RUN npm install --omit=dev
ENV DATABASE_URL="file:./prisma/dev.db"
ENV PORT=3000
CMD ["node", "dist/apps/api/src/main.js"]
