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

# Get current AWS region and account ID
data "aws_region" "current" {}
data "aws_caller_identity" "current" {}

# Permission for API Gateway to invoke Lambda
resource "aws_lambda_permission" "api_gateway" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = module.lambda.lambda_function_name
  principal     = "apigateway.amazonaws.com"

  # Construct execution ARN: arn:aws:execute-api:region:account-id:api-id/*/*/*
  source_arn = "arn:aws:execute-api:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:${var.api_gateway_id}/*/*"
}

