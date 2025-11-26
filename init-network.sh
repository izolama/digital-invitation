#!/bin/bash
# Script to initialize shared network for Docker Compose

NETWORK_NAME="shared-network"

# Check if network exists
if ! docker network inspect $NETWORK_NAME >/dev/null 2>&1; then
    echo "Creating $NETWORK_NAME network..."
    docker network create $NETWORK_NAME
    echo "✓ Network $NETWORK_NAME created successfully"
else
    echo "✓ Network $NETWORK_NAME already exists"
fi

echo ""
echo "You can now run:"
echo "  docker-compose up -d"

