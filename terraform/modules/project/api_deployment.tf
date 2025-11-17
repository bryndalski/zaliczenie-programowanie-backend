# API Gateway Deployment - must be created after all endpoints
resource "aws_api_gateway_deployment" "api_deployment" {
  rest_api_id = module.api_gateway.api_gateway_id

  triggers = {
    # Redeploy when endpoints change
    redeployment = sha1(jsonencode([
      for endpoint_key, endpoint in module.endpoints : {
        resource_id = endpoint.api_resource_id
        method      = endpoint.http_method
        lambda_arn  = endpoint.lambda_function_arn
      }
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }

  # Ensure all endpoints are created before deployment
  depends_on = [
    module.endpoints
  ]
}

# API Gateway Stage
resource "aws_api_gateway_stage" "api_stage" {
  deployment_id = aws_api_gateway_deployment.api_deployment.id
  rest_api_id   = module.api_gateway.api_gateway_id
  stage_name    = var.variant

  xray_tracing_enabled = true

  tags = merge(var.tags, {
    Module = "api-gateway-stage"
  })
}

