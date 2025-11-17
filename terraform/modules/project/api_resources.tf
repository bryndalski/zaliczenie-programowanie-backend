resource "aws_api_gateway_resource" "notes" {
  rest_api_id = module.api_gateway.api_gateway_id
  parent_id   = module.api_gateway.api_gateway_root_resource_id
  path_part   = "notes"
}

