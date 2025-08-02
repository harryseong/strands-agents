resource "aws_secretsmanager_secret" "bedrock_api_key" {
  name = "bedrock/apikey"
}
