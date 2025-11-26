# Architecture Note

## Serving Static Files

This project uses **Node.js with `serve` package** instead of Nginx for serving static files.

### Why not Nginx?

- **Simplicity**: No need for Nginx configuration files
- **Smaller setup**: Just Node.js + serve package
- **SPA support**: Built-in support for Single Page Applications
- **Easy to understand**: Simple command line configuration
- **Sufficient for most use cases**: Handles compression, SPA routing, and static file serving

### Files Not Used

The following files exist in the repository but are **NOT used** in the current Docker setup:

- `nginx.conf` - Not used (kept for reference)
- `nginx.prod.conf` - Not used (kept for reference)

These files are kept in the repository for users who prefer Nginx or need advanced web server features.

### How It Works

The application is served using:
```bash
serve -s dist -l 5173
```

Where:
- `-s` flag enables Single Page Application mode (all routes return index.html)
- `dist` is the directory containing built static files
- `-l 5173` makes it listen on port 5173 inside the container

### If You Want to Use Nginx

If you prefer Nginx, you can modify the Dockerfile:

1. Change stage 2 to use `nginx:alpine` image
2. Copy nginx.conf to the container
3. Copy built files to `/usr/share/nginx/html`
4. Update health check to use curl

See git history or nginx config files for reference.

---

**Current Setup:** Node.js 20 Alpine + `serve` package  
**Container Internal Port:** 5173  
**External Port Mapping:** 
  - Development: `5173:5173`
  - Production: `80:5173`
**Health Check:** `wget http://localhost:5173/`

