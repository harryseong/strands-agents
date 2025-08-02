aws_region = "us-east-1"

s3_bucket_name        = "bedrock-kb-docs"
s3_inclusion_prefixes = ["welcome-to-singapore/"]

bedrock_kb_name            = "welcome-to-singapore-kb"
pinecone_connection_string = "https://bedrock-kb-welcome-to-singapore-pzdoe1a.svc.aped-4627-b74a.pinecone.io"
pinecone_secret_arn        = "arn:aws:secretsmanager:us-east-1:552566233886:secret:pinecone/apikey-3eLOJj"
pinecone_dimension         = 1024
embedding_model_arn        = "arn:aws:bedrock:us-east-1::foundation-model/amazon.titan-embed-text-v2:0"
embedding_data_type        = "FLOAT32"
field_text                 = "AMAZON_BEDROCK_TEXT"
field_metadata             = "AMAZON_BEDROCK_METADATA"
bedrock_model_arn          = "anthropic.claude-3-5-sonnet-20240620-v1:0"
