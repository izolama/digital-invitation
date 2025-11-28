#!/bin/bash

# Quick Test Login Endpoint

BACKEND_URL="https://backend-digital-invitation.nahsbyte.my.id"

echo "🔐 Testing Login Endpoint"
echo "========================"
echo "URL: $BACKEND_URL/api/admin/login"
echo ""

# Test with curl
echo "Request:"
echo "  Method: POST"
echo "  Email: admin@krakatau.com"
echo "  Password: admin123"
echo ""

RESPONSE=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -H "Origin: https://digital-invitation.nahsbyte.my.id" \
    -w "\nHTTP_CODE:%{http_code}" \
    -d '{"email":"admin@krakatau.com","password":"admin123"}' \
    "$BACKEND_URL/api/admin/login")

HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_CODE/d')

echo "Response:"
echo "  Status: $HTTP_CODE"
echo "  Body:"
echo "$BODY" | jq . 2>/dev/null || echo "$BODY"
echo ""

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Login successful!"
    
    # Extract token if exists
    TOKEN=$(echo "$BODY" | jq -r '.data.token' 2>/dev/null)
    if [ ! -z "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
        echo "✅ Token received: ${TOKEN:0:50}..."
    fi
else
    echo "❌ Login failed!"
    echo ""
    echo "Possible issues:"
    echo "  - Backend not running (502)"
    echo "  - Wrong credentials (401)"
    echo "  - CORS error (check CORS_ORIGIN)"
    echo ""
    echo "Check backend logs:"
    echo "  docker logs digital-invitation-backend"
fi

