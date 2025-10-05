data "archive_file" "lambda_archive_files" {
  type        = "zip"
  source_dir  = var.entry
  output_path = "${path.module}/build/lambda.zip"
}

resource "aws_lambda_function" "lambda_function" {
  function_name = "${var.variant}-${var.project}-${var.lambda_name}"
  role          = aws_iam_role.lambda_role.arn

  environment {
    variables = var.lambda_envs
  }

  filename         = data.archive_file.lambda_archive_files.output_path
  source_code_hash = data.archive_file.lambda_archive_files.output_base64sha256
  handler          = "index.handler"

  runtime = "nodejs20.x"

  tracing_config {
    mode = "Active"
  }

  tags = var.tags

  depends_on = [aws_cloudwatch_log_group.lambda_log_group]
}