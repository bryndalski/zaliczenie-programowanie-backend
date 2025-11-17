module "endpoints" {
  source = "../endpoints"

  for_each = {
    add_note = {
      resource_id = aws_api_gateway_resource.notes.id
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

    get_notes = {
      resource_id = aws_api_gateway_resource.notes.id
      path_method = "GET"
      lambda_name = "get_notes"
      lambda_envs = {
        NOTES_TABLE_NAME = module.dynamo_db.table_name
      }
      iam_lambda_permissions = [
        {
          action   = "dynamodb:Query"
          resource = module.dynamo_db.table_arn
        },
      ]
      entry = "src/lambdas/get_notes"
    }

    update_note = {
      resource_id = aws_api_gateway_resource.notes.id
      path_method = "PUT"
      lambda_name = "update_note"
      lambda_envs = {
        NOTES_TABLE_NAME = module.dynamo_db.table_name
      }
      iam_lambda_permissions = [
        {
          action   = "dynamodb:GetItem"
          resource = module.dynamo_db.table_arn
        },
        {
          action   = "dynamodb:UpdateItem"
          resource = module.dynamo_db.table_arn
        },
      ]
      entry = "src/lambdas/update_note"
    }

    delete_note = {
      resource_id = aws_api_gateway_resource.notes.id
      path_method = "DELETE"
      lambda_name = "delete_note"
      lambda_envs = {
        NOTES_TABLE_NAME = module.dynamo_db.table_name
      }
      iam_lambda_permissions = [
        {
          action   = "dynamodb:GetItem"
          resource = module.dynamo_db.table_arn
        },
        {
          action   = "dynamodb:DeleteItem"
          resource = module.dynamo_db.table_arn
        },
      ]
      entry = "src/lambdas/delete_note"
    }
  }

  # Pass variables from each endpoint configuration
  project                = var.project
  variant                = var.variant
  api_gateway_id         = module.api_gateway.api_gateway_id
  resource_id            = each.value.resource_id
  lambda_name            = each.value.lambda_name
  lambda_envs            = each.value.lambda_envs
  iam_lambda_permissions = each.value.iam_lambda_permissions
  entry                  = each.value.entry
  path_method = each.value.path_method

  # Optional: Use Cognito authorizer for protected endpoints
  authorizer_id = module.api_gateway.api_gateway_authorizer_id

  # Lambda layers for all endpoints
  lambda_layers = [
    module.telemetry_layer.layer_arn,
    module.dynamodb_layer.layer_arn,
  ]

  tags = {
    Project     = var.project
    Environment = var.variant
    Endpoint    = each.key
  }
}