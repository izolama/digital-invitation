#!/bin/bash

# Test PostgreSQL Connection
# Quick script to verify database connection

DB_HOST=${DB_HOST:-"localhost"}
DB_PORT=${DB_PORT:-"5432"}
DB_USER=${DB_USER:-"postgres"}
DB_PASSWORD=${DB_PASSWORD:-"ShaninHanan23"}
DB_NAME="digital_invitation"

echo "Testing PostgreSQL connection..."
echo "Host: $DB_HOST:$DB_PORT"
echo "User: $DB_USER"
echo "Database: $DB_NAME"
echo ""

# Test connection
if PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c '\q' 2>/dev/null; then
    echo "✓ Connection successful!"
    echo ""
    
    # Check if digital_invitation database exists
    DB_EXISTS=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'")
    
    if [ "$DB_EXISTS" = "1" ]; then
        echo "✓ Database '$DB_NAME' exists"
        
        # Count tables
        TABLE_COUNT=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -tAc "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public';")
        echo "  Tables: $TABLE_COUNT"
        
        if [ "$TABLE_COUNT" -gt "0" ]; then
            # Show tables
            echo ""
            echo "Tables in database:"
            PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "\dt"
        fi
    else
        echo "⚠ Database '$DB_NAME' does not exist"
        echo "  Run: ./connect-existing.sh to setup"
    fi
else
    echo "✗ Connection failed!"
    echo ""
    echo "Troubleshooting:"
    echo "1. Check if PostgreSQL is running"
    echo "2. Verify credentials"
    echo "3. Check if port 5432 is accessible"
fi

