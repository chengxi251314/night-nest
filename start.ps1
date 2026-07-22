# Night Nest - Production Startup
# Starts all 3 services and keeps them alive

Write-Host "=== Night Nest ===" -ForegroundColor Cyan

$root = Split-Path -Parent $MyInvocation.MyCommand.Path

# Check DB
$db = "$root\apps\api\prisma\dev.db"
if (-not (Test-Path $db)) {
    Write-Host "Creating database..." -ForegroundColor Yellow
    python "$root\scripts\setup-db.py"
}

# Compile API
Write-Host "Building API..." -ForegroundColor Yellow
Push-Location "$root\apps\api"
node "$root\node_modules\typescript\bin\tsc" -p tsconfig.json 2>$null
Pop-Location

# Start AI service
Write-Host "Starting AI service (port 8000)..." -ForegroundColor Green
$env:PYTHONPATH = ""
Start-Process -WindowStyle Hidden -FilePath "$root\apps\ai\.venv\Scripts\python.exe" `
  -ArgumentList "-m","uvicorn","app.main:app","--host","0.0.0.0","--port","8000"

# Start API
Write-Host "Starting API (port 3100)..." -ForegroundColor Green
$env:DATABASE_URL = "file:$root/apps/api/prisma/dev.db"
Start-Process -WindowStyle Hidden -FilePath "node" `
  -ArgumentList "$root\apps\api\dist\apps\api\src\main.js"

# Start Web
Write-Host "Starting Web (port 3000)..." -ForegroundColor Green
Push-Location "$root\apps\web"
node "$root\node_modules\next\dist\bin\next" dev -p 3000 -H 0.0.0.0
Pop-Location
