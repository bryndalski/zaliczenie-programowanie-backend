data "archive_file" "lambda_archive_file" {
  type        = "zip"
  source_file = "${path.module}/lambda/index.js"
  output_path = "${path.module}/lambda/function.zip"
}

# Lambda function
resource "aws_lambda_function" "lambda" {
  filename         = data.archive_file.lambda_archive_file.output_path
  function_name    = "${var.variant}-${var.project}-${var.lambda_name}"
  role             = aws_iam_role.lambda_role.arn
  handler          = "index.handler"
  source_code_hash = data.archive_file.lambda_archive_file.output_base64sha256

  runtime = var.runtime

  environment {

  }

  tags = var.tags
}

resource "aws_lambda_alias" "alias" {
  function_name    = aws_lambda_function.lambda.function_name
  function_version = aws_lambda_function.lambda.version
  name             = "${var.variant}-${var.project}-${var.lambda_name}-alias"
}