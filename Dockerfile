# Multi-stage build for optimized production image

# Stage 1: Build the application
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies (including devDependencies for build)
# Check if package-lock.json exists and is valid, otherwise use npm install
RUN if [ -f package-lock.json ] && [ -s package-lock.json ]; then \
      echo "Using npm ci with package-lock.json"; \
      npm ci && npm cache clean --force; \
    else \
      echo "Warning: package-lock.json not found or empty, using npm install"; \
      npm install && npm cache clean --force; \
    fi

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production - Serve with Node.js
FROM node:20-alpine

# Install serve package globally for serving static files
RUN npm install -g serve

# Set working directory
WORKDIR /app

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Expose port 5173
EXPOSE 5173

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:5173/ || exit 1

# Serve the application
# -s flag for single page application support
# -l 5173 to listen on port 5173
CMD ["serve", "-s", "dist", "-l", "5173"]

