#!/bin/bash

# Debug 502 Error on POST Requests

echo "🔍 Debugging 502 Error"
echo "======================"
echo ""

# 1. Check backend container
echo "1. Backend Container Status:"
docker ps | grep digital-invitation-backend
echo ""

# 2. Check recent logs
echo "2. Recent Backend Logs (last 30 lines):"
docker logs digital-invitation-backend --tail 30
echo ""

# 3. Check for errors
echo "3. Error Logs:"
docker logs digital-invitation-backend 2>&1 | grep -i "error\|exception\|crash\|failed" | tail -10
echo ""

# 4. Test database connection
echo "4. Database Connection Test:"
PGPASSWORD=ShaninHanan23 psql -h localhost -U postgres -d digital_invitation -c "SELECT 1;" 2>&1
echo ""

# 5. Test from inside container
echo "5. Test from Inside Container:"
docker exec digital-invitation-backend curl -s http://localhost:5001/health || echo "Cannot exec into container"
echo ""

# 6. Check environment variables
echo "6. Backend Environment Variables:"
docker exec digital-invitation-backend env | grep -E "DB_|PORT|NODE_ENV|CORS" || echo "Cannot check env"
echo ""

# 7. Check if routes are registered
echo "7. Testing Routes Directly:"
echo "   Testing /api/admin/login from localhost:"
docker exec digital-invitation-backend curl -s -X POST http://localhost:5001/api/admin/login \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@krakatau.com","password":"admin123"}' || echo "Failed"
echo ""

echo "✅ Debug complete!"
echo ""
echo "Common fixes:"
echo "  1. Check database connection"
echo "  2. Restart backend: docker-compose restart backend"
echo "  3. Rebuild backend: docker-compose build --no-cache backend"
echo "  4. Check backend logs for specific errors"

