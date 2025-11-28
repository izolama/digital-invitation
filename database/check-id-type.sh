#!/bin/bash

# Check if registrations table uses UUID or SERIAL for ID

DB_HOST=${DB_HOST:-"localhost"}
DB_PORT=${DB_PORT:-"5432"}
DB_USER=${DB_USER:-"postgres"}
DB_PASSWORD=${DB_PASSWORD:-"ShaninHanan23"}
DB_NAME="digital_invitation"

echo "🔍 Checking ID Type in Registrations Table"
echo "=========================================="
echo ""

PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "
SELECT 
    column_name,
    data_type,
    column_default
FROM information_schema.columns
WHERE table_name = 'registrations' 
  AND column_name = 'id';
"

echo ""
echo "📊 Sample Registration IDs:"
echo ""

PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "
SELECT 
    id,
    pg_typeof(id) as id_type,
    full_name,
    created_at
FROM registrations
ORDER BY created_at DESC
LIMIT 3;
"

echo ""
echo "✅ Check complete!"

