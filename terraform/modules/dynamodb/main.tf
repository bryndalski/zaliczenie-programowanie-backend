resource "aws_dynamodb_table" "notes_table" {
  name         = "${var.project}-${var.variant}-notes-table"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "noteId"
  range_key    = "userId"

  attribute {
    name = "noteId"
    type = "S"
  }

  attribute {
    name = "userId"
    type = "S"
  }

  global_secondary_index {
    hash_key        = "userId"
    name            = "userIndex"
    projection_type = "ALL"
  }

  tags = var.tags
}