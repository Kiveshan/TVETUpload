# --- EC2 instance role: what the running app instance itself is allowed to do ---

resource "aws_iam_role" "eb_instance" {
  name = "${local.name}-eb-instance"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "ec2.amazonaws.com" }
      Action    = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "eb_instance_web_tier" {
  role       = aws_iam_role.eb_instance.name
  policy_arn = "arn:aws:iam::aws:policy/AWSElasticBeanstalkWebTier"
}

resource "aws_iam_role_policy_attachment" "eb_instance_ssm" {
  role       = aws_iam_role.eb_instance.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_instance_profile" "eb_instance" {
  name = "${local.name}-eb-instance"
  role = aws_iam_role.eb_instance.name
}

# --- Service role: what Elastic Beanstalk itself is allowed to do on your behalf ---

resource "aws_iam_role" "eb_service" {
  name = "${local.name}-eb-service"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "elasticbeanstalk.amazonaws.com" }
      Action    = "sts:AssumeRole"
      Condition = {
        StringEquals = { "sts:ExternalId" = "elasticbeanstalk" }
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "eb_service_health" {
  role       = aws_iam_role.eb_service.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSElasticBeanstalkEnhancedHealth"
}

resource "aws_iam_role_policy_attachment" "eb_service_updates" {
  role       = aws_iam_role.eb_service.name
  policy_arn = "arn:aws:iam::aws:policy/AWSElasticBeanstalkManagedUpdatesCustomerRolePolicy"
}
