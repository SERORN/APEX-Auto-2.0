#!/bin/bash

# Production Deployment Script for Apex Platform
# Usage: ./deploy.sh [environment]

set -e

ENVIRONMENT=${1:-production}
DOMAIN="apex.com.mx"

echo "🚀 Starting Apex Platform deployment for $ENVIRONMENT..."

# Verify prerequisites
echo "📋 Checking prerequisites..."

if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed"
    exit 1
fi

if [ ! -f ".env.prod" ]; then
    echo "❌ .env.prod file not found. Copy .env.example and configure it."
    exit 1
fi

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p backups
mkdir -p uploads
mkdir -p monitoring
mkdir -p certificates

# Build production images
echo "🔨 Building production images..."

# Backend
echo "Building backend image..."
cd backend-python
docker build -t apex/backend:latest -f Dockerfile.prod .
cd ..

# Frontend
echo "Building frontend image..."
cd frontend-web
docker build -t apex/frontend:latest -f Dockerfile.prod .
cd ..

# Landing page
echo "Building landing page image..."
cd landing-page
docker build -t apex/landing:latest -f Dockerfile.prod .
cd ..

# Setup monitoring configuration
echo "📊 Setting up monitoring..."
cat > monitoring/prometheus.yml << EOF
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'apex-backend'
    static_configs:
      - targets: ['backend:8000']
    metrics_path: '/metrics'

  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres:5432']

  - job_name: 'redis'
    static_configs:
      - targets: ['redis:6379']
EOF

# Create Traefik network if it doesn't exist
echo "🌐 Setting up Traefik network..."
docker network create traefik || true

# Pull external images
echo "📥 Pulling external images..."
docker-compose -f docker-compose.prod.yml pull

# Start services
echo "🚀 Starting services..."
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to start..."
sleep 30

# Run database migrations
echo "🗄️ Running database migrations..."
docker-compose -f docker-compose.prod.yml exec backend alembic upgrade head

# Create initial admin user
echo "👤 Creating initial admin user..."
docker-compose -f docker-compose.prod.yml exec backend python -c "
from app.core.database import get_db
from app.models.user import User
from app.core.security import get_password_hash
from sqlalchemy.orm import Session
import asyncio

async def create_admin():
    db = next(get_db())
    admin = db.query(User).filter(User.email == 'admin@apex.com.mx').first()
    if not admin:
        admin = User(
            email='admin@apex.com.mx',
            username='admin',
            first_name='Admin',
            last_name='User',
            hashed_password=get_password_hash('admin123'),
            is_active=True,
            is_admin=True
        )
        db.add(admin)
        db.commit()
        print('Admin user created successfully')
    else:
        print('Admin user already exists')

asyncio.run(create_admin())
"

# Verify deployment
echo "✅ Verifying deployment..."

# Check if services are running
services=("traefik" "postgres" "redis" "backend" "frontend" "landing")
for service in "${services[@]}"; do
    if docker-compose -f docker-compose.prod.yml ps $service | grep -q "Up"; then
        echo "✅ $service is running"
    else
        echo "❌ $service failed to start"
        exit 1
    fi
done

# Test API health
echo "🔍 Testing API health..."
sleep 10
if curl -f http://localhost/api/v1/health > /dev/null 2>&1; then
    echo "✅ API is responding"
else
    echo "⚠️ API health check failed, but deployment may still be successful"
fi

echo ""
echo "🎉 Deployment completed successfully!"
echo ""
echo "📋 Access URLs:"
echo "   🌐 Main site: https://$DOMAIN"
echo "   📱 App: https://app.$DOMAIN"
echo "   🔧 API: https://api.$DOMAIN"
echo "   📊 Grafana: https://grafana.$DOMAIN"
echo "   🔍 Traefik: https://traefik.$DOMAIN"
echo ""
echo "👤 Default admin credentials:"
echo "   Email: admin@apex.com.mx"
echo "   Password: admin123"
echo "   ⚠️ CHANGE THIS PASSWORD IMMEDIATELY!"
echo ""
echo "📝 Next steps:"
echo "   1. Configure DNS records for your domains"
echo "   2. Change default admin password"
echo "   3. Configure external services (Stripe, email, etc.)"
echo "   4. Set up monitoring alerts"
echo "   5. Configure backup schedules"
echo ""
