# Night Nest local dev startup
# Requires: Node.js and Python available on PATH

$root = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "=== Night Nest Local Dev ===" -ForegroundColor Cyan

# 1. Setup database if needed
$dbPath = "$root\apps\api\prisma\dev.db"
if (-not (Test-Path $dbPath)) {
    Write-Host "Creating database..." -ForegroundColor Yellow
    python "$root\scripts\setup-db.py"
}

# 2. Compile API
Write-Host "Compiling API..." -ForegroundColor Yellow
Push-Location "$root\apps\api"
node "..\..\node_modules\typescript\bin\tsc" -p tsconfig.json
Pop-Location

Write-Host ""
Write-Host "Starting services..." -ForegroundColor Green
Write-Host "  API:  http://localhost:3100" -ForegroundColor Cyan
Write-Host "  Web:  http://localhost:3000" -ForegroundColor Cyan
Write-Host ""

# 3. Start API (background)
$env:DATABASE_URL = "file:$root/apps/api/prisma/dev.db"
$apiJob = Start-Job -ScriptBlock {
    param($root)
    Set-Location "$root\apps\api"
    & node "$root\apps\api\dist\apps\api\src\main.js"
} -ArgumentList $root

# 4. Start Web
Push-Location "$root\apps\web"
node "..\..\node_modules\next\dist\bin\next" dev -p 3000
Pop-Location

# Cleanup
Stop-Job $apiJob -ErrorAction SilentlyContinue
Remove-Job $apiJob -ErrorAction SilentlyContinue
