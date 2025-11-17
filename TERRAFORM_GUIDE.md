# Serverless Notes Application Infrastructure

Complete AWS infrastructure for a serverless notes application using Terraform, featuring Lambda functions, API Gateway, Cognito authentication, and DynamoDB.

## Architecture Overview

```
┌─────────────┐
│   Cognito   │ ◄─── User Authentication
│  User Pool  │
└─────────────┘
       │
       ▼
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│ API Gateway │ ───► │   Lambda     │ ───► │  DynamoDB   │
│   + Auth    │      │  Functions   │      │    Table    │
└─────────────┘      └──────────────┘      └─────────────┘
```

## Module Structure

### 1. **Lambda Module** (`terraform/modules/lambda`)
Creates Lambda functions with:
- Automatic packaging from source directory
- CloudWatch log groups (JSON format, 14-day retention)
- IAM roles with basic execution and X-Ray permissions
- Custom IAM policies for additional permissions
- X-Ray tracing enabled
- Environment variables support
- Lambda layers support

### 2. **API Gateway Module** (`terraform/modules/api-gateway`)
Creates REST API with:
- Regional endpoint configuration
- Cognito User Pool authorizer
- Automatic deployment with stage
- X-Ray tracing enabled

### 3. **Cognito Module** (`terraform/modules/cognito`)
Creates user authentication with:
- User pool with email-based authentication
- Password policy enforcement
- MFA support (optional)
- App client for authentication flows
- Custom domain for auth endpoints

### 4. **DynamoDB Module** (`terraform/modules/dynamodb`)
Creates NoSQL database with:
- Pay-per-request billing (or provisioned if needed)
- Point-in-time recovery enabled
- Server-side encryption
- DynamoDB Streams enabled
- Flexible attribute definitions

### 5. **Endpoints Module** (`terraform/modules/endpoints`)
Ties everything together by:
- Creating Lambda function via Lambda module
- Creating API Gateway resources and methods
- Integrating Lambda with API Gateway (AWS_PROXY)
- Setting up proper IAM permissions
- Configuring CORS (OPTIONS method)
- Optional Cognito authorization per endpoint

## Quick Start

### Prerequisites
- Terraform >= 1.0
- AWS CLI configured with appropriate credentials
- Node.js and TypeScript (for Lambda functions)

### 1. Initialize Terraform

```bash
cd terraform
terraform init
```

### 2. Create Workspace (Environment)

```bash
# For development
terraform workspace new dev
terraform workspace select dev

# For production
terraform workspace new prod
terraform workspace select prod
```

### 3. Plan and Apply

```bash
terraform plan
terraform apply
```

### 4. Get Outputs

```bash
terraform output
```

This will show:
- API Gateway URL
- Cognito User Pool ID
- Cognito Client ID
- Cognito Auth Domain
- DynamoDB Table Name

## Adding New Endpoints

To add a new endpoint, simply add it to `terraform/modules/project/endpoints.tf`:

```terraform
module "endpoints" {
  source = "../endpoints"

  for_each = {
    add_note = {
      path        = "notes"
      path_method = "POST"
      lambda_name = "add_note"
      lambda_envs = {
        NOTES_TABLE_NAME     = module.dynamo_db.table_name
        COGNITO_USER_POOL_ID = module.cognito.user_pool_id
      }
      iam_lambda_permissions = [
        {
          action   = "dynamodb:PutItem"
          resource = module.dynamo_db.table_arn
        },
      ]
      entry = "src/lambdas/add_note"
    }
    
    # Add more endpoints here:
    get_notes = {
      path        = "notes"
      path_method = "GET"
      lambda_name = "get_notes"
      lambda_envs = {
        NOTES_TABLE_NAME = module.dynamo_db.table_name
      }
      iam_lambda_permissions = [
        {
          action   = "dynamodb:Query"
          resource = module.dynamo_db.table_arn
        },
      ]
      entry = "src/lambdas/get_notes"
    }
    
    delete_note = {
      path        = "notes/{noteId}"
      path_method = "DELETE"
      lambda_name = "delete_note"
      lambda_envs = {
        NOTES_TABLE_NAME = module.dynamo_db.table_name
      }
      iam_lambda_permissions = [
        {
          action   = "dynamodb:DeleteItem"
          resource = module.dynamo_db.table_arn
        },
      ]
      entry = "src/lambdas/delete_note"
    }
  }
  
  # ... rest of configuration
}
```

### Endpoint Configuration Options

Each endpoint supports:

| Parameter | Description | Required |
|-----------|-------------|----------|
| `path` | API path segment (e.g., "notes", "users") | No (defaults to root) |
| `path_method` | HTTP method (GET, POST, PUT, DELETE, PATCH) | Yes |
| `lambda_name` | Name of the Lambda function | Yes |
| `lambda_envs` | Environment variables for Lambda | No |
| `iam_lambda_permissions` | Additional IAM permissions | No |
| `entry` | Path to Lambda source directory | Yes |
| `lambda_runtime` | Lambda runtime (default: nodejs20.x) | No |
| `lambda_handler` | Lambda handler (default: index.handler) | No |
| `lambda_timeout` | Timeout in seconds (default: 30) | No |
| `lambda_memory_size` | Memory in MB (default: 128) | No |
| `lambda_layers` | Lambda layer ARNs | No |

