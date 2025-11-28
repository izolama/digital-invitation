#!/bin/bash

# Migration Script: Convert ID to UUID
# This script migrates existing database from SERIAL ID to UUID

DB_HOST=${DB_HOST:-"localhost"}
DB_PORT=${DB_PORT:-"5432"}
DB_USER=${DB_USER:-"postgres"}
DB_PASSWORD=${DB_PASSWORD:-"ShaninHanan23"}
DB_NAME="digital_invitation"

echo "🔄 Migrating Database to UUID"
echo "=============================="
echo ""

# Check if migration script exists
MIGRATION_FILE="$(dirname "$0")/migrate-to-uuid.sql"

if [ ! -f "$MIGRATION_FILE" ]; then
    echo "❌ Migration file not found: $MIGRATION_FILE"
    exit 1
fi

echo "⚠️  WARNING: This will modify your database structure!"
echo "   - Existing ID values will be lost"
echo "   - New UUIDs will be generated for all records"
echo ""
read -p "Continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Migration cancelled."
    exit 0
fi

echo ""
echo "Starting migration..."

# Run migration
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "$MIGRATION_FILE"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅✅✅ Migration completed successfully! ✅✅✅"
    echo ""
    echo "All registration IDs are now UUIDs."
    echo ""
    echo "Verify:"
    echo "  PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c \"SELECT id, full_name FROM registrations LIMIT 3;\""
else
    echo ""
    echo "❌ Migration failed!"
    exit 1
fi

