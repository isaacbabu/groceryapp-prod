#!/bin/bash
# ===========================================
# Grocery Shopping App - Quick Startup Guide
# ===========================================
# This script helps start the app quickly after a fresh container restart

echo "🚀 Starting Grocery Shopping App..."

# Step 1: Check MongoDB status
echo "📦 Checking MongoDB..."
if ! sudo supervisorctl status mongodb | grep -q "RUNNING"; then
    echo "Starting MongoDB..."
    sudo supervisorctl start mongodb
    sleep 2
fi

# Step 2: Install frontend dependencies if needed
echo "📦 Checking frontend dependencies..."
if [ ! -d "/app/frontend/node_modules" ] || [ ! -f "/app/frontend/node_modules/.yarn-integrity" ]; then
    echo "Installing frontend dependencies..."
    cd /app/frontend && yarn install
else
    echo "Frontend dependencies already installed ✓"
fi

# Step 3: Install backend dependencies if needed
echo "📦 Checking backend dependencies..."
cd /app/backend
pip install -r requirements.txt -q 2>/dev/null

# Step 4: Start services
echo "🔧 Starting services..."
sudo supervisorctl start backend frontend

# Step 5: Wait for compilation
echo "⏳ Waiting for frontend to compile..."
sleep 15

# Step 6: Seed database if empty
echo "🌱 Checking database..."
ITEMS_COUNT=$(curl -s http://localhost:8001/api/items 2>/dev/null | grep -o '"item_id"' | wc -l)
if [ "$ITEMS_COUNT" -eq 0 ]; then
    echo "Seeding database with sample items..."
    curl -s -X POST http://localhost:8001/api/seed-items
fi

# Step 7: Final status check
echo ""
echo "📊 Service Status:"
sudo supervisorctl status | grep -E "backend|frontend|mongodb"

echo ""
echo "✅ App is ready!"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8001/api"
