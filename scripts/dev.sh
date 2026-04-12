#!/bin/bash
#
# OpenFlight Development Script
# Starts the backend in mock mode and the frontend in dev mode (HMR)
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[OpenFlight Dev]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[OpenFlight Dev]${NC} $1"
}

error() {
    echo -e "${RED}[OpenFlight Dev]${NC} $1"
}

info() {
    echo -e "${BLUE}[OpenFlight Dev]${NC} $1"
}

cd "$PROJECT_DIR"

# 1. Check for system dependencies
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    if ! dpkg -s libcap-dev &> /dev/null 2>&1; then
        warn "libcap-dev not found. This is required for picamera2/python-prctl."
        info "Please run: sudo apt install libcap-dev"
        # We don't exit here as the user might not need camera support, 
        # but uv sync will likely fail if camera extra is requested.
    fi
fi

# 2. Ensure scripts are executable
chmod +x scripts/*.sh

# 3. Sync backend dependencies
log "Syncing backend dependencies..."
if command -v uv &> /dev/null; then
    uv sync --group dev --extra ui --extra analysis
else
    warn "uv not found, using pip (uv is recommended for speed)"
    if [ ! -d ".venv" ]; then
        python3 -m venv .venv
    fi
    source .venv/bin/activate
    pip install -e ".[ui,analysis,camera,kld7]"
    pip install pytest ruff pylint
fi

# 4. Sync frontend dependencies
log "Syncing frontend dependencies..."
cd ui
npm install
cd ..

# 5. Start backend and frontend concurrently
log "Starting backend and frontend..."

cleanup() {
    log "Shutting down..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start backend in mock mode
# We use --mock to simulate radar data
log "Starting backend (Flask) on port 8080..."
uv run openflight-server --mock --debug &
BACKEND_PID=$!

# Start frontend dev server (Vite)
log "Starting frontend (Vite) on port 5173..."
cd ui
npm run dev &
FRONTEND_PID=$!
cd ..

log "Development environment is ready!"
log "Backend: http://localhost:8080"
log "Frontend: http://localhost:5173 (with HMR)"
log "Press Ctrl+C to stop both."

# Wait for processes
wait $BACKEND_PID $FRONTEND_PID
