locals {

  common_lambda_config = {
    runtime      = "nodejs20.x"
    memory_size  = 512
    timeout      = 10
    handler      = "index.handler"
    architecture = "arm64"
    publish      = true
    environment = {
      variables = {
        NODE_OPTIONS = "--enable-source-maps"
        STAGE        = local.variant
      }
    }
    provisioned_concurrent_enabled = false
    provisioned_concurrent_count   = 1
    tags                           = local.tags
  }


  tags = {
    project = "zaliczenie-backend"
    variant = "dev"
    owner   = "bryndalski"
  }
  project = "zaliczenie-backend"
  variant = "dev"
}