#!/bin/bash

echo "🚀 Starting Notes App Frontend with Debug Mode..."

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local file not found!"
    echo "Creating .env.local with required variables..."
    cat > .env.local << EOF
# AWS Cognito Configuration
NEXT_PUBLIC_COGNITO_USER_POOL_ID=eu-central-1_dBuqwAOur
NEXT_PUBLIC_COGNITO_CLIENT_ID=53mjrf78hmn67fe0sf1lfjti8n
NEXT_PUBLIC_COGNITO_REGION=eu-central-1

# API Gateway Configuration
NEXT_PUBLIC_API_GATEWAY_URL=https://io3jsoifpi.execute-api.eu-central-1.amazonaws.com/default
EOF
    echo "✅ Created .env.local file"
fi

# Kill any existing Next.js processes
echo "🧹 Cleaning up existing processes..."
pkill -f "next dev" 2>/dev/null || true
pkill -f "node.*next" 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Remove Next.js cache
echo "🗑️  Clearing Next.js cache..."
rm -rf .next

# Wait a moment
sleep 2

echo ""
echo "🔧 Environment Check:"
source .env.local
echo "  User Pool ID: $NEXT_PUBLIC_COGNITO_USER_POOL_ID"
echo "  Client ID: $NEXT_PUBLIC_COGNITO_CLIENT_ID"
echo "  Region: $NEXT_PUBLIC_COGNITO_REGION"
echo "  API URL: $NEXT_PUBLIC_API_GATEWAY_URL"

echo ""
echo "🎯 Starting development server..."
echo "  Frontend will be available at: http://localhost:3000"
echo "  Check browser console for detailed authentication logs"
echo "  Look for AuthDebugger widget in the bottom-right corner"
echo ""

# Start development server
npm run dev
