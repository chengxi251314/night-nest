FROM node:22-slim
WORKDIR /app
COPY . .
RUN npm install --omit=dev --ignore-scripts
ENV DATABASE_URL="file:./apps/api/prisma/dev.db"
ENV PORT=3000
CMD ["node", "apps/api/dist/apps/api/src/main.js"]
