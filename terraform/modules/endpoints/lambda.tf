module "lambda" {
  source = "../lambda"

  project      = var.project
  variant      = var.variant
  lambda_name  = var.lambda_name
  lambda_envs  = var.lambda_envs
  entry        = var.entry
  runtime      = var.lambda_runtime
  handler      = var.lambda_handler
  timeout      = var.lambda_timeout
  memory_size  = var.lambda_memory_size
  layers       = var.lambda_layers
  tags         = var.tags

  iam_lambda_permissions = var.iam_lambda_permissions
}

# Permission for API Gateway to invoke Lambda
resource "aws_lambda_permission" "api_gateway" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = module.lambda.lambda_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${data.aws_api_gateway_rest_api.api.execution_arn}/*/*"
}

data "aws_api_gateway_rest_api" "api" {
  rest_api_id = var.api_gateway_id
}

