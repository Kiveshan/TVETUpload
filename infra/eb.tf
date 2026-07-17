data "aws_elastic_beanstalk_solution_stack" "node" {
  most_recent = true
  name_regex  = "^64bit Amazon Linux 2023.*Node\\.js 22.*$"
}

resource "aws_elastic_beanstalk_application" "this" {
  name        = var.project_name
  description = "TVETUpload backend (Express API)"
}

resource "aws_elastic_beanstalk_environment" "backend" {
  name                = "${local.name}-backend"
  application         = aws_elastic_beanstalk_application.this.name
  solution_stack_name = data.aws_elastic_beanstalk_solution_stack.node.name
  tier                = "WebServer"

  # Pinned explicitly (rather than read back from the resource) so its
  # domain is known before the environment is created — CloudFront's
  # backend origin needs that domain, and this env in turn needs
  # CloudFront's domain for FRONTEND_ORIGINS below. Referencing the
  # resource's own .cname attribute both ways would be a dependency cycle.
  # Must be globally unique within the region; if "elasticbeanstalk.CNAMEAlreadyExistsException"
  # comes back on apply, change project_name or environment.
  cname_prefix = "${local.name}-backend"

  # Single instance, no load balancer — cheapest option and enough for a
  # low-traffic app. Switch to "LoadBalanced" + add an ALB/ACM cert if you
  # need zero-downtime deploys or horizontal scaling later.
  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "EnvironmentType"
    value     = "SingleInstance"
  }

  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "ServiceRole"
    value     = aws_iam_role.eb_service.name
  }

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "IamInstanceProfile"
    value     = aws_iam_instance_profile.eb_instance.name
  }

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "InstanceType"
    value     = var.instance_type
  }

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "SecurityGroups"
    value     = aws_security_group.eb_instances.id
  }

  setting {
    namespace = "aws:ec2:vpc"
    name      = "VPCId"
    value     = data.aws_vpc.default.id
  }

  setting {
    namespace = "aws:ec2:vpc"
    name      = "Subnets"
    value     = join(",", data.aws_subnets.default.ids)
  }

  setting {
    namespace = "aws:ec2:vpc"
    name      = "AssociatePublicIpAddress"
    value     = "true"
  }

  setting {
    namespace = "aws:elasticbeanstalk:healthreporting:system"
    name      = "SystemType"
    value     = "enhanced"
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "NODE_ENV"
    value     = "production"
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "DATABASE_URL"
    value     = "postgresql://${var.db_username}:${var.db_password}@${aws_db_instance.this.address}:5432/${var.db_name}"
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "FRONTEND_ORIGINS"
    value     = "https://${aws_cloudfront_distribution.frontend.domain_name}"
  }

  tags = {
    Project = var.project_name
  }
}
