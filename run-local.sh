#!/bin/bash

# Run Backend and Frontend Locally
# This script starts both services in development mode

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "🚀 Starting Digital Invitation (Local Development)"
echo "================================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js first: https://nodejs.org/"
    exit 1
fi

# Check if PostgreSQL is accessible
echo "1. Checking PostgreSQL connection..."
if command -v psql &> /dev/null; then
    PGPASSWORD=ShaninHanan23 psql -h localhost -U postgres -d digital_invitation -c "SELECT 1;" > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo -e "   ${GREEN}✅ Database connection OK${NC}"
    else
        echo -e "   ${YELLOW}⚠️  Database connection failed${NC}"
        echo "   Make sure PostgreSQL is running and accessible"
    fi
else
    echo -e "   ${YELLOW}⚠️  psql not found, skipping database check${NC}"
fi
echo ""

# Check backend .env
echo "2. Checking backend .env..."
if [ ! -f "backend/.env" ]; then
    echo -e "   ${YELLOW}⚠️  backend/.env not found${NC}"
    echo "   Creating from template..."
    if [ -f "backend/.env.example" ]; then
        cp backend/.env.example backend/.env
        echo -e "   ${GREEN}✅ Created backend/.env${NC}"
    else
        echo -e "   ${RED}❌ backend/.env.example not found${NC}"
        echo "   Please create backend/.env manually"
    fi
else
    echo -e "   ${GREEN}✅ backend/.env exists${NC}"
fi
echo ""

# Install dependencies
echo "3. Installing dependencies..."
echo "   Backend..."
if [ ! -d "backend/node_modules" ]; then
    cd backend && npm install && cd ..
    echo -e "   ${GREEN}✅ Backend dependencies installed${NC}"
else
    echo -e "   ${GREEN}✅ Backend dependencies already installed${NC}"
fi

echo "   Frontend..."
if [ ! -d "node_modules" ]; then
    npm install
    echo -e "   ${GREEN}✅ Frontend dependencies installed${NC}"
else
    echo -e "   ${GREEN}✅ Frontend dependencies already installed${NC}"
fi
echo ""

# Start services
echo "4. Starting services..."
echo ""
echo -e "${GREEN}Starting Backend on http://localhost:5001${NC}"
echo -e "${GREEN}Starting Frontend on http://localhost:5173${NC}"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Stopping services..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start backend
cd backend
npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 2

# Start frontend
npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!

# Wait for both to start
sleep 3

echo ""
echo -e "${GREEN}✅ Services started!${NC}"
echo ""
echo "Backend: http://localhost:5001"
echo "Frontend: http://localhost:5173"
echo ""
echo "Logs:"
echo "  Backend: tail -f backend.log"
echo "  Frontend: tail -f frontend.log"
echo ""

# Wait for processes
wait

