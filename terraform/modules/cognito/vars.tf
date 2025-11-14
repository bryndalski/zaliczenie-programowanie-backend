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
  type        = map(string)
  default     = {}
}

variable "clients" {
  description = "Map of Cognito user pool clients. Key is an arbitrary name. Each value can include: name, generate_secret (bool), explicit_auth_flows (list), allowed_oauth_flows (list), allowed_oauth_scopes (list), callback_urls (list), logout_urls (list), supported_identity_providers (list), allowed_oauth_flows_user_pool_client (bool), prevent_user_existence_errors (string)"
  type = map(any)
  default = {}
}
