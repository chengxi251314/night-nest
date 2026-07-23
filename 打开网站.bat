@echo off
echo Starting Night Nest...
start "NightNest-AI" cmd /c "cd /d F:\自媒体\night-nest\apps\ai && .venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000"
timeout /t 3 /nobreak >nul
start "NightNest-API" cmd /c "cd /d F:\自媒体\night-nest\apps\api && set DATABASE_URL=file:F:/自媒体/night-nest/apps/api/prisma/dev.db && node dist\apps\api\src\main.js"
timeout /t 3 /nobreak >nul
start "NightNest-Web" cmd /c "cd /d F:\自媒体\night-nest\apps\web && node ..\..\node_modules\next\dist\bin\next dev -p 3000 -H 0.0.0.0"
timeout /t 5 /nobreak >nul
echo All services started!
echo Web: http://localhost:3000
start http://localhost:3000
pause
