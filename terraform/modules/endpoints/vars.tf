variable "project" {
  description = "Project name for tagging"
  type        = string
}

variable "variant" {
  description = "Variant name for tagging (e.g., dev, prod)"
  type        = string
}


variable "tags" {
  description = "Tags to apply to resources"
  type = map(string)
  default = {}
}

variable "api_gateway_id" {
  description = "The ID of the API Gateway"
  type        = string
}

variable "root_path_id" {
  description = "The root resource ID of the API Gateway"
  type        = string
}

variable "path_method" {
  description = "HTTP method for the API Gateway resource (e.g., GET, POST)"
  type        = string
}

variable "lambda_name" {
  description = "Name of the Lambda function"
  type        = string
}

variable "lambda_envs" {
  description = "Environment variables for the Lambda function"
  type = map(string)
  default = {}
}

variable "iam_lambda_permissions" {
  description = "Additional IAM permissions for the Lambda function"
  type = list(string)
  default = []
}

variable "entry" {
  description = "Entry point for the Lambda function"
  type        = string
  default     = "src/lambda.handler"
}

variable "runtime" {
  description = "Runtime environment for the Lambda function"
  type        = string
  default     = "nodejs20.x"
}

variable "path_name" {
  description = "The path name for the API Gateway resource"
  type        = string
  default     = ""
}