# start.ps1
# Starts the 2 main services for the RefundGuard project

Write-Host "Starting FastAPI Backend (port 8000)..."
Start-Process -NoNewWindow -FilePath "backend\.venv\Scripts\uvicorn.exe" -ArgumentList "app.main:app","--reload","--port","8000" -WorkingDirectory "backend"

Write-Host "Starting Vite React Frontend (port 5173)..."
Start-Process -NoNewWindow -FilePath "npm.cmd" -ArgumentList "run","dev" -WorkingDirectory "frontend"

Write-Host "All services starting in the background!"
Write-Host "Wait a few seconds, then open http://localhost:5173"
