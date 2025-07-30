@echo off
echo 🚛 MoveEase Pro - Starting Local Development Server
echo ================================================
echo.

echo 📁 Checking if we're in the right directory...
if not exist "package.json" (
    echo ❌ package.json not found. Make sure you're in the MoveEase Pro directory.
    echo 📂 Current directory: %CD%
    pause
    exit /b 1
)
echo ✅ Found package.json

echo.
echo 📦 Installing dependencies (if needed)...
if not exist "node_modules" (
    echo 🔄 Installing dependencies...
    npm install
    if errorlevel 1 (
        echo ❌ Failed to install dependencies
        echo 🔧 Try running: npm cache clean --force
        pause
        exit /b 1
    )
) else (
    echo ✅ Dependencies already installed
)

echo.
echo 🔌 Checking if port 5173 is available...
netstat -an | find "5173" >nul
if not errorlevel 1 (
    echo ⚠️  Port 5173 is in use. Attempting to free it...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173') do taskkill /f /pid %%a >nul 2>&1
    timeout /t 2 >nul
)

echo.
echo 🚀 Starting development server...
echo 📝 Look for: "Local: http://localhost:5173/"
echo 🌐 Your browser should open automatically
echo ⏹️  Press Ctrl+C to stop the server
echo.

npm start

if errorlevel 1 (
    echo.
    echo ❌ Failed to start server. Trying alternative method...
    npm run dev
    
    if errorlevel 1 (
        echo.
        echo ❌ Still failed. Manual troubleshooting needed.
        echo 🔧 Try these commands:
        echo    1. npm cache clean --force
        echo    2. rmdir /s node_modules
        echo    3. del package-lock.json
        echo    4. npm install
        echo    5. npm start
        pause
    )
)
