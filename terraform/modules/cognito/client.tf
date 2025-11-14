resource "aws_cognito_user_pool_client" "client" {
  name = "main_client"
  generate_secret = false

  user_pool_id = aws_cognito_user_pool.user_pool.id
}