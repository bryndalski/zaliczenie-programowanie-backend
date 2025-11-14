output "lambda_function_arn" {
  value       = lambda
  description = "The ARN of the Lambda function"
}

output "lambda_invoke_arn" {
  value       = aws_lambda_function.lambda.invoke_arn
  description = "The invoke ARN of the Lambda function"
}