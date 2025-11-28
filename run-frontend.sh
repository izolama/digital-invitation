#!/bin/bash

# Run Frontend Only (Local)

echo "🚀 Starting Frontend (Local)"
echo "============================="
echo ""

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

# Start frontend
echo "Starting frontend on http://localhost:5173"
echo ""
npm run dev

