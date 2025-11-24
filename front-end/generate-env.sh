#!/bin/bash

echo "🔄 Generating .env.local from Terraform outputs..."

# Navigate to terraform directory
cd ../terraform

# Check if terraform directory exists
if [ ! -d "." ]; then
    echo "❌ Terraform directory not found!"
    exit 1
fi

# Get terraform outputs
echo "📡 Getting Terraform outputs..."
API_URL=$(terraform output -raw api_gateway_url 2>/dev/null)
CLIENT_ID=$(terraform output -raw cognito_client_id 2>/dev/null)
USER_POOL_ID=$(terraform output -raw cognito_user_pool_id 2>/dev/null)

# Extract region from user pool ID (format: region_poolid)
if [ ! -z "$USER_POOL_ID" ]; then
    REGION=$(echo "$USER_POOL_ID" | cut -d'_' -f1)
else
    REGION="eu-central-1"
fi

# Navigate back to frontend
cd ../front-end

# Create .env.local file
cat > .env.local << EOF
# AWS Cognito Configuration - Generated from Terraform
NEXT_PUBLIC_COGNITO_USER_POOL_ID=${USER_POOL_ID}
NEXT_PUBLIC_COGNITO_CLIENT_ID=${CLIENT_ID}
NEXT_PUBLIC_COGNITO_REGION=${REGION}

# API Gateway Configuration - Generated from Terraform
NEXT_PUBLIC_API_GATEWAY_URL=${API_URL}

# Generated on: $(date)
EOF

echo ""
echo "✅ Generated .env.local with the following values:"
echo "   User Pool ID: ${USER_POOL_ID:-❌ Not found}"
echo "   Client ID: ${CLIENT_ID:-❌ Not found}"
echo "   Region: ${REGION:-❌ Not found}"
echo "   API URL: ${API_URL:-❌ Not found}"

# Validate
if [ -z "$USER_POOL_ID" ] || [ -z "$CLIENT_ID" ] || [ -z "$API_URL" ]; then
    echo ""
    echo "⚠️  Some values are missing. This might indicate:"
    echo "   - Terraform hasn't been applied yet"
    echo "   - You're not in the right directory"
    echo "   - Infrastructure wasn't deployed successfully"
    echo ""
    echo "🔧 Try running:"
    echo "   cd ../terraform && terraform apply"
    exit 1
else
    echo ""
    echo "🎉 Environment file generated successfully!"
    echo "📁 Location: $(pwd)/.env.local"
fi
