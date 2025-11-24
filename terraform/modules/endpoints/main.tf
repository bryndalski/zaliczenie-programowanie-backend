# Create HTTP method
resource "aws_api_gateway_method" "endpoint_method" {
  rest_api_id   = var.api_gateway_id
  resource_id   = var.resource_id
  http_method   = var.path_method
  authorization = var.authorizer_id != "" ? "COGNITO_USER_POOLS" : "NONE"
  authorizer_id = var.authorizer_id != "" ? var.authorizer_id : null
}

# Integrate Lambda with API Gateway
# Using AWS_PROXY means Lambda must return complete HTTP response including CORS headers
resource "aws_api_gateway_integration" "lambda_integration" {
  rest_api_id             = var.api_gateway_id
  resource_id             = var.resource_id
  http_method             = aws_api_gateway_method.endpoint_method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = module.lambda.lambda_invoke_arn
}



