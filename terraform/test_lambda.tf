# Test Strands Agent Lambda Function
resource "aws_lambda_function" "test_lambda" {
  filename      = "test_lambda.zip"
  function_name = "test-strands-agent"
  role          = aws_iam_role.test_lambda_role.arn
  handler       = "test-strands-agent.handler"
  runtime       = "python3.13"
  timeout       = 30
  memory_size   = 256

  source_code_hash = data.archive_file.test_lambda_zip.output_base64sha256

  environment {
    variables = {
      BEDROCK_KB_ID             = aws_bedrockagent_knowledge_base.kb.id
      BEDROCK_API_KEY_SECRET_ID = aws_secretsmanager_secret.bedrock_api_key.id
      BEDROCK_MODEL_ARN         = var.bedrock_model_arn
    }
  }

  tags = {
    Name        = "test-strands-agent"
    Environment = "development"
  }
}

# IAM role for the Lambda function
resource "aws_iam_role" "test_lambda_role" {
  name = "test-strands-agent-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name = "test-strands-agent-role"
  }
}

# Attach basic execution policy to the role
resource "aws_iam_role_policy_attachment" "test_lambda_basic" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
  role       = aws_iam_role.test_lambda_role.name
}

# IAM policy for Secrets Manager and Bedrock access
resource "aws_iam_role_policy" "test_lambda_permissions" {
  name = "test-strands-agent-permissions"
  role = aws_iam_role.test_lambda_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue"
        ]
        Resource = aws_secretsmanager_secret.bedrock_api_key.arn
      },
      {
        Effect = "Allow"
        Action = [
          "bedrock:Retrieve",
          "bedrock:RetrieveAndGenerate",
          "bedrock:Query"
        ]
        Resource = aws_bedrockagent_knowledge_base.kb.arn
      },
      {
        Effect = "Allow"
        Action = [
          "bedrock:InvokeModel"
        ]
        Resource = "arn:aws:bedrock:${var.aws_region}::foundation-model/${var.bedrock_model_arn}"
      }
    ]
  })
}

# Create a zip file for the Lambda function
data "archive_file" "test_lambda_zip" {
  type             = "zip"
  output_path      = "test_lambda.zip"
  source_file      = "${path.module}/test-strands-agent.py"
  output_file_mode = "0666"
}

# CloudWatch Log Group for the Lambda function
resource "aws_cloudwatch_log_group" "test_lambda_logs" {
  name              = "/aws/lambda/test-strands-agent"
  retention_in_days = 7

  tags = {
    Name = "test-strands-agent-logs"
  }
}