## Lambda Function Structure

Each Lambda function should be in its own directory under `src/lambdas/`:

```
src/lambdas/
├── add_note/
│   ├── index.ts       # Main handler
│   └── package.json   # Optional: function-specific dependencies
├── get_notes/
│   └── index.ts
└── delete_note/
    └── index.ts
```

### Example Lambda Function

```typescript
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  // Get userId from Cognito claims
  const userId = event.requestContext.authorizer?.claims?.sub;
  
  // Your logic here
  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({ message: 'Success' }),
  };
};
```

## Authentication

The API uses Cognito User Pools for authentication. All endpoints automatically have the Cognito authorizer attached.

### Accessing the User's ID

In your Lambda function, get the authenticated user's ID from:

```typescript
const userId = event.requestContext.authorizer?.claims?.sub;
```

### Disabling Auth for Specific Endpoints

To make an endpoint public (no authentication required), modify the endpoints module:

```terraform
# In endpoints.tf, set authorizer_id to empty string for specific endpoints
authorizer_id = each.key == "public_endpoint" ? "" : module.api_gateway.api_gateway_authorizer_id
```

## CloudWatch Logs

All Lambda functions automatically log to CloudWatch with:
- Log group name: `/aws/lambda/{variant}-{project}-{lambda_name}`
- JSON log format for structured logging
- 14-day retention period
- Automatic creation before Lambda deployment

## Environment Variables

Common environment variables available to all Lambda functions:
- `NOTES_TABLE_NAME` - DynamoDB table name
- `COGNITO_USER_POOL_ID` - Cognito User Pool ID
- `AWS_REGION` - AWS region (automatically set)

Add custom environment variables per endpoint in the `lambda_envs` configuration.

## IAM Permissions

The Lambda functions automatically have:
- Basic execution role (CloudWatch Logs)
- X-Ray write access

Additional permissions are granted via `iam_lambda_permissions`:

```terraform
iam_lambda_permissions = [
  {
    action   = "dynamodb:PutItem"
    resource = module.dynamo_db.table_arn
  },
  {
    action   = "dynamodb:Query"
    resource = module.dynamo_db.table_arn
  },
]
```

## CORS Configuration

CORS is automatically configured for all endpoints with:
- Allow-Origin: `*`
- Allow-Methods: The endpoint's method + OPTIONS
- Allow-Headers: Standard headers for API Gateway + Authorization

## Outputs

After deployment, Terraform outputs:

```bash
terraform output api_gateway_url
# https://xxxxxxxxxx.execute-api.{region}.amazonaws.com/dev

terraform output cognito_user_pool_id
# us-east-1_xxxxxxxxx

terraform output cognito_client_id
# xxxxxxxxxxxxxxxxxxxxxxxxxx

terraform output cognito_auth_domain
# https://dev-notes-app-auth.auth.{region}.amazoncognito.com
```

## Cost Optimization

This infrastructure uses serverless, pay-per-use services:
- **Lambda**: Free tier includes 1M requests/month
- **API Gateway**: Free tier includes 1M requests/month
- **DynamoDB**: Pay-per-request billing (no idle costs)
- **Cognito**: Free tier includes 50,000 MAUs

## Clean Up

To destroy all resources:

```bash
terraform destroy
```

## Troubleshooting

### Lambda logs not appearing
- Check CloudWatch log group exists: `/aws/lambda/{variant}-{project}-{lambda_name}`
- Verify IAM role has CloudWatch Logs permissions

### API Gateway 403 Forbidden
- Check Cognito authorizer is properly configured
- Verify the Authorization header contains a valid JWT token

### DynamoDB access denied
- Verify Lambda function has proper IAM permissions in `iam_lambda_permissions`

## Advanced Configuration

### Using Lambda Layers

```terraform
add_note = {
  # ... other config
  lambda_layers = [
    "arn:aws:lambda:us-east-1:123456789012:layer:my-layer:1"
  ]
}
```

### Custom Runtime/Handler

```terraform
add_note = {
  # ... other config
  lambda_runtime = "python3.11"
  lambda_handler = "app.lambda_handler"
}
```

### Adjusting Performance

```terraform
add_note = {
  # ... other config
  lambda_timeout     = 60    # seconds
  lambda_memory_size = 512   # MB
}
```

## Next Steps

1. Implement additional CRUD endpoints (GET, UPDATE, DELETE)
2. Add error handling middleware
3. Implement request validation
4. Add API Gateway request/response models
5. Set up CI/CD pipeline
6. Add CloudWatch alarms and monitoring
7. Implement API throttling and rate limiting
8. Add custom domain name for API Gateway

