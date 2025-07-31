@echo off
REM Production Deployment Script for Apex Platform (Windows)
REM Usage: deploy.bat [environment]

setlocal EnableDelayedExpansion

set ENVIRONMENT=%1
if "%ENVIRONMENT%"=="" set ENVIRONMENT=production

set DOMAIN=apex.com.mx

echo 🚀 Starting Apex Platform deployment for %ENVIRONMENT%...

REM Verify prerequisites
echo 📋 Checking prerequisites...

where docker >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Docker is not installed
    exit /b 1
)

where docker-compose >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Docker Compose is not installed
    exit /b 1
)

if not exist ".env.prod" (
    echo ❌ .env.prod file not found. Copy .env.example and configure it.
    exit /b 1
)

REM Create necessary directories
echo 📁 Creating directories...
if not exist "backups" mkdir backups
if not exist "uploads" mkdir uploads
if not exist "monitoring" mkdir monitoring
if not exist "certificates" mkdir certificates

REM Build production images
echo 🔨 Building production images...

REM Backend
echo Building backend image...
cd backend-python
docker build -t apex/backend:latest -f Dockerfile.prod .
cd ..

REM Frontend
echo Building frontend image...
cd frontend-web
docker build -t apex/frontend:latest -f Dockerfile.prod .
cd ..

REM Landing page
echo Building landing page image...
cd landing-page
docker build -t apex/landing:latest -f Dockerfile.prod .
cd ..

REM Setup monitoring configuration
echo 📊 Setting up monitoring...
(
echo global:
echo   scrape_interval: 15s
echo.
echo scrape_configs:
echo   - job_name: 'prometheus'
echo     static_configs:
echo       - targets: ['localhost:9090']
echo.
echo   - job_name: 'apex-backend'
echo     static_configs:
echo       - targets: ['backend:8000']
echo     metrics_path: '/metrics'
echo.
echo   - job_name: 'postgres'
echo     static_configs:
echo       - targets: ['postgres:5432']
echo.
echo   - job_name: 'redis'
echo     static_configs:
echo       - targets: ['redis:6379']
) > monitoring\prometheus.yml

REM Create Traefik network if it doesn't exist
echo 🌐 Setting up Traefik network...
docker network create traefik 2>nul

REM Pull external images
echo 📥 Pulling external images...
docker-compose -f docker-compose.prod.yml pull

REM Start services
echo 🚀 Starting services...
docker-compose -f docker-compose.prod.yml up -d

REM Wait for services to be healthy
echo ⏳ Waiting for services to start...
timeout /t 30 /nobreak >nul

REM Run database migrations
echo 🗄️ Running database migrations...
docker-compose -f docker-compose.prod.yml exec backend alembic upgrade head

REM Verify deployment
echo ✅ Verifying deployment...

REM Check if services are running
set services=traefik postgres redis backend frontend landing
for %%s in (%services%) do (
    docker-compose -f docker-compose.prod.yml ps %%s | findstr "Up" >nul
    if !ERRORLEVEL! EQU 0 (
        echo ✅ %%s is running
    ) else (
        echo ❌ %%s failed to start
        exit /b 1
    )
)

echo.
echo 🎉 Deployment completed successfully!
echo.
echo 📋 Access URLs:
echo    🌐 Main site: https://%DOMAIN%
echo    📱 App: https://app.%DOMAIN%
echo    🔧 API: https://api.%DOMAIN%
echo    📊 Grafana: https://grafana.%DOMAIN%
echo    🔍 Traefik: https://traefik.%DOMAIN%
echo.
echo 👤 Default admin credentials:
echo    Email: admin@apex.com.mx
echo    Password: admin123
echo    ⚠️ CHANGE THIS PASSWORD IMMEDIATELY!
echo.
echo 📝 Next steps:
echo    1. Configure DNS records for your domains
echo    2. Change default admin password
echo    3. Configure external services (Stripe, email, etc.)
echo    4. Set up monitoring alerts
echo    5. Configure backup schedules
echo.
