output "api_gateway_id" {
  value       = aws_api_gateway_rest_api.main_api.id
  description = "The ID of the API Gateway"
}

output "api_gateway_root_resource_id" {
  value       = aws_api_gateway_rest_api.main_api.root_resource_id
  description = "The root resource ID of the API Gateway"
}
