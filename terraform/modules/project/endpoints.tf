module "endpoints" {
  source = "../endpoints"

  for_each = {
    add_note = {
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
      entry        = "src/lambdas/add_note"
      root_path_id = module.api_gateway.api_gateway_root_resource_id
    }

  }


  root_path_id           = each.value.root_path_id
  lambda_name            = each.value.lambda_name
  lambda_envs            = each.value.lambda_envs
  iam_lambda_permissions = each.value.iam_lambda_permissions
  entry                  = each.value.entry
  path_method            = each.value.path_method

  project        = var.project
  variant        = var.variant
  api_gateway_id = module.api_gateway.api_gateway_id
}