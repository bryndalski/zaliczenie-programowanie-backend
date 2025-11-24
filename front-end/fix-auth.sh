#!/bin/bash

echo "🔧 AUTH AUTHORIZATION FIX SCRIPT"
echo "==============================="

# Step 1: Verify environment
echo ""
echo "📋 Step 1: Checking environment variables..."
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local not found! Creating it..."
    cat > .env.local << 'EOF'
# AWS Cognito Configuration
NEXT_PUBLIC_COGNITO_USER_POOL_ID=eu-central-1_dBuqwAOur
NEXT_PUBLIC_COGNITO_CLIENT_ID=53mjrf78hmn67fe0sf1lfjti8n
NEXT_PUBLIC_COGNITO_REGION=eu-central-1

# API Gateway Configuration
NEXT_PUBLIC_API_GATEWAY_URL=https://io3jsoifpi.execute-api.eu-central-1.amazonaws.com/default
EOF
    echo "✅ Created .env.local"
else
    echo "✅ .env.local exists"
fi

source .env.local

# Step 2: Test API without auth
echo ""
echo "🧪 Step 2: Testing API without authentication (should return 401)..."
response=$(curl -s -w "\n%{http_code}" "$NEXT_PUBLIC_API_GATEWAY_URL/notes/get" -H "Content-Type: application/json" 2>/dev/null)
status_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n -1)

echo "Status Code: $status_code"
echo "Response Body: $body"

if [ "$status_code" = "401" ]; then
    echo "✅ API correctly returns 401 Unauthorized"
elif [ "$status_code" = "403" ]; then
    echo "✅ API correctly returns 403 Forbidden"
else
    echo "❌ Unexpected status code: $status_code"
    echo "Expected: 401 or 403"
fi

# Step 3: Test CORS
echo ""
echo "🌐 Step 3: Testing CORS configuration..."
curl -s -X OPTIONS "$NEXT_PUBLIC_API_GATEWAY_URL/notes/get" \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: authorization,content-type" \
  -w "\nHTTP Status: %{http_code}\n" 2>/dev/null

# Step 4: Clean Next.js cache
echo ""
echo "🧹 Step 4: Cleaning Next.js cache..."
rm -rf .next
echo "✅ Cache cleared"

# Step 5: Test with a real token (placeholder)
echo ""
echo "🔑 Step 5: Authentication token test"
echo "To test with real authentication:"
echo "1. Start the app: npm run dev"
echo "2. Register/Login at http://localhost:3000"
echo "3. Open browser console and look for token logs"
echo "4. Use AuthDebugger widget in bottom-right corner"

echo ""
echo "🎯 TROUBLESHOOTING CHECKLIST:"
echo "□ Environment variables are set"
echo "□ API returns 401/403 without auth"
echo "□ CORS is configured"
echo "□ Next.js cache is cleared"
echo "□ Frontend builds successfully"
echo ""
echo "🚀 Ready to test! Run: npm run dev"
echo "📚 Full guide: AUTH_TROUBLESHOOTING.md"
