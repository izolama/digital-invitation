#!/bin/bash

# Check Backend Status After Password Update

echo "🔍 Checking Backend Status"
echo "========================="
echo ""

# 1. Check container
echo "1. Container Status:"
docker ps | grep digital-invitation-backend || echo "❌ Container not running"
echo ""

# 2. Check recent logs
echo "2. Recent Logs (last 30 lines):"
docker logs digital-invitation-backend --tail 30 2>&1
echo ""

# 3. Check for errors
echo "3. Error Logs:"
docker logs digital-invitation-backend 2>&1 | grep -i "error\|exception\|crash\|fatal" | tail -10
echo ""

# 4. Test health
echo "4. Health Check:"
curl -s http://localhost:5001/health || echo "❌ Cannot connect"
echo ""

# 5. Check if port is listening
echo "5. Port Status:"
netstat -tlnp | grep 5001 || echo "❌ Port 5001 not listening"
echo ""

echo "✅ Check complete!"

