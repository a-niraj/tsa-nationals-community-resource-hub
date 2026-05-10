#!/bin/bash
# Load .env and start servers
set -a
source .env
set +a

echo "🚀 Starting development environment..."
echo "App: http://localhost:8080"
echo "API: http://localhost:3001"
echo ""

# Start API server in background
node dev-server.mjs > /tmp/api-server.log 2>&1 &
API_PID=$!

sleep 2

# Start Vite dev server
vite dev --port 8080 --host 127.0.0.1

# Cleanup
kill $API_PID 2>/dev/null || true
