#!/bin/bash

echo "🧪 Test API Authorization"
echo "========================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo -e "${RED}❌ .env.local not found${NC}"
    exit 1
fi

# Source environment variables
source .env.local

if [ -z "$NEXT_PUBLIC_API_GATEWAY_URL" ]; then
    echo -e "${RED}❌ NEXT_PUBLIC_API_GATEWAY_URL not set in .env.local${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} API Gateway URL: $NEXT_PUBLIC_API_GATEWAY_URL"
echo ""

echo "📋 Manual Test Steps:"
echo "===================="
echo ""
echo "1. Open your browser DevTools Console (F12)"
echo "2. Navigate to your app and login"
echo "3. Paste this code in console:"
echo ""
echo -e "${YELLOW}import { fetchAuthSession } from 'aws-amplify/auth';"
echo "const session = await fetchAuthSession();"
echo "const idToken = session.tokens?.idToken?.toString();"
echo "console.log('ID Token:', idToken);"
echo ""
echo "// Test API call"
echo "const response = await fetch('${NEXT_PUBLIC_API_GATEWAY_URL}/notes/get', {"
echo "  headers: {"
echo "    'Authorization': \`Bearer \${idToken}\`,"
echo "    'Content-Type': 'application/json'"
echo "  }"
echo "});"
echo "console.log('Status:', response.status);"
echo "const data = await response.json();"
echo "console.log('Data:', data);${NC}"
echo ""
echo "Expected results:"
echo "  ✓ Status: 200"
echo "  ✓ Data: { notes: [...], count: N }"
echo ""
echo "If you get 401 Unauthorized:"
echo "  1. Make sure you're using ID Token (not Access Token)"
echo "  2. Check if token is expired (login again)"
echo "  3. Verify Cognito User Pool ID matches in Terraform"
echo ""

