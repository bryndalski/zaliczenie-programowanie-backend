#!/bin/bash

echo "🔍 Environment Variables Check"
echo "==============================="

# Load environment variables
if [ -f ".env.local" ]; then
    source .env.local
    echo "✅ .env.local loaded"
else
    echo "❌ .env.local not found!"
    exit 1
fi

echo ""
echo "📋 Current Environment Variables:"
echo "NEXT_PUBLIC_COGNITO_USER_POOL_ID: ${NEXT_PUBLIC_COGNITO_USER_POOL_ID:-❌ NOT SET}"
echo "NEXT_PUBLIC_COGNITO_CLIENT_ID: ${NEXT_PUBLIC_COGNITO_CLIENT_ID:-❌ NOT SET}"
echo "NEXT_PUBLIC_COGNITO_REGION: ${NEXT_PUBLIC_COGNITO_REGION:-❌ NOT SET}"
echo "NEXT_PUBLIC_API_GATEWAY_URL: ${NEXT_PUBLIC_API_GATEWAY_URL:-❌ NOT SET}"

echo ""
echo "🔗 Testing API connectivity..."

# Test API connectivity
if command -v curl > /dev/null; then
    echo "Testing: $NEXT_PUBLIC_API_GATEWAY_URL/notes/get"

    # Test GET endpoint
    response=$(timeout 10 curl -s -w "%{http_code}" "$NEXT_PUBLIC_API_GATEWAY_URL/notes/get" -o /tmp/api_response.txt 2>/dev/null)

    if [ $? -eq 0 ]; then
        echo "✅ API is reachable"
        echo "📡 HTTP Status: $response"
        echo "📄 Response body:"
        cat /tmp/api_response.txt
        rm -f /tmp/api_response.txt

        if [ "$response" = "401" ] || [ "$response" = "403" ]; then
            echo "✅ API correctly requires authentication"
        else
            echo "⚠️  Unexpected status code (should be 401 or 403 without auth)"
        fi
    else
        echo "❌ Cannot reach API endpoint"
        echo "Check if the API Gateway URL is correct"
    fi
else
    echo "⚠️  curl not available, skipping API test"
fi

echo ""
echo "✅ Environment check complete!"
echo "If all variables are set and API is reachable, you can proceed with testing."
