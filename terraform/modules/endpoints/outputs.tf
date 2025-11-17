output "lambda_function_name" {
  description = "Name of the Lambda function"
  value       = module.lambda.lambda_function_name
}

output "lambda_function_arn" {
  description = "ARN of the Lambda function"
  value       = module.lambda.lambda_function_arn
}

output "lambda_invoke_arn" {
  description = "Invoke ARN of the Lambda function"
  value       = module.lambda.lambda_invoke_arn
}

output "api_resource_id" {
  description = "ID of the API Gateway resource"
  value       = var.resource_id
}

output "http_method" {
  description = "HTTP method for the endpoint"
  value       = var.path_method
}

