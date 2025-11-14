terraform {
  backend "s3" {
    bucket = "studia-tf-state"
    key = "studia/zaliczenia/backend/terraform.tfstate" 
    encrypt = true
    region = "eu-west-1"
  }
}