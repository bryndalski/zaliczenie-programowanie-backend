module "endpoints" {
  source = "../endpoints"

  for_each = {
    add_note = {
      path        = "add_notes"
      path_method = "POST"
      lambda_name = "add_note"
      lambda_envs = {
        NOTES_TABLE_NAME     = module.dynamo_db.table_name
        COGNITO_USER_POOL_ID = module.cognito.user_pool_id
      }
      iam_lambda_permissions = [
        {
          action   = "dynamodb:PutItem"
          resource = module.dynamo_db.table_arn
        },
      ]
      entry = "src/lambdas/add_note"
    }
  }

  # Pass variables from each endpoint configuration
  project        = var.project
  variant        = var.variant
  api_gateway_id = module.api_gateway.api_gateway_id
  root_path_id   = module.api_gateway.api_gateway_root_resource_id

  # Endpoint-specific variables
  path                   = each.value.path
  lambda_name            = each.value.lambda_name
  lambda_envs            = each.value.lambda_envs
  iam_lambda_permissions = each.value.iam_lambda_permissions
  entry                  = each.value.entry
  path_method            = each.value.path_method

  # Optional: Use Cognito authorizer for protected endpoints
  authorizer_id = module.api_gateway.api_gateway_authorizer_id

  tags = {
    Project     = var.project
    Environment = var.variant
    Endpoint    = each.key
  }
}