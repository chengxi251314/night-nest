#!/bin/bash
set -e
echo "========================================="
echo "  Night Nest 阿里云部署脚本"
echo "========================================="

# 1. 安装基础依赖
echo "[1/6] 安装 Node.js 20 & Python3 & Nginx..."
curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
yum install -y nodejs python3 python3-pip nginx git 2>/dev/null || apt install -y nodejs python3 python3-pip nginx git

# 2. 安装 PM2 进程管理
echo "[2/6] 安装 PM2..."
npm install -g pm2

# 3. 克隆项目
echo "[3/6] 克隆项目..."
cd /opt
if [ -d "night-nest" ]; then
  cd night-nest && git pull
else
  git clone https://github.com/chengxi251314/night-nest.git
  cd night-nest
fi

# 4. 安装依赖
echo "[4/6] 安装 Node 依赖..."
cd apps/web
npm install
npx next build 2>&1 || echo "Frontend build skipped (will use dev mode)"
cd ../api
npm install
cd ../ai
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt 2>/dev/null || .venv/bin/pip install fastapi uvicorn openai pydantic

# 5. 配置 Nginx
echo "[5/6] 配置 Nginx..."
cat > /etc/nginx/conf.d/night-nest.conf << 'NGINX'
server {
    listen 80;
    server_name _;
    client_max_body_size 20M;

    location /avatars/ { alias /opt/night-nest/apps/web/public/avatars/; }
    location /characters/ { alias /opt/night-nest/apps/web/public/characters/; }
    location /scripts/ { alias /opt/night-nest/apps/web/public/scripts/; }
    location /backgrounds/ { alias /opt/night-nest/apps/web/public/backgrounds/; }
    location /v1/ { proxy_pass http://127.0.0.1:3100; proxy_set_header Host $host; }
    location /health { proxy_pass http://127.0.0.1:3100; }
    location / { proxy_pass http://127.0.0.1:3000; proxy_set_header Host $host; proxy_http_version 1.1; proxy_set_header Upgrade $http_upgrade; proxy_set_header Connection "upgrade"; }
}
NGINX
nginx -t && systemctl restart nginx || service nginx restart

# 6. 启动服务
echo "[6/6] 启动服务..."
cd /opt/night-nest

# API
pm2 delete night-api 2>/dev/null || true
pm2 start apps/api/dist/apps/api/src/main.js --name night-api --env DATABASE_URL="file:/opt/night-nest/apps/api/prisma/dev.db"

# AI
pm2 delete night-ai 2>/dev/null || true
pm2 start "cd apps/ai && .venv/bin/python -m uvicorn app.main:app --host 0.0.0.0 --port 8000" --name night-ai

# Web
pm2 delete night-web 2>/dev/null || true
pm2 start "cd apps/web && node ../../node_modules/next/dist/bin/next dev -p 3000 -H 0.0.0.0" --name night-web

pm2 save
pm2 startup

echo ""
echo "========================================="
echo "  部署完成!"
echo "  访问: http://47.99.189.13"
echo "========================================="
