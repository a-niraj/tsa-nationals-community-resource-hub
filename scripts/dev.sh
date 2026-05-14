#!/bin/bash
set -a
source .env
set +a

echo "🚀 Starting development environment..."
echo "App: http://localhost:8080"
echo ""

vite dev --port 8080 --host 127.0.0.1
