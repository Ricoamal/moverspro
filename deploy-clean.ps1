# MoveEase Pro - Clean Deployment Script
Write-Host "🚀 MoveEase Pro - Production Deployment" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green
Write-Host ""

# Check if we're in the right directory
Write-Host "📁 Checking project directory..." -ForegroundColor Yellow
if (!(Test-Path "package.json")) {
    Write-Host "❌ package.json not found" -ForegroundColor Red
    Write-Host "Please make sure you're in the MoveEase Pro directory" -ForegroundColor Yellow
    exit 1
}

$packageContent = Get-Content "package.json" -Raw | ConvertFrom-Json
if ($packageContent.name -ne "moveease-pro") {
    Write-Host "❌ Not in MoveEase Pro project" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Found MoveEase Pro project" -ForegroundColor Green
Write-Host ""

# Clean previous deployment attempts
Write-Host "🧹 Cleaning previous attempts..." -ForegroundColor Yellow
if (Test-Path ".vercel") {
    Remove-Item ".vercel" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "✅ Removed .vercel directory" -ForegroundColor Green
}
if (Test-Path "dist") {
    Remove-Item "dist" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "✅ Removed old build directory" -ForegroundColor Green
}
Write-Host ""

# Check Vercel CLI
Write-Host "🔧 Checking Vercel CLI..." -ForegroundColor Yellow
try {
    $null = vercel --version 2>$null
    Write-Host "✅ Vercel CLI is available" -ForegroundColor Green
} catch {
    Write-Host "📥 Installing Vercel CLI..." -ForegroundColor Cyan
    npm install -g vercel
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install Vercel CLI" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Vercel CLI installed" -ForegroundColor Green
}
Write-Host ""

# Check authentication
Write-Host "🔐 Checking Vercel authentication..." -ForegroundColor Yellow
$authResult = vercel whoami 2>&1
if ($authResult -match "Error.*credentials") {
    Write-Host "🔐 Please log in to Vercel..." -ForegroundColor Yellow
    vercel login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Login failed" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ Already logged in to Vercel" -ForegroundColor Green
}
Write-Host ""

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
if (!(Test-Path "node_modules")) {
    Write-Host "Installing npm packages..." -ForegroundColor Cyan
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ npm install failed" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✅ Dependencies already installed" -ForegroundColor Green
}
Write-Host ""

# Build for production
Write-Host "🏗️ Building for PRODUCTION..." -ForegroundColor Yellow
Write-Host "📦 Creating optimized production build..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

if (!(Test-Path "dist")) {
    Write-Host "❌ Build directory not created" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Production build completed" -ForegroundColor Green
Write-Host "📁 Built files are ready in 'dist' directory" -ForegroundColor Cyan
Write-Host ""

# Deploy to Vercel
Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Yellow
Write-Host "🌐 This will create your live website!" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 When Vercel asks, answer:" -ForegroundColor Yellow
Write-Host "   - Set up and deploy? → yes" -ForegroundColor Gray
Write-Host "   - Which scope? → ricoamal's projects" -ForegroundColor Gray
Write-Host "   - Link to existing project? → no" -ForegroundColor Gray
Write-Host "   - Project name? → moveease-pro" -ForegroundColor Gray
Write-Host "   - Code directory? → ./" -ForegroundColor Gray
Write-Host "   - Modify settings? → no" -ForegroundColor Gray
Write-Host ""

vercel --prod
if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "🎉 DEPLOYMENT SUCCESSFUL!" -ForegroundColor Green
    Write-Host "========================" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 MoveEase Pro is now LIVE!" -ForegroundColor Cyan
    Write-Host "🔗 Your production website is ready" -ForegroundColor Cyan
    Write-Host "📱 Test it on mobile and desktop" -ForegroundColor Cyan
    Write-Host "🏗️ This is the OPTIMIZED PRODUCTION version" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🚛 Ready to revolutionize the moving industry!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "❌ Deployment failed" -ForegroundColor Red
    Write-Host "🔧 Try running manually: vercel --prod" -ForegroundColor Yellow
}
