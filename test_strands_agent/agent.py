import boto3
import os
from strands import Agent, tool
from strands.agent.conversation_manager import SlidingWindowConversationManager
from strands.models import BedrockModel
from strands_tools import calculator, current_time, retrieve
from typing import Dict, Any


DEFAULT_PROMPT = """
    I have 4 requests:
    1. What is the time right now?
    2. Calculate 3111696 / 74088
    3. Tell me how many letter R's are in the word "strawberry" 🍓
    """
    
SYSTEM_PROMPT = """
    You are a helpful assistant that can perform various tasks using tools.
    You can calculate mathematical expressions, tell the current time, and count letters in words.
    You will be provided with a message containing requests, and you should respond accordingly.
    You can also retrieve business information from a knowledge base using a query using the "business_information" tool.
    You can use the tools provided to fulfill the requests.
    You should always use the tools to confirm your answers before outputting them.
    """


REGION =  os.environ.get("REGION", "us-east-1")
BEDROCK_KB_ID = os.environ.get("BEDROCK_KB_ID", "HZLGLCLALZ")
MODEL_ID = os.environ.get("MODEL_ID", "anthropic.claude-3-5-sonnet-20240620-v1:0")

# Print environment variables for debugging purposes
print(f"REGION: {REGION}")
print(f"BEDROCK_KB_ID: {BEDROCK_KB_ID}")
print(f"MODEL_ID: {MODEL_ID}")  

# Define a custom tool as a Python function using the @tool decorator
@tool
def letter_counter(word: str, letter: str) -> int:
    """
    Count occurrences of a specific letter in a word.

    Args:
        word (str): The input word to search in
        letter (str): The specific letter to count

    Returns:
        int: The number of occurrences of the letter in the word
    """
    if not isinstance(word, str) or not isinstance(letter, str):
        return 0

    if len(letter) != 1:
        raise ValueError("The 'letter' parameter must be a single character")

    return word.lower().count(letter.lower())

@tool
def business_information(query: str) -> str:
    """
    Retrieve information from the Bedrock KB based on query text..

    Args:
        query (str): The query to search for

    Returns:
        str: The retrieved information
    """
    if not isinstance(query, str):
        return "Invalid query. Please provide a string."

    # Advanced search with custom parameters
    response = agent.tool.retrieve(
        text=query,
        numberOfResults=5,
        score=0.7,
        knowledgeBaseId=BEDROCK_KB_ID,
        region=REGION
    )
    
    if response:
        return response
    else:
        return "No information found for the given query."

# Create a BedrockModel
bedrock_model = BedrockModel(
    model_id=MODEL_ID,
    region_name=REGION,
    temperature=0.3,
)

# Create a conversation manager with custom window size
# By default, SlidingWindowConversationManager is used even if not specified
conversation_manager = SlidingWindowConversationManager(
    window_size=10,  # Maximum number of message pairs to keep
)

# Create an agent with tools from the strands-tools example tools package
# as well as our custom letter_counter tool
agent = Agent(
    conversation_manager=conversation_manager,
    max_parallel_tools=2,
    model=bedrock_model,
    system_prompt=SYSTEM_PROMPT,
    tools=[calculator, current_time, business_information, letter_counter]
    )

def handler(event: Dict[str, Any], _context) -> str:
    # Ask the agent a question that uses the available tools
    prompt = event.get("prompt", DEFAULT_PROMPT)
    response = agent(prompt)

    return {
        "statusCode": 200,
        "body": str(response)
    }