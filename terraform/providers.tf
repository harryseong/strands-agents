provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Automation    = "Terraform"
      AutomationKey = "strands_ai_agents"
    }
  }
}

