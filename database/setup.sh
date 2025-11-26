#!/bin/bash

# Digital Invitation Database Setup Script
# This script sets up PostgreSQL database with Docker

set -e

echo "🚀 Digital Invitation Database Setup"
echo "===================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Error: Docker is not running${NC}"
    echo "Please start Docker and try again"
    exit 1
fi

echo -e "${GREEN}✓ Docker is running${NC}"

# Check if shared-network exists
if ! docker network inspect shared-network > /dev/null 2>&1; then
    echo -e "${YELLOW}Creating shared-network...${NC}"
    docker network create shared-network
    echo -e "${GREEN}✓ Network created${NC}"
else
    echo -e "${GREEN}✓ Network already exists${NC}"
fi

# Stop existing database containers (if any)
echo ""
echo "Checking for existing database containers..."
docker-compose -f docker-compose.db.yml down > /dev/null 2>&1 || true

# Start PostgreSQL
echo ""
echo "Starting PostgreSQL database..."
docker-compose -f docker-compose.db.yml up -d postgres

# Wait for PostgreSQL to be ready
echo ""
echo "Waiting for PostgreSQL to be ready..."
sleep 5

# Check if PostgreSQL is healthy
MAX_TRIES=30
TRIES=0
while [ $TRIES -lt $MAX_TRIES ]; do
    if docker exec digital-invitation-db pg_isready -U admin -d digital_invitation > /dev/null 2>&1; then
        echo -e "${GREEN}✓ PostgreSQL is ready!${NC}"
        break
    fi
    TRIES=$((TRIES+1))
    echo -n "."
    sleep 1
done

if [ $TRIES -eq $MAX_TRIES ]; then
    echo -e "${RED}❌ PostgreSQL failed to start${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✓ Database setup completed successfully!${NC}"
echo ""
echo "📊 Database Information:"
echo "  Host: localhost"
echo "  Port: 5432"
echo "  Database: digital_invitation"
echo "  User: admin"
echo "  Password: changeme_in_production"
echo ""
echo "🔐 Admin Credentials (for application):"
echo "  Email: admin@krakatau.com"
echo "  Password: admin123"
echo ""
echo "📝 Connection String:"
echo "  postgresql://admin:changeme_in_production@localhost:5432/digital_invitation"
echo ""

# Ask if user wants to start pgAdmin
echo -e "${YELLOW}Do you want to start pgAdmin for database management? (y/n)${NC}"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo ""
    echo "Starting pgAdmin..."
    docker-compose -f docker-compose.db.yml up -d pgadmin
    
    echo ""
    echo -e "${GREEN}✓ pgAdmin started successfully!${NC}"
    echo ""
    echo "🌐 pgAdmin Access:"
    echo "  URL: http://localhost:5050"
    echo "  Email: admin@krakatau.com"
    echo "  Password: admin123"
    echo ""
    echo "To connect to PostgreSQL in pgAdmin:"
    echo "  Host: postgres (or digital-invitation-db)"
    echo "  Port: 5432"
    echo "  Database: digital_invitation"
    echo "  Username: admin"
    echo "  Password: changeme_in_production"
fi

echo ""
echo "🎉 Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Update credentials in production"
echo "2. Setup backend API server"
echo "3. Configure environment variables"
echo ""
echo "Useful commands:"
echo "  docker-compose -f docker-compose.db.yml logs postgres   # View logs"
echo "  docker-compose -f docker-compose.db.yml down            # Stop database"
echo "  docker-compose -f docker-compose.db.yml up -d           # Start database"
echo ""

