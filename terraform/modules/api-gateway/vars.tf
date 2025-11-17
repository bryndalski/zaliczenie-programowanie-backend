variable "project" {
  description = "Project name"
  type        = string
}

variable "variant" {
  description = "Environment variant (dev, staging, prod)"
  type        = string
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}

variable "cognito_user_pool_arn" {
  description = "ARN of the Cognito User Pool for authorization"
  type        = string
  default     = ""
}

