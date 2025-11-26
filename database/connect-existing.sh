#!/bin/bash

# Connect to Existing PostgreSQL Database
# This script sets up the schema on existing PostgreSQL instance

set -e

echo "🔌 Connecting to Existing PostgreSQL Database"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Database credentials
DB_HOST=${DB_HOST:-"localhost"}
DB_PORT=${DB_PORT:-"5432"}
DB_USER=${DB_USER:-"postgres"}
DB_PASSWORD=${DB_PASSWORD:-"ShaninHanan23"}
DB_NAME="digital_invitation"

echo "Database Configuration:"
echo "  Host: $DB_HOST"
echo "  Port: $DB_PORT"
echo "  User: $DB_USER"
echo "  Database: $DB_NAME"
echo ""

# Check if PostgreSQL is running
echo "Checking PostgreSQL connection..."
if PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c '\q' 2>/dev/null; then
    echo -e "${GREEN}✓ PostgreSQL is accessible${NC}"
else
    echo -e "${RED}❌ Cannot connect to PostgreSQL${NC}"
    echo ""
    echo "Troubleshooting:"
    echo "1. Check if PostgreSQL is running: docker ps | grep postgres"
    echo "2. Check credentials are correct"
    echo "3. Check port is accessible: telnet localhost 5432"
    echo ""
    
    # Try to find PostgreSQL container
    echo "Looking for PostgreSQL containers..."
    docker ps | grep postgres || echo "No PostgreSQL containers found"
    
    exit 1
fi

# Check if database exists, create if not
echo ""
echo "Checking if database exists..."
DB_EXISTS=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'")

if [ "$DB_EXISTS" = "1" ]; then
    echo -e "${YELLOW}Database '$DB_NAME' already exists${NC}"
    echo -e "${YELLOW}Do you want to drop and recreate it? (y/N)${NC}"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        echo "Dropping existing database..."
        PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "DROP DATABASE IF EXISTS $DB_NAME;"
        echo "Creating new database..."
        PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "CREATE DATABASE $DB_NAME;"
        echo -e "${GREEN}✓ Database recreated${NC}"
    else
        echo "Using existing database..."
    fi
else
    echo "Creating database..."
    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "CREATE DATABASE $DB_NAME;"
    echo -e "${GREEN}✓ Database created${NC}"
fi

# Import schema
echo ""
echo "Importing database schema..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f schema.sql

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Schema imported successfully${NC}"
else
    echo -e "${RED}❌ Failed to import schema${NC}"
    exit 1
fi

# Verify installation
echo ""
echo "Verifying installation..."
ADMIN_COUNT=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -tAc "SELECT COUNT(*) FROM admin_users;")
REG_COUNT=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -tAc "SELECT COUNT(*) FROM registrations;")

echo "  Admin users: $ADMIN_COUNT"
echo "  Sample registrations: $REG_COUNT"

echo ""
echo -e "${GREEN}✓ Setup completed successfully!${NC}"
echo ""
echo "📊 Database Information:"
echo "  Host: $DB_HOST"
echo "  Port: $DB_PORT"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"
echo "  Password: ****"
echo ""
echo "🔐 Application Admin Credentials:"
echo "  Email: admin@krakatau.com"
echo "  Password: admin123"
echo ""
echo "📝 Connection String:"
echo "  postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME"
echo ""
echo "🔍 Quick Test:"
echo "  PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME"
echo ""
echo "🎉 You can now configure your backend API with these credentials!"
echo ""

