#!/bin/bash

# Check Backend Error on POST Requests

echo "🔍 Checking Backend Error on POST"
echo "=================================="
echo ""

# 1. Check recent logs for errors
echo "1. Recent Error Logs:"
docker logs digital-invitation-backend --tail 50 2>&1 | grep -i "error\|exception\|crash\|failed\|502" | tail -20
echo ""

# 2. Check if backend is running
echo "2. Backend Container Status:"
docker ps | grep digital-invitation-backend
echo ""

# 3. Test from inside container (if possible)
echo "3. Testing from Inside Container:"
echo "   (This will fail if curl/node not available, but that's OK)"
docker exec digital-invitation-backend sh -c "
  if command -v node >/dev/null 2>&1; then
    node -e \"
      const http = require('http');
      const data = JSON.stringify({email:'admin@krakatau.com',password:'admin123'});
      const options = {
        hostname: 'localhost',
        port: 5001,
        path: '/api/admin/login',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length
        }
      };
      const req = http.request(options, (res) => {
        console.log('Status:', res.statusCode);
        res.on('data', (d) => process.stdout.write(d));
      });
      req.on('error', (e) => console.error('Error:', e.message));
      req.write(data);
      req.end();
    \"
  else
    echo 'Node.js not available in container'
  fi
" 2>&1
echo ""

# 4. Check database connection from backend
echo "4. Testing Database Connection from Backend:"
docker exec digital-invitation-backend sh -c "
  if [ -f /app/test-db-connection.js ]; then
    node /app/test-db-connection.js
  else
    echo 'test-db-connection.js not found'
  fi
" 2>&1
echo ""

# 5. Check environment variables
echo "5. Backend Environment:"
docker exec digital-invitation-backend env | grep -E "DB_|PORT|NODE_ENV|CORS" | head -10
echo ""

# 6. Check if port is listening
echo "6. Port Status:"
docker exec digital-invitation-backend sh -c "
  if command -v netstat >/dev/null 2>&1; then
    netstat -tlnp | grep 5001 || echo 'Port 5001 not found in netstat'
  elif command -v ss >/dev/null 2>&1; then
    ss -tlnp | grep 5001 || echo 'Port 5001 not found in ss'
  else
    echo 'netstat/ss not available'
  fi
" 2>&1
echo ""

echo "✅ Check complete!"
echo ""
echo "Most likely issues:"
echo "  1. Rate limiter error (check logs above)"
echo "  2. Database connection timeout"
echo "  3. Code error in route handler"
echo ""
echo "Next steps:"
echo "  1. Check full logs: docker logs digital-invitation-backend"
echo "  2. Rebuild backend: docker-compose build --no-cache backend"
echo "  3. Restart: docker-compose restart backend"

