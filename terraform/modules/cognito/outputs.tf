output "user_pool_id" {
  description = "Cognito User Pool ID"
  value       = aws_cognito_user_pool.user_pool.id
}

output "user_pool_arn" {
  description = "Cognito User Pool ARN"
  value       = aws_cognito_user_pool.user_pool.arn
}

output "provider_arns" {
  description = "List with the user pool ARN (useful for API Gateway authorizers)"
  value       = [aws_cognito_user_pool.user_pool.arn]
}

output "client_ids" {
  description = "Map of client keys to client IDs"
  value = { for k, v in aws_cognito_user_pool_client.client : k => v.id }
}

output "client_secrets" {
  description = "Map of client keys to client secrets (if generate_secret = true). Empty string when not generated."
  value = { for k, v in aws_cognito_user_pool_client.client : k => lookup(v, "client_secret", "") }
}

