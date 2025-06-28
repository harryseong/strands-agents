# Create the Bedrock Knowledge Base with Pinecone as the vector DB
resource "aws_bedrockagent_knowledge_base" "kb" {
  name        = var.bedrock_kb_name
  description = "KB for ${var.bedrock_kb_name} using Pinecone as vector DB"
  role_arn    = aws_iam_role.bedrock_kb_role.arn

  knowledge_base_configuration {
    type = "VECTOR"

    vector_knowledge_base_configuration {
      embedding_model_arn = var.embedding_model_arn

      embedding_model_configuration {
        bedrock_embedding_model_configuration {
          dimensions          = var.pinecone_dimension
          embedding_data_type = var.embedding_data_type
        }
      }
    }
  }

  storage_configuration {
    type = "PINECONE"

    pinecone_configuration {
      connection_string      = var.pinecone_connection_string
      credentials_secret_arn = var.pinecone_secret_arn

      field_mapping {
        text_field     = var.field_text
        metadata_field = var.field_metadata
      }
    }
  }
}

resource "aws_bedrockagent_data_source" "s3_source" {
  name              = "${var.bedrock_kb_name}-s3-source"
  description       = "S3 source for knowledge base"
  knowledge_base_id = aws_bedrockagent_knowledge_base.kb.id

  data_deletion_policy = "DELETE"

  data_source_configuration {
    type = "S3"
    s3_configuration {
      bucket_arn         = aws_s3_bucket.bedrock_kb_docs.arn
      inclusion_prefixes = length(var.s3_inclusion_prefixes) > 0 ? var.s3_inclusion_prefixes : null
    }
  }

  vector_ingestion_configuration {
    chunking_configuration {
      chunking_strategy = "HIERARCHICAL" # FIXED_SIZE | HIERARCHICAL | SEMANTIC | NONE

      #   fixed_size_chunking_configuration {
      #     max_tokens         = 300 # Minimum of 20, maximum of 8192
      #     overlap_percentage = 10  # Typical overlap is around 10% - 20%
      #   }

      hierarchical_chunking_configuration {
        level_configuration {
          max_tokens = 1500 # Min of 1. Max of 8192.
        }

        level_configuration {
          max_tokens = 300 # Min of 1. Max of 8192.
        }

        overlap_tokens = 60 # Min of 1
      }
    }
  }

  depends_on = [aws_bedrockagent_knowledge_base.kb]
}
