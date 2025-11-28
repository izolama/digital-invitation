#!/bin/bash

# Create .env file for backend

BACKEND_ENV="backend/.env"
EXAMPLE="backend/.env.example"

echo "📝 Creating Backend .env File"
echo "=============================="
echo ""

# Check if .env already exists
if [ -f "$BACKEND_ENV" ]; then
    echo "⚠️  $BACKEND_ENV already exists!"
    read -p "Overwrite? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Cancelled."
        exit 0
    fi
fi

# Check if .env.example exists
if [ ! -f "$EXAMPLE" ]; then
    echo "❌ $EXAMPLE not found!"
    echo "Creating from template..."
    
    cat > "$EXAMPLE" << 'EOF'
# Backend Environment Variables
NODE_ENV=production
PORT=5001

# Database Configuration
DB_HOST=host.docker.internal
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=ShaninHanan23
DB_NAME=digital_invitation

# JWT Configuration
JWT_SECRET=change-this-in-production-use-at-least-32-characters-minimum
JWT_EXPIRES_IN=24h

# CORS Configuration
CORS_ORIGIN=https://digital-invitation.nahsbyte.my.id,http://digital-invitation.nahsbyte.my.id,http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:3000,http://localhost:5001

# Rate Limiting
ENABLE_RATE_LIMIT=false
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
EOF
fi

# Copy example to .env
cp "$EXAMPLE" "$BACKEND_ENV"

echo "✅ Created $BACKEND_ENV from $EXAMPLE"
echo ""
echo "📝 Next steps:"
echo "  1. Edit $BACKEND_ENV with your values"
echo "  2. Generate secure JWT_SECRET:"
echo "     openssl rand -base64 32"
echo "  3. Update DB_PASSWORD if needed"
echo "  4. Update CORS_ORIGIN with your domains"
echo ""
echo "File location: $BACKEND_ENV"

