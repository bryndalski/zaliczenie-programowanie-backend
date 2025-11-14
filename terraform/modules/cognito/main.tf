resource "aws_cognito_user_pool" "user_pool" {
  name = "${var.project}-${var.variant}-user-pool"
  tags = var.tags

  mfa_configuration = "OFF"


  password_policy {
    minimum_length    = 8
    require_uppercase = true
    require_lowercase = true
    require_numbers   = true
    require_symbols   = true
  }

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }

    recovery_mechanism {
      name     = "verified_phone_number"
      priority = 2
    }
  }

  auto_verified_attributes = ["email"]


}