#!/bin/bash

# Fix 502 Error on POST Requests

echo "🔧 Fixing 502 Error on POST Requests"
echo "====================================="
echo ""

# 1. Check backend logs first
echo "1. Checking Backend Logs:"
docker logs digital-invitation-backend --tail 50 | grep -A 5 -B 5 -i "error\|exception\|database\|connection" || echo "No obvious errors in logs"
echo ""

# 2. Test database connection
echo "2. Testing Database Connection:"
PGPASSWORD=ShaninHanan23 psql -h localhost -U postgres -d digital_invitation -c "SELECT COUNT(*) FROM admin_users;" 2>&1
DB_STATUS=$?

if [ $DB_STATUS -ne 0 ]; then
    echo "❌ Database connection failed!"
    echo ""
    echo "Trying to fix database connection..."
    
    # Check if PostgreSQL is running
    echo "Checking PostgreSQL..."
    docker ps | grep postgres || systemctl status postgresql | head -5
    
    echo ""
    echo "If PostgreSQL is not running, start it first."
    exit 1
else
    echo "✅ Database connection OK"
fi
echo ""

# 3. Test from inside container
echo "3. Testing from Inside Container:"
echo "   Testing POST /api/admin/login:"
docker exec digital-invitation-backend curl -s -X POST http://localhost:5001/api/admin/login \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@krakatau.com","password":"admin123"}' 2>&1 | head -20

CONTAINER_TEST=$?
echo ""

if [ $CONTAINER_TEST -ne 0 ]; then
    echo "❌ Request from inside container failed"
    echo "   This suggests backend code issue"
else
    echo "✅ Request from inside container works"
    echo "   Issue might be with reverse proxy or external access"
fi
echo ""

# 4. Check backend environment
echo "4. Backend Environment:"
docker exec digital-invitation-backend env | grep -E "DB_HOST|DB_PORT|DB_USER|DB_NAME|NODE_ENV" | head -10
echo ""

# 5. Restart backend
echo "5. Restarting Backend:"
docker-compose restart backend
sleep 3

echo ""
echo "6. Testing After Restart:"
sleep 2
curl -s -X POST https://backend-digital-invitation.nahsbyte.my.id/api/admin/login \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@krakatau.com","password":"admin123"}' | head -5

echo ""
echo ""
echo "✅ Fix attempt complete!"
echo ""
echo "If still 502, check:"
echo "  1. Backend logs: docker logs digital-invitation-backend"
echo "  2. Database connection: ./database/test-connection.sh"
echo "  3. Rebuild backend: docker-compose build --no-cache backend"

