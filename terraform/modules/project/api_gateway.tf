module "api_gateway" {
  source  = "../api-gateway"

  project = var.project
  variant = var.variant
  tags    = var.tags

  # endpoints moved to a dedicated endpoints module (not created here)
}