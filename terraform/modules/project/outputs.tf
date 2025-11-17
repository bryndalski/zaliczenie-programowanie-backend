output "api_gateway_url" {
  description = "API Gateway invoke URL"
  value       = module.api_gateway.api_gateway_invoke_url
}

output "api_gateway_id" {
  description = "API Gateway ID"
  value       = module.api_gateway.api_gateway_id
}

output "cognito_user_pool_id" {
  description = "Cognito User Pool ID"
  value       = module.cognito.user_pool_id
}

output "cognito_user_pool_arn" {
  description = "Cognito User Pool ARN"
  value       = module.cognito.user_pool_arn
}

output "cognito_client_id" {
  description = "Cognito User Pool Client ID"
  value       = module.cognito.user_pool_client_id
}

output "cognito_auth_domain" {
  description = "Cognito authentication domain URL"
  value       = module.cognito.user_pool_domain_url
}

output "dynamodb_table_name" {
  description = "DynamoDB table name"
  value       = module.dynamo_db.table_name
}

output "dynamodb_table_arn" {
  description = "DynamoDB table ARN"
  value       = module.dynamo_db.table_arn
}

output "endpoints" {
  description = "Information about all endpoints"
  value = {
    for key, endpoint in module.endpoints : key => {
      lambda_name  = endpoint.lambda_function_name
      lambda_arn   = endpoint.lambda_function_arn
      path         = endpoint.api_resource_path
      http_method  = endpoint.http_method
    }
  }
}

