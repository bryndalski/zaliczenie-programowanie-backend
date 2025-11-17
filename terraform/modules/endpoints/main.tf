resource "aws_api_gateway_method" "api_gateway_method" {
  rest_api_id   = var.api_gateway_id
  resource_id   = var.root_path_id
  http_method   = var.path_method
  authorization = "NONE"

}

resource "aws_api_gateway_integration" "api_gateway_integration" {
  rest_api_id = var.api_gateway_id
  resource_id = var.root_path_id
  http_method = aws_api_gateway_method.api_gateway_method.http_method
  type        = "AWS_PROXY"
  uri         = module.lambda_function.lambda_invoke_arn

  depends_on = [
    module.lambda_function
  ]
}