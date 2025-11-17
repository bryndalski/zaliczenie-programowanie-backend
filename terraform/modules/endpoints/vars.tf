variable "project" {
  description = "Project name"
  type        = string
}

variable "variant" {
  description = "Environment variant (dev, staging, prod)"
  type        = string
}

variable "api_gateway_id" {
  description = "ID of the API Gateway REST API"
  type        = string
}

variable "root_path_id" {
  description = "Root resource ID for the API Gateway path"
  type        = string
}

variable "lambda_name" {
  description = "Name of the Lambda function"
  type        = string
}

variable "lambda_envs" {
  description = "Environment variables for the Lambda function"
  type        = map(string)
  default     = {}
}

variable "entry" {
  description = "Path to the Lambda function entry point"
  type        = string
}

variable "iam_lambda_permissions" {
  description = "List of IAM permissions for the Lambda function"
  type = list(object({
    action   = string
    resource = string
  }))
  default = []
}

variable "path_method" {
  description = "HTTP method for the endpoint (GET, POST, PUT, DELETE, etc.)"
  type        = string
}

variable "path" {
  description = "API path segment (e.g., 'notes', 'users')"
  type        = string
  default     = ""
}

variable "authorizer_id" {
  description = "ID of the API Gateway authorizer (optional)"
  type        = string
  default     = ""
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}

variable "lambda_runtime" {
  description = "Lambda runtime"
  type        = string
  default     = "nodejs20.x"
}

variable "lambda_handler" {
  description = "Lambda handler"
  type        = string
  default     = "index.handler"
}

variable "lambda_timeout" {
  description = "Lambda timeout in seconds"
  type        = number
  default     = 30
}

variable "lambda_memory_size" {
  description = "Lambda memory size in MB"
  type        = number
  default     = 128
}

variable "lambda_layers" {
  description = "List of Lambda Layer ARNs"
  type        = list(string)
  default     = []
}

