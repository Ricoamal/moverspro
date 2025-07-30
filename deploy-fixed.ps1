# MoveEase Pro - Complete Deployment Fix Script
# This script handles all deployment issues automatically

Write-Host "🚀 MoveEase Pro - Complete Deployment Fix" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""

# Function to check if we're in the right directory
function Test-ProjectDirectory {
    $packageJson = Test-Path "package.json"
    $srcDir = Test-Path "src"
    $indexHtml = Test-Path "index.html"
    
    if ($packageJson -and $srcDir -and $indexHtml) {
        try {
            $content = Get-Content "package.json" -Raw | ConvertFrom-Json
            if ($content.name -eq "moveease-pro") {
                return $true
            }
        } catch {
            return $false
        }
    }
    return $false
}

# Function to clean previous deployment attempts
function Clear-PreviousDeployment {
    Write-Host "🧹 Cleaning previous deployment attempts..." -ForegroundColor Yellow
    
    if (Test-Path ".vercel") {
        Remove-Item ".vercel" -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "✅ Removed .vercel directory" -ForegroundColor Green
    }
    
    if (Test-Path "dist") {
        Remove-Item "dist" -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "✅ Removed old build directory" -ForegroundColor Green
    }
}

# Function to install dependencies
function Install-Dependencies {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    
    if (!(Test-Path "node_modules")) {
        Write-Host "Installing npm packages..." -ForegroundColor Cyan
        npm install
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ npm install failed" -ForegroundColor Red
            return $false
        }
    } else {
        Write-Host "✅ Dependencies already installed" -ForegroundColor Green
    }
    return $true
}

# Function to build the project
function Build-Project {
    Write-Host "🏗️ Building project for PRODUCTION..." -ForegroundColor Yellow
    Write-Host "📦 This creates optimized, minified files for deployment" -ForegroundColor Cyan
    
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Build failed" -ForegroundColor Red
        return $false
    }
    
    if (!(Test-Path "dist")) {
        Write-Host "❌ Build directory not created" -ForegroundColor Red
        return $false
    }
    
    Write-Host "✅ Production build completed successfully" -ForegroundColor Green
    Write-Host "📁 Built files are in the 'dist' directory" -ForegroundColor Cyan
    return $true
}

# Function to ensure Vercel CLI is installed
function Install-VercelCLI {
    Write-Host "🔧 Checking Vercel CLI..." -ForegroundColor Yellow
    
    try {
        $null = vercel --version 2>$null
        Write-Host "✅ Vercel CLI is installed" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "📥 Installing Vercel CLI..." -ForegroundColor Cyan
        npm install -g vercel
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Failed to install Vercel CLI" -ForegroundColor Red
            return $false
        }
        Write-Host "✅ Vercel CLI installed successfully" -ForegroundColor Green
        return $true
    }
}

# Function to check Vercel authentication
function Test-VercelAuth {
    Write-Host "🔐 Checking Vercel authentication..." -ForegroundColor Yellow
    
    try {
        $result = vercel whoami 2>&1
        if ($result -match "Error.*credentials") {
            Write-Host "❌ Not logged in to Vercel" -ForegroundColor Red
            return $false
        } else {
            Write-Host "✅ Logged in to Vercel" -ForegroundColor Green
            return $true
        }
    } catch {
        Write-Host "❌ Vercel authentication check failed" -ForegroundColor Red
        return $false
    }
}

# Function to deploy to Vercel
function Deploy-ToVercel {
    Write-Host "🚀 Deploying PRODUCTION BUILD to Vercel..." -ForegroundColor Yellow
    Write-Host "🌐 This will create a live website URL" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📋 When Vercel asks questions, answer:" -ForegroundColor Yellow
    Write-Host "   - Set up and deploy? → yes" -ForegroundColor Gray
    Write-Host "   - Which scope? → ricoamal's projects" -ForegroundColor Gray
    Write-Host "   - Link to existing project? → no" -ForegroundColor Gray
    Write-Host "   - Project name? → moveease-pro" -ForegroundColor Gray
    Write-Host "   - Code directory? → ./" -ForegroundColor Gray
    Write-Host "   - Modify settings? → no" -ForegroundColor Gray
    Write-Host ""
    
    try {
        vercel --prod --yes
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Deployment completed successfully!" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ Deployment failed" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "❌ Deployment error: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Main execution
try {
    # Step 1: Verify we're in the right directory
    Write-Host "📁 Verifying project directory..." -ForegroundColor Yellow
    
    if (!(Test-ProjectDirectory)) {
        Write-Host "❌ Not in MoveEase Pro project directory" -ForegroundColor Red
        Write-Host "Current directory: $(Get-Location)" -ForegroundColor Gray
        Write-Host "Please navigate to the MoveEase Pro directory first" -ForegroundColor Yellow
        exit 1
    }
    
    Write-Host "✅ Working in: $(Get-Location)" -ForegroundColor Green
    Write-Host ""
    
    # Step 2: Clean previous attempts
    Clear-PreviousDeployment
    Write-Host ""
    
    # Step 3: Install Vercel CLI
    if (!(Install-VercelCLI)) {
        Write-Host "❌ Cannot proceed without Vercel CLI" -ForegroundColor Red
        exit 1
    }
    Write-Host ""
    
    # Step 4: Check authentication
    if (!(Test-VercelAuth)) {
        Write-Host "🔐 Please log in to Vercel..." -ForegroundColor Yellow
        vercel login
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Vercel login failed" -ForegroundColor Red
            exit 1
        }
    }
    Write-Host ""
    
    # Step 5: Install dependencies
    if (!(Install-Dependencies)) {
        Write-Host "❌ Cannot proceed without dependencies" -ForegroundColor Red
        exit 1
    }
    Write-Host ""
    
    # Step 6: Build project for PRODUCTION
    if (!(Build-Project)) {
        Write-Host "❌ Cannot deploy without successful build" -ForegroundColor Red
        exit 1
    }
    Write-Host ""
    
    # Step 7: Deploy PRODUCTION BUILD
    if (Deploy-ToVercel) {
        Write-Host ""
        Write-Host "🎉 PRODUCTION DEPLOYMENT SUCCESSFUL!" -ForegroundColor Green
        Write-Host "====================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "🌐 Your MoveEase Pro is now LIVE!" -ForegroundColor Cyan
        Write-Host "🔗 Check the URL provided above" -ForegroundColor Cyan
        Write-Host "📱 Test the live website on mobile and desktop" -ForegroundColor Cyan
        Write-Host "🏗️ The deployed version is the OPTIMIZED PRODUCTION BUILD" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "🚛 MoveEase Pro is ready to revolutionize the moving industry!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "❌ Automated deployment failed" -ForegroundColor Red
        Write-Host "🔧 Try manual deployment:" -ForegroundColor Yellow
        Write-Host "   vercel --prod" -ForegroundColor Gray
    }
    
} catch {
    Write-Host ""
    Write-Host "❌ DEPLOYMENT SCRIPT ERROR" -ForegroundColor Red
    Write-Host "=========================" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "🔧 Try manual deployment:" -ForegroundColor Yellow
    Write-Host "   npm run build" -ForegroundColor Gray
    Write-Host "   vercel --prod" -ForegroundColor Gray
    exit 1
}
