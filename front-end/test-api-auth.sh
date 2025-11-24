#!/bin/bash

# Test script for API authentication
echo "🧪 Testing API Authentication..."

API_URL="${NEXT_PUBLIC_API_GATEWAY_URL:-https://io3jsoifpi.execute-api.eu-central-1.amazonaws.com/default}"
USER_POOL_ID="${NEXT_PUBLIC_COGNITO_USER_POOL_ID:-eu-central-1_dBuqwAOur}"
CLIENT_ID="${NEXT_PUBLIC_COGNITO_CLIENT_ID:-53mjrf78hmn67fe0sf1lfjti8n}"

echo "🔗 API URL: $API_URL"
echo "👤 User Pool ID: $USER_POOL_ID"
echo "🔑 Client ID: $CLIENT_ID"

# Test 1: Call API without token (should get 401)
echo ""
echo "📡 Test 1: Calling API without authentication token..."
response=$(curl -s -w "\n%{http_code}" "$API_URL/notes/get" -H "Content-Type: application/json")
status_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n -1)

echo "Status: $status_code"
echo "Response: $body"

if [ "$status_code" = "401" ]; then
    echo "✅ Correct - got 401 Unauthorized as expected"
else
    echo "❌ Unexpected status code - should be 401"
fi

echo ""
echo "🔍 To test with authentication:"
echo "1. Log in through the frontend"
echo "2. Check browser console for the Bearer token"
echo "3. Test manually: curl -H \"Authorization: Bearer YOUR_TOKEN\" \"$API_URL/notes/get\""

echo ""
echo "🧪 Testing CORS..."
curl -s -X OPTIONS "$API_URL/notes/get" \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: authorization,content-type" \
  -v
