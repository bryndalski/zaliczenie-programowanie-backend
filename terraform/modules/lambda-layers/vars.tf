variable "project" {
  description = "Project name"
  type        = string
}

variable "variant" {
  description = "Environment variant (dev, staging, prod)"
  type        = string
}

variable "layer_name" {
  description = "Name of the Lambda layer"
  type        = string
}

variable "source_dir" {
  description = "Path to the layer source directory"
  type        = string
}

variable "compatible_runtimes" {
  description = "List of compatible runtimes"
  type        = list(string)
  default     = ["nodejs20.x", "nodejs18.x"]
}

variable "description" {
  description = "Description of the Lambda layer"
  type        = string
  default     = ""
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}

