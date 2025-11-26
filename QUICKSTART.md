# Quick Start Guide

Fast deployment guide for getting your Digital Invitation up and running.

## 🚀 One-Line Deploy

```bash
# Create network and start application
docker network create shared-network 2>/dev/null || true && docker-compose up -d
```

That's it! Your application will be available at `http://localhost:5173`

---

## 📝 Step-by-Step (First Time)

### 1. Clone & Navigate
```bash
cd /var/www/digital-invitation
```

### 2. Configure Your Event
Edit `src/config/config.js` with your event details:
```bash
nano src/config/config.js
# or
vim src/config/config.js
```

### 3. Create Network
```bash
docker network create shared-network
```

### 4. Deploy
```bash
docker-compose up -d
```

### 5. Check Status
```bash
docker-compose ps
```

### 6. View Logs
```bash
docker-compose logs -f
```

### 7. Access Application
Open your browser: `http://your-server-ip:5173`

---

## 🔄 Updates & Maintenance

### Update Application
```bash
cd /var/www/digital-invitation
git pull
docker-compose build --no-cache
docker-compose up -d
```

### Restart
```bash
docker-compose restart
```

### Stop
```bash
docker-compose down
```

### View Logs
```bash
docker-compose logs -f
```

### Check Health
```bash
curl http://localhost:5173/health
```

---

## 🏭 Production Deployment

### For Production (Port 80)
```bash
docker network create shared-network 2>/dev/null || true
docker-compose -f docker-compose.prod.yml up -d
```

### With Custom Domain
1. Edit `nginx.prod.conf`:
```bash
nano nginx.prod.conf
# Change 'yourdomain.com' to your actual domain
```

2. Deploy:
```bash
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

---

## 🔧 Common Commands

```bash
# Stop everything
docker-compose down

# Rebuild and restart
docker-compose build && docker-compose up -d

# Remove everything (clean slate)
docker-compose down -v && docker system prune -f

# Check disk usage
docker system df

# Follow logs
docker-compose logs -f digital-invitation
```

---

## ⚡ Quick Fixes

### Node Version Error
```bash
docker-compose build --no-cache
```

### Network Not Found
```bash
docker network create shared-network
```

### Port Already in Use
```bash
# Check what's using the port
sudo lsof -i :5173

# Or change port in docker-compose.yml
nano docker-compose.yml
# Change "5173:80" to another port like "5174:80"
```

### Container Won't Start
```bash
docker-compose down -v
docker-compose up -d
docker-compose logs
```

---

## 📊 Monitoring

### Check Container Health
```bash
docker inspect digital-invitation-app | grep Health -A 10
```

### Resource Usage
```bash
docker stats digital-invitation-app
```

### Network Info
```bash
docker network inspect shared-network
```

---

## 🔐 Security Checklist

- [ ] Changed default configurations in `src/config/config.js`
- [ ] Set up firewall rules (allow only necessary ports)
- [ ] Configured HTTPS/SSL for production
- [ ] Regular updates: `docker-compose pull && docker-compose up -d`
- [ ] Monitor logs regularly: `docker-compose logs`
- [ ] Set up automatic backups of configuration

---

## 📞 Need Help?

- Full documentation: See [DEPLOYMENT.md](DEPLOYMENT.md)
- GitHub Issues: Report bugs and ask questions
- Docker logs: `docker-compose logs -f`

---

**Happy Deploying! 🎉**

