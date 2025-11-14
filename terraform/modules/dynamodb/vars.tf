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