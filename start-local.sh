#!/bin/bash

echo "🚛 MoveEase Pro - Starting Local Development Server"
echo "================================================"
echo ""

echo "📁 Checking if we're in the right directory..."
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Make sure you're in the MoveEase Pro directory."
    echo "📂 Current directory: $(pwd)"
    exit 1
fi
echo "✅ Found package.json"

echo ""
echo "📦 Installing dependencies (if needed)..."
if [ ! -d "node_modules" ]; then
    echo "🔄 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        echo "🔧 Try running: npm cache clean --force"
        exit 1
    fi
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "🔌 Checking if port 5173 is available..."
if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 5173 is in use. Attempting to free it..."
    lsof -ti:5173 | xargs kill -9 2>/dev/null
    sleep 2
fi

echo ""
echo "🚀 Starting development server..."
echo "📝 Look for: 'Local: http://localhost:5173/'"
echo "🌐 Your browser should open automatically"
echo "⏹️  Press Ctrl+C to stop the server"
echo ""

npm start

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Failed to start server. Trying alternative method..."
    npm run dev
    
    if [ $? -ne 0 ]; then
        echo ""
        echo "❌ Still failed. Manual troubleshooting needed."
        echo "🔧 Try these commands:"
        echo "   1. npm cache clean --force"
        echo "   2. rm -rf node_modules package-lock.json"
        echo "   3. npm install"
        echo "   4. npm start"
    fi
fi
