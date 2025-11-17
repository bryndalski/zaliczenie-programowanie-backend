# CORS configuration for each notes endpoint
# Each endpoint has its own resource path, so each needs its own OPTIONS method

# /notes/add OPTIONS
resource "aws_api_gateway_method" "add_note_options" {
  rest_api_id   = module.api_gateway.api_gateway_id
  resource_id   = aws_api_gateway_resource.add_note.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "add_note_options" {
  rest_api_id = module.api_gateway.api_gateway_id
  resource_id = aws_api_gateway_resource.add_note.id
  http_method = aws_api_gateway_method.add_note_options.http_method
  type        = "MOCK"

  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_method_response" "add_note_options" {
  rest_api_id = module.api_gateway.api_gateway_id
  resource_id = aws_api_gateway_resource.add_note.id
  http_method = aws_api_gateway_method.add_note_options.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }

  response_models = {
    "application/json" = "Empty"
  }
}

resource "aws_api_gateway_integration_response" "add_note_options" {
  rest_api_id = module.api_gateway.api_gateway_id
  resource_id = aws_api_gateway_resource.add_note.id
  http_method = aws_api_gateway_method.add_note_options.http_method
  status_code = aws_api_gateway_method_response.add_note_options.status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'POST,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }

  depends_on = [aws_api_gateway_integration.add_note_options]
}

# /notes/get OPTIONS
resource "aws_api_gateway_method" "get_notes_options" {
  rest_api_id   = module.api_gateway.api_gateway_id
  resource_id   = aws_api_gateway_resource.get_notes.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "get_notes_options" {
  rest_api_id = module.api_gateway.api_gateway_id
  resource_id = aws_api_gateway_resource.get_notes.id
  http_method = aws_api_gateway_method.get_notes_options.http_method
  type        = "MOCK"

  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_method_response" "get_notes_options" {
  rest_api_id = module.api_gateway.api_gateway_id
  resource_id = aws_api_gateway_resource.get_notes.id
  http_method = aws_api_gateway_method.get_notes_options.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }

  response_models = {
    "application/json" = "Empty"
  }
}

resource "aws_api_gateway_integration_response" "get_notes_options" {
  rest_api_id = module.api_gateway.api_gateway_id
  resource_id = aws_api_gateway_resource.get_notes.id
  http_method = aws_api_gateway_method.get_notes_options.http_method
  status_code = aws_api_gateway_method_response.get_notes_options.status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'POST,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }

  depends_on = [aws_api_gateway_integration.get_notes_options]
}

# /notes/update OPTIONS
resource "aws_api_gateway_method" "update_note_options" {
  rest_api_id   = module.api_gateway.api_gateway_id
  resource_id   = aws_api_gateway_resource.update_note.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "update_note_options" {
  rest_api_id = module.api_gateway.api_gateway_id
  resource_id = aws_api_gateway_resource.update_note.id
  http_method = aws_api_gateway_method.update_note_options.http_method
  type        = "MOCK"

  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_method_response" "update_note_options" {
  rest_api_id = module.api_gateway.api_gateway_id
  resource_id = aws_api_gateway_resource.update_note.id
  http_method = aws_api_gateway_method.update_note_options.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }

  response_models = {
    "application/json" = "Empty"
  }
}

resource "aws_api_gateway_integration_response" "update_note_options" {
  rest_api_id = module.api_gateway.api_gateway_id
  resource_id = aws_api_gateway_resource.update_note.id
  http_method = aws_api_gateway_method.update_note_options.http_method
  status_code = aws_api_gateway_method_response.update_note_options.status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'POST,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }

  depends_on = [aws_api_gateway_integration.update_note_options]
}

# /notes/delete OPTIONS
resource "aws_api_gateway_method" "delete_note_options" {
  rest_api_id   = module.api_gateway.api_gateway_id
  resource_id   = aws_api_gateway_resource.delete_note.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "delete_note_options" {
  rest_api_id = module.api_gateway.api_gateway_id
  resource_id = aws_api_gateway_resource.delete_note.id
  http_method = aws_api_gateway_method.delete_note_options.http_method
  type        = "MOCK"

  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_method_response" "delete_note_options" {
  rest_api_id = module.api_gateway.api_gateway_id
  resource_id = aws_api_gateway_resource.delete_note.id
  http_method = aws_api_gateway_method.delete_note_options.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }

  response_models = {
    "application/json" = "Empty"
  }
}

resource "aws_api_gateway_integration_response" "delete_note_options" {
  rest_api_id = module.api_gateway.api_gateway_id
  resource_id = aws_api_gateway_resource.delete_note.id
  http_method = aws_api_gateway_method.delete_note_options.http_method
  status_code = aws_api_gateway_method_response.delete_note_options.status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'POST,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }

  depends_on = [aws_api_gateway_integration.delete_note_options]
}


