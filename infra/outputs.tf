output "site_url" {
  description = "Public URL of the app"
  value       = "https://${aws_cloudfront_distribution.frontend.domain_name}"
}

output "cloudfront_distribution_id" {
  value = aws_cloudfront_distribution.frontend.id
}

output "frontend_bucket_name" {
  value = aws_s3_bucket.frontend.bucket
}

output "eb_application_name" {
  value = aws_elastic_beanstalk_application.this.name
}

output "eb_environment_name" {
  value = aws_elastic_beanstalk_environment.backend.name
}

output "eb_storage_bucket_name" {
  description = "Set this as the EB_STORAGE_BUCKET GitHub Actions repo variable"
  value       = aws_s3_bucket.eb_storage.bucket
}

output "eb_endpoint" {
  description = "Direct EB endpoint (HTTP only) — for debugging; the public site should be reached via site_url"
  value       = aws_elastic_beanstalk_environment.backend.cname
}

output "rds_endpoint" {
  value = aws_db_instance.this.address
}

output "github_actions_role_arn" {
  description = "Set this as the AWS_ROLE_ARN GitHub Actions repo variable"
  value       = aws_iam_role.github_actions.arn
}
