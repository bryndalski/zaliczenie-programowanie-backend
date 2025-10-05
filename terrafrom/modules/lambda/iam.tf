resource "aws_iam_role" "lambda_role" {
  name = "${var.variant}-${var.project}-${var.lambda_name}-role}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })

}

resource "aws_iam_policy" "lambda_policy" {
  name        = "${var.variant}-${var.project}-${var.lambda_name}-"
  description = "IAM policy for ${var.lambda_name} Lambda function"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action   = var.iam_lambda_permissions
        Effect   = "Allow"
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_policy" "lambda_cloudwatch_policy" {
  name        = "${var.variant}-${var.project}-${var.lambda_name}-cloudwatch-policy"
  description = "CloudWatch, X-Ray and tracing permissions for ${var.lambda_name} Lambda function"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          # CloudWatch Logs
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",

          # X-Ray
          "xray:PutTraceSegments",
          "xray:PutTelemetryRecords",
          "xray:GetSamplingRules",
          "xray:GetSamplingTargets",
          "xray:GetSamplingStatisticSummaries",

          # CloudWatch Metrics
          "cloudwatch:PutMetricData"
        ]
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_cloudwatch_attachment" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.lambda_cloudwatch_policy.arn
}

resource "aws_iam_role_policy_attachment" "lambda_policy_attachment" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.lambda_policy.arn
}