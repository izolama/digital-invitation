# Makefile for Digital Invitation Docker Management
.PHONY: help build up down restart logs clean dev prod rebuild

# Default target
help:
	@echo "Digital Invitation - Docker Management"
	@echo ""
	@echo "Available commands:"
	@echo "  make dev          - Start development environment (port 8080)"
	@echo "  make prod         - Start production environment (port 80)"
	@echo "  make build        - Build Docker images"
	@echo "  make rebuild      - Rebuild images without cache"
	@echo "  make up           - Start containers (development)"
	@echo "  make down         - Stop and remove containers"
	@echo "  make restart      - Restart containers"
	@echo "  make logs         - Show container logs"
	@echo "  make status       - Show container status"
	@echo "  make shell        - Open shell in running container"
	@echo "  make clean        - Remove containers, images, and volumes"
	@echo "  make health       - Check application health"
	@echo "  make prune        - Clean up unused Docker resources"

# Development environment
dev: init-network
	@echo "Starting development environment..."
	docker-compose up -d
	@echo "Application running at http://localhost:5173"

# Initialize shared network
init-network:
	@echo "Checking shared network..."
	@docker network inspect shared-network >/dev/null 2>&1 || \
		(docker network create shared-network && echo "✓ Network created") || \
		echo "✓ Network exists"

# Production environment
prod: init-network
	@echo "Starting production environment..."
	docker-compose -f docker-compose.prod.yml up -d
	@echo "Application running at http://localhost:80"

# Build images
build:
	@echo "Building Docker images..."
	docker-compose build

# Rebuild without cache
rebuild:
	@echo "Rebuilding Docker images without cache..."
	docker-compose build --no-cache

# Start containers
up:
	docker-compose up -d

# Stop containers
down:
	@echo "Stopping containers..."
	docker-compose down
	docker-compose -f docker-compose.prod.yml down 2>/dev/null || true

# Restart containers
restart:
	@echo "Restarting containers..."
	docker-compose restart

# Show logs
logs:
	docker-compose logs -f

# Show status
status:
	docker-compose ps

# Open shell
shell:
	docker exec -it digital-invitation-app sh

# Health check
health:
	@echo "Checking application health..."
	@curl -f http://localhost:8080/health 2>/dev/null && echo "✓ Application is healthy" || echo "✗ Application is not responding"

# Clean up
clean:
	@echo "Cleaning up Docker resources..."
	docker-compose down -v
	docker-compose -f docker-compose.prod.yml down -v 2>/dev/null || true
	docker rmi digital-invitation-digital-invitation 2>/dev/null || true
	@echo "Cleanup complete"

# Prune unused resources
prune:
	@echo "Removing unused Docker resources..."
	docker system prune -af --volumes
	@echo "Prune complete"

# Update and deploy
update:
	@echo "Updating and redeploying..."
	git pull
	docker-compose build
	docker-compose up -d
	@echo "Update complete"

