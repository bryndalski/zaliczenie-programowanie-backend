module "api_gateway" {
  source = "../api-gateway"

  project = var.project
  variant = var.variant

  cognito_user_pool_arn = module.cognito.user_pool_arn

  tags = merge(var.tags, {
    Module = "api-gateway"
  })
}

