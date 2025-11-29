#!/bin/bash

# Script to rebuild frontend after code changes

echo "🔨 Rebuilding Frontend"
echo "======================"
echo ""

# Check if running in Docker
if [ -f /.dockerenv ] || [ -n "$DOCKER_CONTAINER" ]; then
    echo "⚠️  Running inside Docker container"
    echo "Please run this script from the host machine"
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose not found"
    exit 1
fi

echo "1. Stopping frontend container..."
docker-compose stop frontend

echo ""
echo "2. Rebuilding frontend image (no cache)..."
docker-compose build --no-cache frontend

echo ""
echo "3. Starting frontend container..."
docker-compose up -d frontend

echo ""
echo "4. Checking container status..."
docker-compose ps frontend

echo ""
echo "✅ Frontend rebuild complete!"
echo ""
echo "📝 Note: It may take a few seconds for the container to be ready"
echo "Check logs with: docker-compose logs -f frontend"

