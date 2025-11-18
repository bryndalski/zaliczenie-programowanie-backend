#!/bin/bash

# Script to generate .env.local file from Terraform outputs
# Usage: ./generate-env.sh

set -e

echo "🔍 Fetching Terraform outputs..."

# Change to terraform directory
TERRAFORM_DIR="../terraform"
FRONTEND_DIR="."

if [ ! -d "$TERRAFORM_DIR" ]; then
  echo "❌ Error: Terraform directory not found at $TERRAFORM_DIR"
  exit 1
fi

# Get Terraform outputs as JSON
cd "$TERRAFORM_DIR"
OUTPUTS=$(terraform output -json)

if [ $? -ne 0 ]; then
  echo "❌ Error: Failed to get Terraform outputs"
  exit 1
fi

# Extract values from JSON
API_URL=$(echo $OUTPUTS | jq -r '.api_gateway_url.value')
COGNITO_USER_POOL_ID=$(echo $OUTPUTS | jq -r '.cognito_user_pool_id.value')
COGNITO_CLIENT_ID=$(echo $OUTPUTS | jq -r '.cognito_client_id.value')

# Extract region from user pool ID (format: region_xxxxx)
COGNITO_REGION=$(echo $COGNITO_USER_POOL_ID | cut -d'_' -f1)

# Generate .env.local file
cd - > /dev/null
cd "$FRONTEND_DIR"

cat > .env.local << EOF
# AWS Cognito Configuration
NEXT_PUBLIC_COGNITO_USER_POOL_ID=$COGNITO_USER_POOL_ID
NEXT_PUBLIC_COGNITO_CLIENT_ID=$COGNITO_CLIENT_ID
NEXT_PUBLIC_COGNITO_REGION=$COGNITO_REGION

# API Gateway Configuration
NEXT_PUBLIC_API_GATEWAY_URL=$API_URL
EOF

echo "✅ Successfully generated .env.local file!"
echo ""
echo "📝 Configuration:"
echo "  Region: $COGNITO_REGION"
echo "  User Pool ID: $COGNITO_USER_POOL_ID"
echo "  Client ID: $COGNITO_CLIENT_ID"
echo "  API URL: $API_URL"

