module "dynamo_db" {
  source = "../dynamodb"

  tags = var.tags
  project = var.project
  variant = var.variant
}