resource "aws_cloudwatch_log_group" "lambda_logs" {
  name              = "/aws/lambda/${var.variant}-${var.project}-${var.lambda_name}"
  retention_in_days = 14
  tags              = var.tags
}

