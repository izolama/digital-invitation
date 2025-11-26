#!/bin/bash

echo "Deploying..."
echo "Stopping containers..."
docker-compose down
echo "Building..."
docker-compose build --no-cache
echo "Starting containers..."
docker-compose up -d
echo "Showing containers..."
docker ps
echo "Showing logs frontend and backend..."
docker logs -f digital-invitation-frontend digital-invitation-backend