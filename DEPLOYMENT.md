# Docker Deployment Guide

Complete guide for deploying Digital Invitation using Docker and Docker Compose.

## 📋 Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)
- 1GB RAM minimum
- 1GB disk space

## 🚀 Quick Start

### Development/Testing Deployment

1. **Build and run the container:**
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

## 🌐 Reverse Proxy Setup (Optional)

If you want to use a reverse proxy like Traefik or Nginx Proxy Manager:

### Example with Traefik

Add labels to `docker-compose.yml`:
```yaml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.invitation.rule=Host(`yourdomain.com`)"
  - "traefik.http.routers.invitation.entrypoints=websecure"
  - "traefik.http.routers.invitation.tls.certresolver=letsencrypt"
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

