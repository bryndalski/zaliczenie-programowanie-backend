terraform {
  backend "s3" {
    bucket = "df-iot-terraform-state"
    key = "studia/zaliczenia/backend/terraform.tfstate" 
    encrypt = true
    region = "eu-west-1"
  }
}