# Optional: Create Lambda alias for versioning
resource "aws_lambda_alias" "alias" {
  count = 0 # Disabled by default, can be enabled if needed

  name             = var.variant
  description      = "Alias for ${var.variant} environment"
  function_name    = aws_lambda_function.lambda_function.arn
  function_version = aws_lambda_function.lambda_function.version
}

