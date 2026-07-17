variable "domain_name" {
  description = "Custom domain for the frontend, fronted by CloudFront. Empty string disables it (falls back to the default *.cloudfront.net domain)."
  type        = string
  default     = "psetportal.co.za"
}

# Looked up rather than managed — the cert was created manually in ACM
# (must be in us-east-1; CloudFront doesn't accept certs from anywhere
# else) and must already be validated/ISSUED before `apply` will find it.
data "aws_acm_certificate" "site" {
  provider    = aws.us_east_1
  domain      = var.domain_name
  statuses    = ["ISSUED"]
  most_recent = true
}

# Looked up rather than managed — DNS for this domain already lives in
# Route 53.
data "aws_route53_zone" "root" {
  name         = var.domain_name
  private_zone = false
}

resource "aws_route53_record" "site" {
  zone_id = data.aws_route53_zone.root.zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.frontend.domain_name
    zone_id                = aws_cloudfront_distribution.frontend.hosted_zone_id
    evaluate_target_health = false
  }
}
