module "lambda_function" {
  source = "../lambda"

  lambda_name            = var.lambda_name
  project                = var.project
  variant                = var.variant
  tags                   = var.tags
  lambda_envs            = var.lambda_envs
  runtime                = var.runtime
  iam_lambda_permissions = var.iam_lambda_permissions
  entry                  = var.entry
}