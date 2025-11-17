# Base notes resource
resource "aws_api_gateway_resource" "notes" {
  rest_api_id = module.api_gateway.api_gateway_id
  parent_id   = module.api_gateway.api_gateway_root_resource_id
  path_part   = "notes"

  lifecycle {
    ignore_changes = all
  }
}

# Separate resource for each operation
resource "aws_api_gateway_resource" "add_note" {
  rest_api_id = module.api_gateway.api_gateway_id
  parent_id   = aws_api_gateway_resource.notes.id
  path_part   = "add"

  lifecycle {
    ignore_changes = all
  }
}

resource "aws_api_gateway_resource" "get_notes" {
  rest_api_id = module.api_gateway.api_gateway_id
  parent_id   = aws_api_gateway_resource.notes.id
  path_part   = "get"

  lifecycle {
    ignore_changes = all
  }
}

resource "aws_api_gateway_resource" "update_note" {
  rest_api_id = module.api_gateway.api_gateway_id
  parent_id   = aws_api_gateway_resource.notes.id
  path_part   = "update"

  lifecycle {
    ignore_changes = all
  }
}

resource "aws_api_gateway_resource" "delete_note" {
  rest_api_id = module.api_gateway.api_gateway_id
  parent_id   = aws_api_gateway_resource.notes.id
  path_part   = "delete"

  lifecycle {
    ignore_changes = all
  }
}

output "notes_resource_id" {
  value = aws_api_gateway_resource.notes.id
}

output "add_note_resource_id" {
  value = aws_api_gateway_resource.add_note.id
}

output "get_notes_resource_id" {
  value = aws_api_gateway_resource.get_notes.id
}

output "update_note_resource_id" {
  value = aws_api_gateway_resource.update_note.id
}

output "delete_note_resource_id" {
  value = aws_api_gateway_resource.delete_note.id
}

