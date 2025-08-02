import json
import os
import boto3
from botocore.exceptions import ClientError


def handler(event, context):
    """
    Test Strands Agent Lambda function handler
    """
    try:
        # Get environment variables
        bedrock_kb_id = os.environ.get('BEDROCK_KB_ID')
        secret_id = os.environ.get('BEDROCK_API_KEY_SECRET_ID')
        model_arn = os.environ.get('BEDROCK_MODEL_ARN')
        
        if not bedrock_kb_id or not secret_id or not model_arn:
            return {
                'statusCode': 400,
                'body': json.dumps({
                    'error': 'Missing required environment variables'
                })
            }
        
        # Initialize AWS clients
        secrets_client = boto3.client('secretsmanager')
        bedrock_client = boto3.client('bedrock-agent-runtime')
        
        # Retrieve API key from Secrets Manager
        try:
            secret_response = secrets_client.get_secret_value(SecretId=secret_id)
            api_key = secret_response['SecretString']
        except ClientError as e:
            return {
                'statusCode': 500,
                'body': json.dumps({
                    'error': f'Failed to retrieve secret: {str(e)}'
                })
            }
        
        # Test query to Bedrock Knowledge Base
        query = event.get('query', 'Hello, what can you help me with?')
        
        try:
            kb_response = bedrock_client.retrieve_and_generate(
                input={
                    'text': query
                },
                retrieveAndGenerateConfiguration={
                    'type': 'KNOWLEDGE_BASE',
                    'knowledgeBaseConfiguration': {
                        'knowledgeBaseId': bedrock_kb_id,
                        'modelArn': f'arn:aws:bedrock:us-east-1::foundation-model/{model_arn}'
                    }
                }
            )
            
            return {
                'statusCode': 200,
                'body': json.dumps({
                    'message': 'Test Strands Agent is working!',
                    'query': query,
                    'response': kb_response.get('output', {}).get('text', 'No response'),
                    'bedrock_kb_id': bedrock_kb_id,
                    'secret_retrieved': True
                })
            }
            
        except ClientError as e:
            return {
                'statusCode': 500,
                'body': json.dumps({
                    'error': f'Failed to query Bedrock KB: {str(e)}'
                })
            }
            
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': f'Unexpected error: {str(e)}'
            })
        }