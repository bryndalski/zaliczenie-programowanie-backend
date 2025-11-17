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

variable "password_minimum_length" {
  description = "Minimum length for user passwords"
  type        = number
  default     = 8
}

variable "client_callback_urls" {
  description = "List of allowed callback URLs for the app client"
  type        = list(string)
  default     = ["http://localhost:3000/callback"]
}

variable "client_logout_urls" {
  description = "List of allowed logout URLs for the app client"
  type        = list(string)
  default     = ["http://localhost:3000"]
}

