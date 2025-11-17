locals {
  project = "notes-app"
  variant = terraform.workspace

  common_tags = {
    Project     = local.project
    Environment = local.variant
    ManagedBy   = "Terraform"
  }
}

