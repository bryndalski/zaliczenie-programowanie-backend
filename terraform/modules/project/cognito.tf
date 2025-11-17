module "cognito" {
  source = "../cognito"

  project = var.project
  variant = var.variant

  password_minimum_length = 8

  client_callback_urls = [
    "http://localhost:3000/callback",
    "https://${var.project}.com/callback"
  ]

  client_logout_urls = [
    "http://localhost:3000",
    "https://${var.project}.com"
  ]

  tags = merge(var.tags, {
    Module = "cognito"
  })
}

