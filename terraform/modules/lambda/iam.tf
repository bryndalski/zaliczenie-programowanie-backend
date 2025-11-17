data "aws_iam_policy_document" "lambda_assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "lambda_role" {
  name               = "${var.variant}-${var.project}-${var.lambda_name}-role"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json
  tags               = var.tags
}

resource "aws_iam_role_policy_attachment" "lambda_basic_execution" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "lambda_xray" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/AWSXRayDaemonWriteAccess"
}

# Custom policy for additional permissions
resource "aws_iam_policy" "lambda_custom_policy" {
  count = length(var.iam_lambda_permissions) > 0 ? 1 : 0

  name        = "${var.variant}-${var.project}-${var.lambda_name}-custom-policy"
  description = "Custom policy for ${var.lambda_name} Lambda function"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      for permission in var.iam_lambda_permissions : {
        Effect   = "Allow"
        Action   = permission.action
        Resource = permission.resource
      }
    ]
  })

  tags = var.tags
}

resource "aws_iam_role_policy_attachment" "lambda_custom_policy" {
  count = length(var.iam_lambda_permissions) > 0 ? 1 : 0

  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.lambda_custom_policy[0].arn
}

