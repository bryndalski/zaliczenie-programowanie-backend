data "archive_file" "lambda_archive_files" {
  type        = "zip"
  source_dir  = "${path.root}/../${var.entry}"
  output_path = "${path.root}/.terraform/archive_files/${var.variant}-${var.project}-${var.lambda_name}.zip"
}

resource "aws_lambda_function" "lambda_function" {
  function_name = "${var.variant}-${var.project}-${var.lambda_name}"
  role          = aws_iam_role.lambda_role.arn

  environment {
    variables = var.lambda_envs
  }

  filename         = data.archive_file.lambda_archive_files.output_path
  source_code_hash = data.archive_file.lambda_archive_files.output_base64sha256
  handler          = var.handler
  runtime          = var.runtime
  timeout          = var.timeout
  memory_size      = var.memory_size

  layers = var.layers

  tracing_config {
    mode = "Active"
  }

  logging_config {
    log_format = "JSON"
  }

  tags = var.tags

  depends_on = [
    aws_cloudwatch_log_group.lambda_logs,
    aws_iam_role_policy_attachment.lambda_basic_execution,
    aws_iam_role_policy_attachment.lambda_xray
  ]
}

