resource "aws_s3_bucket" "bedrock_kb_docs" {
  bucket = "${var.s3_bucket_name}-${data.aws_caller_identity.current.account_id}"
}
