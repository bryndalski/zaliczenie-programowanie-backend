data "archive_file" "layer_archive" {
  type        = "zip"
  source_dir  = "${path.root}/../${var.source_dir}"
  output_path = "${path.root}/.terraform/layers/${var.variant}-${var.project}-${var.layer_name}.zip"
}

resource "aws_lambda_layer_version" "layer" {
  layer_name          = "${var.variant}-${var.project}-${var.layer_name}"
  filename            = data.archive_file.layer_archive.output_path
  source_code_hash    = data.archive_file.layer_archive.output_base64sha256
  compatible_runtimes = var.compatible_runtimes
  description         = var.description != "" ? var.description : "Lambda layer for ${var.layer_name}"
}

