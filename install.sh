#!/bin/bash

echo "Starting robust installation process for macOS/Linux..."
echo

echo "Cleaning npm cache..."
npm cache clean --force

echo
echo "Installing dependencies with legacy-peer-deps..."
npm install --no-package-lock --legacy-peer-deps

echo
echo "Running fix-all script..."
node fix-all.js

echo
echo "Installation completed!"
echo
echo "Next steps:"
echo "1. Run 'npm start' to start the development server"
echo "2. Press 'a' to run on Android or 'i' to run on iOS"
echo
