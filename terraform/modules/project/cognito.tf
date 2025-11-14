module "cognito" {
  source = "../cognito"

  project = var.tags.project
  variant = var.tags.variant
  tags = var.tags

  clients = {}

}
