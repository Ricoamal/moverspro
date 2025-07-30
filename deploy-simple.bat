@echo off
echo 🚀 MoveEase Pro - Simple Deployment Fix
echo =======================================
echo.

echo 📁 Checking current directory...
if not exist "package.json" (
    echo ❌ Not in MoveEase Pro directory
    echo 🔍 Trying to find project...
    
    if exist "C:\Amalgamate\Projects\Web\Longonot\moveease_pro-main\package.json" (
        cd /d "C:\Amalgamate\Projects\Web\Longonot\moveease_pro-main"
        echo ✅ Found project at: C:\Amalgamate\Projects\Web\Longonot\moveease_pro-main
    ) else (
        echo ❌ Cannot find MoveEase Pro project
        echo Please navigate to the project directory manually
        pause
        exit /b 1
    )
)

echo ✅ Working in: %CD%
echo.

echo 🧹 Cleaning previous deployment...
if exist ".vercel" rmdir /s /q ".vercel" 2>nul
if exist "dist" rmdir /s /q "dist" 2>nul
echo ✅ Cleanup completed
echo.

echo 📦 Installing dependencies...
if not exist "node_modules" (
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

echo 🏗️ Building project...
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
echo ✅ Build completed
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
echo 📝 When prompted, use these answers:
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
    echo 🔧 Try manual deployment:
    echo    1. vercel login
    echo    2. vercel --prod
    pause
    exit /b 1
)

echo.
echo 🎉 DEPLOYMENT SUCCESSFUL!
echo =========================
echo.
echo 🌐 Your MoveEase Pro is now live!
echo 🔗 Check the URL provided above
echo 📱 Test on mobile and desktop
echo.
echo 🚛 MoveEase Pro is ready to revolutionize the moving industry!
pause
