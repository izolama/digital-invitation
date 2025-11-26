#!/bin/bash

# Backend Environment Setup Script

echo "🔧 Setting up Backend Environment"
echo "================================="
echo ""

# Check if .env already exists
if [ -f .env ]; then
    echo "⚠️  .env file already exists"
    echo "Do you want to overwrite it? (y/N)"
    read -r response
    if [[ ! "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        echo "Keeping existing .env file"
        exit 0
    fi
fi

# Copy from example
cp .env.example .env

echo "✓ Created .env file from template"
echo ""

# Generate JWT secret
if command -v openssl &> /dev/null; then
    JWT_SECRET=$(openssl rand -hex 32)
    # Update JWT_SECRET in .env file (works on both Linux and Mac)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/JWT_SECRET=.*/JWT_SECRET=$JWT_SECRET/" .env
    else
        sed -i "s/JWT_SECRET=.*/JWT_SECRET=$JWT_SECRET/" .env
    fi
    echo "✓ Generated secure JWT_SECRET"
else
    echo "⚠️  OpenSSL not found. Please manually update JWT_SECRET in .env"
fi

echo ""
echo "📝 Current configuration:"
cat .env | grep -v "^#" | grep -v "^$"

echo ""
echo "✅ Environment setup complete!"
echo ""
echo "Next steps:"
echo "1. Review .env file and update if needed"
echo "2. Ensure database is setup (run: cd ../database && ./connect-existing.sh)"
echo "3. Install dependencies: npm install"
echo "4. Start server: npm run dev"
echo ""

