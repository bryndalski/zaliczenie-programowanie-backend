# Create HTTP method
resource "aws_api_gateway_method" "endpoint_method" {
  rest_api_id   = var.api_gateway_id
  resource_id   = var.resource_id
  http_method   = var.path_method
  authorization = var.authorizer_id != "" ? "COGNITO_USER_POOLS" : "NONE"
  authorizer_id = var.authorizer_id != "" ? var.authorizer_id : null
}

# Integrate Lambda with API Gateway
resource "aws_api_gateway_integration" "lambda_integration" {
  rest_api_id             = var.api_gateway_id
  resource_id             = var.resource_id
  http_method             = aws_api_gateway_method.endpoint_method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = module.lambda.lambda_invoke_arn
}

# Method response
resource "aws_api_gateway_method_response" "response_200" {
  rest_api_id = var.api_gateway_id
  resource_id = var.resource_id
  http_method = aws_api_gateway_method.endpoint_method.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = true
  }

  response_models = {
    "application/json" = "Empty"
  }
}

# Integration response
resource "aws_api_gateway_integration_response" "lambda_integration_response" {
  rest_api_id = var.api_gateway_id
  resource_id = var.resource_id
  http_method = aws_api_gateway_method.endpoint_method.http_method
  status_code = aws_api_gateway_method_response.response_200.status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = "'*'"
  }

  depends_on = [aws_api_gateway_integration.lambda_integration]
}


