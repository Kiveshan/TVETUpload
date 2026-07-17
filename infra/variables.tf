variable "aws_region" {
  description = "AWS region for RDS, Elastic Beanstalk, and S3. CloudFront itself is global."
  type        = string
  default     = "af-south-1"
}

variable "project_name" {
  description = "Short name used as a prefix for all resource names."
  type        = string
  default     = "tvetupload"
}

variable "environment" {
  description = "Deployment environment name (used in tags and resource naming)."
  type        = string
  default     = "prod"
}

variable "github_repo" {
  description = "GitHub repo allowed to assume the deploy role, as \"owner/repo\"."
  type        = string
  default     = "Kiveshan/TVETUpload"
}

variable "instance_type" {
  description = "EC2 instance type for the Elastic Beanstalk backend."
  type        = string
  default     = "t3.micro"
}

variable "db_instance_class" {
  description = "RDS instance class."
  type        = string
  default     = "db.t3.micro"
}

variable "db_name" {
  description = "Postgres database name."
  type        = string
  default     = "tvetupload"
}

variable "db_username" {
  description = "Postgres master username."
  type        = string
  default     = "tvetupload_app"
}

variable "db_password" {
  description = "Postgres master password. Set via TF_VAR_db_password or a terraform.tfvars file that is NOT committed."
  type        = string
  sensitive   = true
}
