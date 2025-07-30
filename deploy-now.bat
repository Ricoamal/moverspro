@echo off
echo 🚀 MoveEase Pro - Production Deployment
echo =======================================
echo.

echo 📁 Checking project directory...
if not exist "package.json" (
    echo ❌ package.json not found
    echo Please make sure you're in the MoveEase Pro directory
    pause
    exit /b 1
)

echo ✅ Found MoveEase Pro project
echo.

echo 🧹 Cleaning previous attempts...
if exist ".vercel" rmdir /s /q ".vercel" 2>nul
if exist "dist" rmdir /s /q "dist" 2>nul
echo ✅ Cleanup completed
echo.

echo 📦 Installing dependencies...
if not exist "node_modules" (
    echo Installing npm packages...
    npm install
    if errorlevel 1 (
        echo ❌ npm install failed
        pause
        exit /b 1
    )
) else (
    echo ✅ Dependencies already installed
)
echo.

echo 🏗️ Building for PRODUCTION...
echo 📦 Creating optimized production build...
npm run build
if errorlevel 1 (
    echo ❌ Build failed
    pause
    exit /b 1
)

if not exist "dist" (
    echo ❌ Build directory not created
    pause
    exit /b 1
)

echo ✅ Production build completed
echo 📁 Built files are ready in 'dist' directory
echo.

echo 🔧 Checking Vercel CLI...
vercel --version >nul 2>&1
if errorlevel 1 (
    echo 📥 Installing Vercel CLI...
    npm install -g vercel
    if errorlevel 1 (
        echo ❌ Failed to install Vercel CLI
        pause
        exit /b 1
    )
)
echo ✅ Vercel CLI ready
echo.

echo 🔐 Checking authentication...
vercel whoami >nul 2>&1
if errorlevel 1 (
    echo 🔐 Please log in to Vercel...
    vercel login
    if errorlevel 1 (
        echo ❌ Login failed
        pause
        exit /b 1
    )
)
echo ✅ Authenticated
echo.

echo 🚀 Deploying to Vercel...
echo 🌐 This will create your live website!
echo.
echo 📋 When Vercel asks, answer:
echo    - Set up and deploy? → yes
echo    - Which scope? → ricoamal's projects
echo    - Link to existing project? → no
echo    - Project name? → moveease-pro
echo    - Code directory? → ./
echo    - Modify settings? → no
echo.

vercel --prod
if errorlevel 1 (
    echo.
    echo ❌ Deployment failed
    echo 🔧 Try running manually: vercel --prod
    pause
    exit /b 1
)

echo.
echo 🎉 DEPLOYMENT SUCCESSFUL!
echo ========================
echo.
echo 🌐 MoveEase Pro is now LIVE!
echo 🔗 Your production website is ready
echo 📱 Test it on mobile and desktop
echo 🏗️ This is the OPTIMIZED PRODUCTION version
echo.
echo 🚛 Ready to revolutionize the moving industry!
pause
