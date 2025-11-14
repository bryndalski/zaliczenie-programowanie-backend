resource "aws_api_gateway_rest_api" "main_api" {
  name                       = "${var.project}-${var.variant}-api-gateway"
  tags = var.tags
}

resource "aws_api_gateway_resource" "api_root_path" {
  rest_api_id = aws_api_gateway_rest_api.main_api.id
  parent_id   = aws_api_gateway_rest_api.main_api.root_resource_id
  path_part   = "api"
}

r