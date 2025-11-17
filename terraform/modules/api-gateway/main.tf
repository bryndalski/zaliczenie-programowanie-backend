resource "aws_api_gateway_rest_api" "api" {
  name        = "${var.variant}-${var.project}-api"
  description = "REST API for ${var.project} - ${var.variant} environment"

  endpoint_configuration {
    types = ["REGIONAL"]
  }

  tags = var.tags
}

resource "aws_api_gateway_authorizer" "cognito" {
  name          = "${var.variant}-${var.project}-cognito-authorizer"
  type          = "COGNITO_USER_POOLS"
  rest_api_id   = aws_api_gateway_rest_api.api.id
  provider_arns = [var.cognito_user_pool_arn]
}


