terraform {
  required_version = ">= 1.5"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Local state to start. Before this is used by more than one person,
  # move to a remote backend (S3 + DynamoDB lock table) so state isn't
  # only on one machine:
  #
  # backend "s3" {
  #   bucket         = "tvetupload-terraform-state"
  #   key            = "prod/terraform.tfstate"
  #   region         = "us-east-1"
  #   dynamodb_table = "tvetupload-terraform-locks"
  #   encrypt        = true
  # }
}

provider "aws" {
  region = var.aws_region
}

# CloudFront + ACM certificates for CloudFront must be requested in
# us-east-1 regardless of where everything else lives. We don't use a
# custom domain/ACM cert yet, but this alias is here so it's a one-line
# change to add one later.
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}
