#!/bin/bash

# Test CORS Headers

BACKEND_URL="https://backend-digital-invitation.nahsbyte.my.id"
FRONTEND_ORIGIN="https://digital-invitation.nahsbyte.my.id"

echo "🧪 Testing CORS Headers"
echo "======================"
echo "Backend: $BACKEND_URL"
echo "Frontend Origin: $FRONTEND_ORIGIN"
echo ""

# Test 1: OPTIONS Preflight
echo "1. OPTIONS Preflight Request:"
echo "   curl -X OPTIONS $BACKEND_URL/api/admin/login \\"
echo "     -H 'Origin: $FRONTEND_ORIGIN' \\"
echo "     -H 'Access-Control-Request-Method: POST' \\"
echo "     -v"
echo ""

RESPONSE=$(curl -s -X OPTIONS \
    -H "Origin: $FRONTEND_ORIGIN" \
    -H "Access-Control-Request-Method: POST" \
    -H "Access-Control-Request-Headers: Content-Type" \
    -w "\nHTTP_CODE:%{http_code}" \
    "$BACKEND_URL/api/admin/login")

HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)

echo "   Status: $HTTP_CODE"
echo ""

# Get CORS headers
echo "   CORS Headers:"
curl -s -X OPTIONS -I \
    -H "Origin: $FRONTEND_ORIGIN" \
    -H "Access-Control-Request-Method: POST" \
    "$BACKEND_URL/api/admin/login" | grep -i "access-control" | sed 's/^/      /'

echo ""

# Test 2: POST Request with Origin
echo "2. POST Request with Origin:"
echo "   curl -X POST $BACKEND_URL/api/admin/login \\"
echo "     -H 'Origin: $FRONTEND_ORIGIN' \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"email\":\"admin@krakatau.com\",\"password\":\"admin123\"}' \\"
echo "     -v"
echo ""

RESPONSE=$(curl -s -X POST \
    -H "Origin: $FRONTEND_ORIGIN" \
    -H "Content-Type: application/json" \
    -w "\nHTTP_CODE:%{http_code}" \
    -d '{"email":"admin@krakatau.com","password":"admin123"}' \
    "$BACKEND_URL/api/admin/login")

HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_CODE/d')

echo "   Status: $HTTP_CODE"
echo "   Response: $BODY" | head -c 200
echo ""

# Get CORS headers from POST response
echo "   CORS Headers in Response:"
curl -s -X POST -I \
    -H "Origin: $FRONTEND_ORIGIN" \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@krakatau.com","password":"admin123"}' \
    "$BACKEND_URL/api/admin/login" | grep -i "access-control" | sed 's/^/      /'

echo ""
echo "============================"
echo ""

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ CORS is working correctly!"
    echo "   - OPTIONS preflight returns 200"
    echo "   - POST request returns 200"
    echo "   - CORS headers are present"
else
    echo "❌ CORS issue detected!"
    echo "   Status: $HTTP_CODE"
    echo ""
    echo "Check:"
    echo "  1. CORS_ORIGIN in docker-compose.yml includes frontend domain"
    echo "  2. Backend restarted after CORS changes"
    echo "  3. No reverse proxy blocking CORS headers"
fi

