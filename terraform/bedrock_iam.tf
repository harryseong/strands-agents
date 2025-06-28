# IAM Role that allows Bedrock to access Pinecone and other resources
resource "aws_iam_role" "bedrock_kb_role" {
  name = "${var.bedrock_kb_name}-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Service = "bedrock.amazonaws.com"
      }
      Action = "sts:AssumeRole"
      Condition = {
        StringEquals = {
          "aws:SourceAccount" = data.aws_caller_identity.current.account_id
        }
        ArnLike = {
          "AWS:SourceArn" = "arn:aws:bedrock:${var.aws_region}:${data.aws_caller_identity.current.account_id}:knowledge-base/*"
        }
      }
    }]
  })
}

# Inline policy for Bedrock KB role
resource "aws_iam_role_policy" "bedrock_kb_policy" {
  name = "${var.bedrock_kb_name}-policy"
  role = aws_iam_role.bedrock_kb_role.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Sid    = "BedrockModelAccess",
        Effect = "Allow",
        Action = [
          "bedrock:ListFoundationModels",
          "bedrock:InvokeModel"
        ],
        Resource = "*"
      },
      {
        Sid    = "SecretsManagerAccess",
        Effect = "Allow",
        Action = [
          "secretsmanager:GetSecretValue"
        ],
        Resource = var.pinecone_secret_arn
      },
      {
        Sid    = "S3BucketAccess",
        Effect = "Allow",
        Action = [
          "s3:GetObject",
          "s3:ListBucket"
        ],
        Resource = [
          aws_s3_bucket.bedrock_kb_docs.arn,
          "${aws_s3_bucket.bedrock_kb_docs.arn}/*"
        ]
      }
    ]
  })
}
