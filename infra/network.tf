# Uses the account's default VPC to keep this simple. If you outgrow this,
# swap these data sources for a purpose-built VPC module.

data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

locals {
  name = "${var.project_name}-${var.environment}"
}

resource "aws_security_group" "eb_instances" {
  name        = "${local.name}-eb"
  description = "Elastic Beanstalk backend instance(s)"
  vpc_id      = data.aws_vpc.default.id

  # CloudFront and the internet reach the app over HTTP; the instance has
  # no ELB in front of it (SingleInstance environment tier).
  ingress {
    description = "HTTP from anywhere (fronted by CloudFront for the real domain)"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name    = "${local.name}-eb"
    Project = var.project_name
  }
}

resource "aws_security_group" "rds" {
  name        = "${local.name}-rds"
  description = "Postgres access for the Elastic Beanstalk backend only"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description     = "Postgres from EB instances"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.eb_instances.id]
  }

  ingress {
    description = "Postgres from admin workstation (Kiveshan)"
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["41.121.162.116/32"]
  }

  ingress {
    description = "Postgres from anywhere"
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name    = "${local.name}-rds"
    Project = var.project_name
  }
}
