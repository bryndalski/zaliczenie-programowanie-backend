output "api_gateway_url" {
  description = "API Gateway invoke URL"
  value       = aws_api_gateway_stage.api_stage.invoke_url
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
      resource_id  = endpoint.api_resource_id
      http_method  = endpoint.http_method
    }
  }
}

output "telemetry_layer_arn" {
  description = "ARN of the telemetry Lambda layer"
  value       = module.telemetry_layer.layer_arn
}

output "dynamodb_layer_arn" {
  description = "ARN of the DynamoDB Lambda layer"
  value       = module.dynamodb_layer.layer_arn
}

output "api_gateway_stage_name" {
  description = "Name of the API Gateway stage"
  value       = aws_api_gateway_stage.api_stage.stage_name
}

output "api_gateway_deployment_id" {
  description = "ID of the API Gateway deployment"
  value       = aws_api_gateway_deployment.api_deployment.id
}

