FROM public.ecr.aws/lambda/python:3.12

# Set workdir explicitly (optional, but improves clarity)
WORKDIR ${LAMBDA_TASK_ROOT}

# Copy and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy your Lambda function code
COPY agent.py .

# (Optional) Create a writable directory in /tmp, if needed in your app
# RUN mkdir -p /tmp/repl_state

# Define the Lambda handler
CMD [ "agent.handler" ]
