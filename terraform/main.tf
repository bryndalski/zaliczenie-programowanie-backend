module "project" {
  source = "./modules/project"

  project = local.project
  variant = local.variant
  tags    = local.common_tags
}

# Outputs
output "api_gateway_url" {
  description = "API Gateway invoke URL"
  value       = module.project.api_gateway_url
}

output "cognito_user_pool_id" {
  description = "Cognito User Pool ID"
  value       = module.project.cognito_user_pool_id
}

output "cognito_client_id" {
  description = "Cognito User Pool Client ID"
  value       = module.project.cognito_client_id
}

output "cognito_auth_domain" {
  description = "Cognito authentication domain URL"
  value       = module.project.cognito_auth_domain
}

output "dynamodb_table_name" {
  description = "DynamoDB table name"
  value       = module.project.dynamodb_table_name
}

