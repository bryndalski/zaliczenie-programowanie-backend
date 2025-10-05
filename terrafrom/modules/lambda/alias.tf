data "archive_file" "example" {
  type        = "zip"
  source_file = "${path.module}/lambda/index.js"
  output_path = "${path.module}/lambda/function.zip"
}

# Lambda function
resource "aws_lambda_function" "example" {
  filename         = data.archive_file.example.output_path
  function_name    = "example_lambda_function"
  role             = aws_iam_role.example.arn
  handler          = "index.handler"
  source_code_hash = data.archive_file.example.output_base64sha256

  runtime = "nodejs20.x"

  environment {
    variables = {
      ENVIRONMENT = "production"
      LOG_LEVEL   = "info"
    }
  }

  tags = {
    Environment = "production"
    Application = "example"
  }
}