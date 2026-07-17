data "aws_caller_identity" "current" {}

# One GitHub Actions OIDC provider per AWS account. If your account already
# has one (e.g. from another repo's pipeline), delete this resource and
# replace every reference to it below with a data source instead:
#   data "aws_iam_openid_connect_provider" "github" {
#     url = "https://token.actions.githubusercontent.com"
#   }
resource "aws_iam_openid_connect_provider" "github" {
  url             = "https://token.actions.githubusercontent.com"
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = ["6938fd4d98bab03faadb97b34396831e3780aea1"]
}

resource "aws_iam_role" "github_actions" {
  name = "${local.name}-github-actions"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Federated = aws_iam_openid_connect_provider.github.arn }
      Action    = "sts:AssumeRoleWithWebIdentity"
      Condition = {
        StringEquals = {
          "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
        }
        StringLike = {
          "token.actions.githubusercontent.com:sub" = "repo:${var.github_repo}:ref:refs/heads/main"
        }
      }
    }]
  })
}

# Elastic Beanstalk's conventional per-account/region app-versions bucket.
# Created here (rather than left for the EB service or the deploy action to
# lazily create) so the GitHub Actions role only ever needs read/write on an
# *existing* bucket, not s3:CreateBucket. If this bucket already exists in
# the account from prior manual EB use, import it instead of applying:
#   terraform import aws_s3_bucket.eb_storage elasticbeanstalk-<region>-<account-id>
resource "aws_s3_bucket" "eb_storage" {
  bucket = "elasticbeanstalk-${var.aws_region}-${data.aws_caller_identity.current.account_id}"

  tags = {
    Project = var.project_name
  }
}

resource "aws_s3_bucket_public_access_block" "eb_storage" {
  bucket = aws_s3_bucket.eb_storage.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_iam_role_policy" "github_actions" {
  name = "${local.name}-github-actions"
  role = aws_iam_role.github_actions.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "ElasticBeanstalkDeploy"
        Effect = "Allow"
        Action = [
          "elasticbeanstalk:CreateApplicationVersion",
          "elasticbeanstalk:UpdateEnvironment",
          "elasticbeanstalk:DescribeEnvironments",
          "elasticbeanstalk:DescribeEvents",
          "elasticbeanstalk:DescribeApplicationVersions",
          "elasticbeanstalk:DescribeConfigurationSettings",
          "elasticbeanstalk:DescribeInstancesHealth",
          "elasticbeanstalk:ListTagsForResource",
        ]
        Resource = "*"
      },
      {
        Sid      = "ElasticBeanstalkStorage"
        Effect   = "Allow"
        Action   = ["s3:PutObject", "s3:GetObject", "s3:ListBucket"]
        Resource = [aws_s3_bucket.eb_storage.arn, "${aws_s3_bucket.eb_storage.arn}/*"]
      },
      {
        Sid      = "FrontendBucketDeploy"
        Effect   = "Allow"
        Action   = ["s3:PutObject", "s3:GetObject", "s3:ListBucket", "s3:DeleteObject"]
        Resource = [aws_s3_bucket.frontend.arn, "${aws_s3_bucket.frontend.arn}/*"]
      },
      {
        Sid      = "CloudFrontInvalidate"
        Effect   = "Allow"
        Action   = ["cloudfront:CreateInvalidation", "cloudfront:GetInvalidation"]
        Resource = aws_cloudfront_distribution.frontend.arn
      },
    ]
  })
}
