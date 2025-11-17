# Lambda Layer for Telemetry (Monitoring, Logging, HTTP Response)
module "telemetry_layer" {
  source = "../lambda-layers"

  project    = var.project
  variant    = var.variant
  layer_name = "telemetry"
  source_dir = "src/layers/telemetry"

  description         = "Layer for telemetry, logging, metrics, and HTTP response utilities"
  compatible_runtimes = ["nodejs20.x", "nodejs18.x"]

  tags = merge(var.tags, {
    Module = "lambda-layer-telemetry"
  })
}

# Lambda Layer for DynamoDB Helper
module "dynamodb_layer" {
  source = "../lambda-layers"

  project    = var.project
  variant    = var.variant
  layer_name = "dynamodb"
  source_dir = "src/layers/dynamodb"

  description         = "Layer for DynamoDB operations and utilities"
  compatible_runtimes = ["nodejs20.x", "nodejs18.x"]

  tags = merge(var.tags, {
    Module = "lambda-layer-dynamodb"
  })
}

