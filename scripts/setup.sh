#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Check if pnpm is installed
if ! command -v pnpm >/dev/null 2>&1; then
  echo "pnpm not found, installing via npm..."
  npm install -g pnpm
fi

# Install dependencies using pnpm
pnpm install --frozen-lockfile
