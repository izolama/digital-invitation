# Docker Deployment Guide

Complete guide for deploying Digital Invitation using Docker and Docker Compose.

## 📋 Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)
- 1GB RAM minimum
- 1GB disk space
- Node.js 20+ (for local development, Docker handles this automatically)

## 🚀 Quick Start

### Development/Testing Deployment

1. **Create shared network (first time only):**
```bash
# Create the shared network for inter-container communication
docker network create shared-network

# Or use the helper script
chmod +x init-network.sh
./init-network.sh
```

2. **Build and run the container:**
```bash
docker-compose up -d
```

2. **Access the application:**
- Open your browser and navigate to `http://localhost:8080`

3. **View logs:**
```bash
docker-compose logs -f
```

4. **Stop the container:**
```bash
docker-compose down
```

## 🏭 Production Deployment

### Using Production Compose File

1. **Configure your domain:**
Edit `nginx.prod.conf` and replace `yourdomain.com` with your actual domain.

2. **Build and run:**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

3. **Access the application:**
- HTTP: `http://yourdomain.com`
- The application will be available on port 80

### SSL/HTTPS Configuration (Recommended for Production)

1. **Obtain SSL Certificate:**
You can use Let's Encrypt, Certbot, or your certificate provider.

2. **Create SSL directory:**
```bash
mkdir -p ssl
```

3. **Copy your certificates:**
```bash
cp /path/to/your/fullchain.pem ./ssl/cert.pem
cp /path/to/your/privkey.pem ./ssl/key.pem
```

4. **Uncomment SSL lines in `docker-compose.prod.yml`:**
```yaml
volumes:
  - ./ssl/cert.pem:/etc/nginx/ssl/cert.pem:ro
  - ./ssl/key.pem:/etc/nginx/ssl/key.pem:ro
```

5. **Uncomment HTTPS server block in `nginx.prod.conf`**

6. **Restart the container:**
```bash
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d
```

## 🔧 Docker Commands Reference

### Build Commands
```bash
# Build the image
docker-compose build

# Build without cache
docker-compose build --no-cache

# Pull latest base images and build
docker-compose build --pull
```

### Container Management
```bash
# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# Restart containers
docker-compose restart

# View container status
docker-compose ps

# View logs
docker-compose logs -f digital-invitation
```

### Maintenance
```bash
# Remove unused images
docker image prune -a

# View container resource usage
docker stats digital-invitation-app

# Execute command in running container
docker exec -it digital-invitation-app sh

# Inspect container
docker inspect digital-invitation-app
```

## 📊 Health Checks

The application includes built-in health checks:

```bash
# Check application health
curl http://localhost:8080/health

# Check with Docker
docker inspect --format='{{.State.Health.Status}}' digital-invitation-app
```

## 🔍 Troubleshooting

### Node version error (EBADENGINE)
**Error:** `Unsupported engine { package: 'react-router-dom@7.9.6', required: { node: '>=20.0.0' }`

**Solution:** The Dockerfile has been updated to use Node.js 20. Rebuild the image:
```bash
docker-compose build --no-cache
docker-compose up -d
```

### Shared network not found
**Error:** `network shared-network declared as external, but could not be found`

**Solution:** Create the network first:
```bash
docker network create shared-network
# or
make init-network
# or
./init-network.sh
```

### Container won't start
```bash
# Check logs
docker-compose logs digital-invitation

# Check if port is already in use
sudo netstat -tlnp | grep :8080

# Remove and recreate
docker-compose down -v
docker-compose up -d
```

### Build failures
```bash
# Clear Docker cache
docker system prune -a

# Rebuild from scratch
docker-compose build --no-cache
```

### Permission issues
```bash
# Fix file permissions
sudo chown -R $USER:$USER .

# Fix Docker socket permissions
sudo chmod 666 /var/run/docker.sock
```

### Port already in use
```bash
# Find what's using the port
sudo lsof -i :8080

# Kill the process or change port in docker-compose.yml
# Change "8080:80" to "8081:80" for example
```

