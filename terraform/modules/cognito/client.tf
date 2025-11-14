locals {
  clients = length(keys(var.clients)) > 0 ? var.clients : {
    main = {
      name            = "main_client"
      generate_secret = false
    }
  }
}

resource "aws_cognito_user_pool_client" "client" {
  for_each = local.clients

  name   = lookup(each.value, "name", each.key)
  generate_secret = lookup(each.value, "generate_secret", false)

  user_pool_id = aws_cognito_user_pool.user_pool.id

  # Optional settings (only set if provided)
  explicit_auth_flows                      = lookup(each.value, "explicit_auth_flows", null)
  allowed_oauth_flows                      = lookup(each.value, "allowed_oauth_flows", null)
  allowed_oauth_scopes                     = lookup(each.value, "allowed_oauth_scopes", null)
  callback_urls                            = lookup(each.value, "callback_urls", null)
  logout_urls                              = lookup(each.value, "logout_urls", null)
  supported_identity_providers             = lookup(each.value, "supported_identity_providers", null)
  allowed_oauth_flows_user_pool_client     = lookup(each.value, "allowed_oauth_flows_user_pool_client", null)
  prevent_user_existence_errors            = lookup(each.value, "prevent_user_existence_errors", null)
}