#!/bin/bash

# Check Backend Status Script

echo "🔍 Checking Backend Status"
echo "========================="
echo ""

# 1. Check if container is running
echo "1. Container Status:"
docker ps | grep digital-invitation-backend || echo "❌ Backend container not running"
echo ""

# 2. Check backend logs
echo "2. Recent Backend Logs (last 20 lines):"
docker logs digital-invitation-backend --tail 20 2>&1
echo ""

# 3. Test backend health
echo "3. Health Check:"
curl -s http://localhost:5001/health || echo "❌ Cannot connect to backend"
echo ""

# 4. Test from external
echo "4. External Health Check:"
curl -s https://backend-digital-invitation.nahsbyte.my.id/health || echo "❌ Cannot connect externally"
echo ""

# 5. Check port
echo "5. Port Status:"
netstat -tlnp | grep 5001 || echo "❌ Port 5001 not listening"
echo ""

# 6. Check network
echo "6. Network Status:"
docker network inspect shared-network 2>/dev/null | grep -A 5 "digital-invitation-backend" || echo "❌ Container not in network"
echo ""

echo "✅ Check complete!"

