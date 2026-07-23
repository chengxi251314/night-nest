Write-Host "Starting Night Nest services..." -ForegroundColor Cyan

$root = "F:\自媒体\night-nest"

# Kill any existing processes on these ports
$ports = @(3000, 3100, 8000)
foreach ($port in $ports) {
    $conn = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($conn) {
        Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue
        Write-Host "Killed process on port $port"
    }
}
Start-Sleep 1

# Start AI
Write-Host "Starting AI service..." -ForegroundColor Yellow
$aiJob = Start-Job -Name "NightNest-AI" -ScriptBlock {
    Set-Location "F:\自媒体\night-nest\apps\ai"
    & ".venv\Scripts\python.exe" -m uvicorn app.main:app --host 0.0.0.0 --port 8000 2>&1 | Out-Null
}
Start-Sleep 2

# Start API
Write-Host "Starting API service..." -ForegroundColor Yellow
$apiJob = Start-Job -Name "NightNest-API" -ScriptBlock {
    $env:DATABASE_URL = "file:F:/自媒体/night-nest/apps/api/prisma/dev.db"
    Set-Location "F:\自媒体\night-nest\apps\api"
    node dist/apps/api/src/main.js 2>&1 | Out-Null
}
Start-Sleep 3

# Start Web
Write-Host "Starting Web service..." -ForegroundColor Yellow
$webJob = Start-Job -Name "NightNest-Web" -ScriptBlock {
    Set-Location "F:\自媒体\night-nest\apps\web"
    node ../../node_modules/next/dist/bin/next dev -p 3000 -H 0.0.0.0 2>&1 | Out-Null
}
Start-Sleep 5

# Verify
Write-Host ""
Write-Host "All services started!" -ForegroundColor Green
Write-Host "  Web:  http://localhost:3000" -ForegroundColor Cyan
Write-Host "  API:  http://localhost:3100" -ForegroundColor Cyan
Write-Host "  AI:   http://localhost:8000" -ForegroundColor Cyan
Write-Host ""
Write-Host "To stop: run Stop-NightNest.ps1" -ForegroundColor Gray

# Keep running
Write-Host "Press Ctrl+C to stop all services..." -ForegroundColor Yellow
try {
    while ($true) { Start-Sleep 10 }
} finally {
    Stop-Job -Name "NightNest-AI","NightNest-API","NightNest-Web" -ErrorAction SilentlyContinue
    Remove-Job -Name "NightNest-AI","NightNest-API","NightNest-Web" -Force -ErrorAction SilentlyContinue
}
