#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status

IMAGE_NAME="test-strands-agent:latest"
ECR_REPO="552566233886.dkr.ecr.us-east-1.amazonaws.com/strands-agents:latest"

echo "Building Docker image: $IMAGE_NAME ..."
docker buildx build --platform linux/amd64 --provenance=false -t $IMAGE_NAME .

echo "Tagging image '$IMAGE_NAME' as '$ECR_REPO' ..."
docker tag $IMAGE_NAME $ECR_REPO

echo "Pushing image to ECR repository: $ECR_REPO ..."
docker push $ECR_REPO

echo "✅ Docker image successfully built, tagged, and pushed to ECR: $ECR_REPO"
