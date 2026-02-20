#!/usr/bin/env bash
set -euo pipefail

# config 
AWS_REGION="us-east-1"
SSM_PATH="/brain-cache/prod/web/"
CONTAINER_NAME="brain-cache-web"
IMAGE_URI="${IMAGE_URI:?IMAGE_URI not set}"
PORT_MAPPING="3000:3000"

echo "Starting deployment for $CONTAINER_NAME..."

# pull latest image
echo "Pulling latest image..."
docker pull "$IMAGE_URI"

# stop and remove existing container
if docker ps -a --format '{{.Names}}' | grep -Eq "^${CONTAINER_NAME}\$"; then
  echo "Stopping existing container..."
  docker stop "$CONTAINER_NAME" || true
  echo "Removing existing container..."
  docker rm "$CONTAINER_NAME" || true
fi

# fetch secrets from ssm
echo "Fetching secrets from SSM..."

PARAMS=$(aws ssm get-parameters-by-path \
  --region "$AWS_REGION" \
  --path "$SSM_PATH" \
  --with-decryption \
  --query "Parameters[*].[Name,Value]" \
  --output text)

ENV_ARGS=""

# format secrets into key value pairs
while read -r NAME VALUE; do
  KEY=$(basename "$NAME")
  ENV_ARGS="$ENV_ARGS -e $KEY=\"$VALUE\""
done <<< "$PARAMS"

# run container
echo "Starting new container..."

eval docker run -d \
  --name "$CONTAINER_NAME" \
  --restart unless-stopped \
  -p "$PORT_MAPPING" \
  $ENV_ARGS \
  "$IMAGE_URI"

echo "Deployment completed successfully."
