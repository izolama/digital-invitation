#!/bin/bash

# Test Backend Endpoints
# Tests all backend API endpoints

BACKEND_URL="https://backend-digital-invitation.nahsbyte.my.id"

echo "🧪 Testing Backend Endpoints"
echo "============================"
echo "Backend URL: $BACKEND_URL"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Test 1: Health Check
echo "1. Health Check:"
echo "   GET $BACKEND_URL/health"
RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" "$BACKEND_URL/health")
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_CODE/d')

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "   ${GREEN}✅ Status: $HTTP_CODE${NC}"
    echo "   Response: $BODY"
else
    echo -e "   ${RED}❌ Status: $HTTP_CODE${NC}"
    echo "   Response: $BODY"
fi
echo ""

# Test 2: OPTIONS Preflight (CORS)
echo "2. CORS Preflight (OPTIONS):"
echo "   OPTIONS $BACKEND_URL/api/admin/login"
RESPONSE=$(curl -s -X OPTIONS -w "\nHTTP_CODE:%{http_code}" \
    -H "Origin: https://digital-invitation.nahsbyte.my.id" \
    -H "Access-Control-Request-Method: POST" \
    -H "Access-Control-Request-Headers: Content-Type" \
    "$BACKEND_URL/api/admin/login")
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_CODE/d')

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "204" ]; then
    echo -e "   ${GREEN}✅ Status: $HTTP_CODE${NC}"
    
    # Check CORS headers
    CORS_HEADERS=$(curl -s -X OPTIONS -I \
        -H "Origin: https://digital-invitation.nahsbyte.my.id" \
        -H "Access-Control-Request-Method: POST" \
        "$BACKEND_URL/api/admin/login" | grep -i "access-control")
    
    if [ ! -z "$CORS_HEADERS" ]; then
        echo "   CORS Headers:"
        echo "$CORS_HEADERS" | sed 's/^/      /'
    else
        echo -e "   ${YELLOW}⚠️  No CORS headers found${NC}"
    fi
else
    echo -e "   ${RED}❌ Status: $HTTP_CODE${NC}"
    echo "   Response: $BODY"
fi
echo ""

# Test 3: Login Endpoint (POST)
echo "3. Login Endpoint (POST):"
echo "   POST $BACKEND_URL/api/admin/login"
RESPONSE=$(curl -s -X POST -w "\nHTTP_CODE:%{http_code}" \
    -H "Content-Type: application/json" \
    -H "Origin: https://digital-invitation.nahsbyte.my.id" \
    -d '{"email":"admin@krakatau.com","password":"admin123"}' \
    "$BACKEND_URL/api/admin/login")
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_CODE/d')

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "   ${GREEN}✅ Status: $HTTP_CODE${NC}"
    echo "   Response: $BODY" | head -c 200
    echo "..."
    
    # Check if token exists
    if echo "$BODY" | grep -q "token"; then
        echo -e "   ${GREEN}✅ Token received${NC}"
    fi
else
    echo -e "   ${RED}❌ Status: $HTTP_CODE${NC}"
    echo "   Response: $BODY"
fi
echo ""

# Test 4: Registration Endpoint (POST)
echo "4. Registration Endpoint (POST):"
echo "   POST $BACKEND_URL/api/registrations"
RESPONSE=$(curl -s -X POST -w "\nHTTP_CODE:%{http_code}" \
    -H "Content-Type: application/json" \
    -H "Origin: https://digital-invitation.nahsbyte.my.id" \
    -d '{
        "fullName": "Test User",
        "companyName": "PT Test",
        "whatsappNumber": "08123456789",
        "email": "test@example.com",
        "foodRestriction": "NON VEGAN",
        "allergies": "NO",
        "confirmationAttendance": "YES",
        "numberOfPeople": 1
    }' \
    "$BACKEND_URL/api/registrations")
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_CODE/d')

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "201" ]; then
    echo -e "   ${GREEN}✅ Status: $HTTP_CODE${NC}"
    echo "   Response: $BODY" | head -c 200
    echo "..."
else
    echo -e "   ${RED}❌ Status: $HTTP_CODE${NC}"
    echo "   Response: $BODY"
fi
echo ""

# Summary
echo "============================"
echo "Test Complete!"
echo ""
echo "If all tests pass, backend is working correctly."
echo "If any test fails, check backend logs:"
echo "  docker logs digital-invitation-backend"