## 🌐 Shared Network

This project uses an external Docker network called `shared-network` to allow communication with other containers (e.g., reverse proxies, databases, etc.).

### Network Configuration

The `shared-network` is configured as an external network in both `docker-compose.yml` and `docker-compose.prod.yml`:

```yaml
networks:
  shared-network:
    external: true
```

### Creating the Network

**Manual creation:**
```bash
docker network create shared-network
```

**Using helper script:**
```bash
chmod +x init-network.sh
./init-network.sh
```

**Using Makefile:**
```bash
make init-network
```

### Why External Network?

External networks allow multiple Docker Compose projects to communicate:
- **Reverse Proxy**: Connect with Traefik, Nginx Proxy Manager, or Caddy
- **Monitoring**: Connect with monitoring tools like Prometheus/Grafana
- **Other Services**: Connect with other microservices or databases
- **Isolation**: Keep services separate but allow controlled communication

### Checking Network

```bash
# List all networks
docker network ls

# Inspect shared-network
docker network inspect shared-network

# See connected containers
docker network inspect shared-network | grep Name
```

## 🔀 Reverse Proxy Setup

### Example with Traefik

Add labels to `docker-compose.yml`:
```yaml
labels:
  - "traefik.enable=true"
  - "traefik.docker.network=shared-network"
  - "traefik.http.routers.invitation.rule=Host(`yourdomain.com`)"
  - "traefik.http.routers.invitation.entrypoints=websecure"
  - "traefik.http.routers.invitation.tls.certresolver=letsencrypt"
  - "traefik.http.services.invitation.loadbalancer.server.port=80"
```

### Example with Nginx Proxy Manager

1. Both NPM and this app must use `shared-network`
2. In NPM, add a new proxy host:
   - Domain: `yourdomain.com`
   - Forward Hostname: `digital-invitation-app`
   - Forward Port: `80`
   - Enable SSL if needed

### Example with Caddy

Caddyfile:
```
yourdomain.com {
    reverse_proxy digital-invitation-app:80
}
```

## 📈 Performance Optimization

### Image Size Optimization
- Current image size: ~50MB (with Alpine Linux)
- Multi-stage build reduces final image size
- Only production dependencies included

### Nginx Optimizations
- Gzip compression enabled
- Static asset caching (1 year for immutable assets)
- HTTP/2 support (when using HTTPS)
- Security headers configured

### Resource Limits (Optional)
Add to `docker-compose.yml`:
```yaml
deploy:
  resources:
    limits:
      cpus: '0.5'
      memory: 512M
    reservations:
      memory: 256M
```

## 🔐 Security Best Practices

1. **Use specific version tags** instead of `latest`
2. **Run as non-root user** (Nginx Alpine already does this)
3. **Keep base images updated**
```bash
docker-compose pull
docker-compose up -d
```
4. **Scan for vulnerabilities**
```bash
docker scan digital-invitation:latest
```
5. **Use secrets for sensitive data** (if you add backend/database)

## 🚢 CI/CD Integration

### GitHub Actions Example
```yaml
name: Build and Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker image
        run: docker-compose build
      
      - name: Deploy to server
        run: |
          docker save digital-invitation | gzip > app.tar.gz
          scp app.tar.gz user@yourserver:/tmp/
          ssh user@yourserver 'docker load < /tmp/app.tar.gz && cd /app && docker-compose up -d'
```

## 📝 Environment Variables

The application uses configuration from `src/config/config.js`. If you need to override during build:

1. Create `.env` file:
```env
NODE_ENV=production
```

2. Reference in docker-compose.yml (already configured)

## 🔄 Updates and Rollbacks

### Update to new version
```bash
git pull
docker-compose build
docker-compose up -d
```

### Rollback to previous version
```bash
docker-compose down
docker pull your-previous-image:tag
docker-compose up -d
```

## 📞 Support

For issues related to:
- **Docker setup**: Check this guide
- **Application features**: See main README.md
- **Nginx configuration**: Check nginx.conf comments

---

**Happy Deploying! 🚀**

