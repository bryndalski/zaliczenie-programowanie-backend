module "notes_backend" {
  source = "./modules/project"

  tags    = local.tags
  project = local.project
  variant = local.variant
}