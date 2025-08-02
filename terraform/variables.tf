variable "aws_region" {
  type = string
}

variable "bedrock_kb_name" {
  type = string
}

variable "pinecone_connection_string" {
  type        = string
  description = "The connection string of the existing Pinecone index"
}

variable "pinecone_secret_arn" {
  type        = string
  description = "ARN of the AWS Secrets Manager secret holding Pinecone API key"
}

variable "pinecone_dimension" {
  type        = number
  description = "Dimension of your Pinecone index (must match the embedding model output)"
  validation {
    condition     = var.pinecone_dimension >= 0 && var.pinecone_dimension <= 4096
    error_message = "pinecone_dimension must be between 0 and 4096."
  }
}

variable "embedding_model_arn" {
  type = string
}

variable "embedding_data_type" {
  type        = string
  description = "Data type of the embedding output. Must be FLOAT32 or BINARY. (Pinecone does not support BINARY)"
  validation {
    condition     = var.embedding_data_type == "FLOAT32" || var.embedding_data_type == "BINARY"
    error_message = "embedding_data_type must be either 'FLOAT32' or 'BINARY'."
  }
  default = "FLOAT32"
}

variable "field_text" {
  type    = string
  default = "text"
}

variable "field_metadata" {
  type    = string
  default = "metadata"
}

variable "s3_bucket_name" {
  type        = string
  description = "Name of the S3 bucket to store KB documents"
}

variable "s3_inclusion_prefixes" {
  type        = list(string)
  description = "Prefixes (folders) inside the S3 bucket to include in KB ingestion"
  default     = []
}

variable "bedrock_model_arn" {
  type        = string
  description = "ARN of the Bedrock model to use for the Lambda function"
}
