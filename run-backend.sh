#!/bin/bash

# Run Backend Only (Local)

echo "🚀 Starting Backend (Local)"
echo "==========================="
echo ""

# Check backend .env
if [ ! -f "backend/.env" ]; then
    echo "⚠️  backend/.env not found"
    if [ -f "backend/.env.example" ]; then
        echo "Creating from template..."
        cp backend/.env.example backend/.env
    else
        echo "❌ backend/.env.example not found"
        exit 1
    fi
fi

# Install dependencies if needed
if [ ! -d "backend/node_modules" ]; then
    echo "Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

# Start backend
echo "Starting backend on http://localhost:5001"
echo ""
cd backend
npm run dev

