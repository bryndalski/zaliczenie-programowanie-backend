module "dynamo_db" {
  source = "../dynamodb"

  project = var.project
  variant = var.variant

  table_name = "${var.variant}-${var.project}-notes"

  hash_key = "userId"
  range_key = "noteId"

  attributes = [
    {
      name = "userId"
      type = "S"
    },
    {
      name = "noteId"
      type = "S"
    }
  ]

  tags = merge(var.tags, {
    Module = "dynamodb"
  })
}

