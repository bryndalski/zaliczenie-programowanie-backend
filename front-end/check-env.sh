#!/bin/bash

echo "🔍 Checking environment configuration..."
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local file not found!"
    echo "Run: ./generate-env.sh to create it"
    exit 1
fi

echo "✅ .env.local file exists"
echo ""
echo "Environment variables:"
echo "---"

# Source and display env vars
source .env.local 2>/dev/null || true

vars=(
    "NEXT_PUBLIC_COGNITO_USER_POOL_ID"
    "NEXT_PUBLIC_COGNITO_CLIENT_ID"
    "NEXT_PUBLIC_COGNITO_REGION"
    "NEXT_PUBLIC_API_GATEWAY_URL"
)

all_set=true
for var in "${vars[@]}"; do
    value="${!var}"
    if [ -z "$value" ]; then
        echo "❌ $var: NOT SET"
        all_set=false
    else
        # Mask the value for security
        masked="${value:0:4}...${value: -4}"
        echo "✅ $var: $masked"
    fi
done

echo ""
if [ "$all_set" = true ]; then
    echo "✅ All environment variables are configured correctly!"
    echo ""
    echo "You can now run: npm run dev"
else
    echo "❌ Some environment variables are missing!"
    echo "Run: ./generate-env.sh to regenerate .env.local"
fi

