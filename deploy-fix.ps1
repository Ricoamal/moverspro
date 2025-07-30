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
        $content = Get-Content "package.json" -Raw | ConvertFrom-Json
        if ($content.name -eq "moveease-pro") {
            return $true
        }
    }
    return $false
}

# Function to find the correct project directory
function Find-ProjectDirectory {
    $possiblePaths = @(
        "C:\Amalgamate\Projects\Web\Longonot\moveease_pro-main",
        "C:\Users\$env:USERNAME\Desktop\moveease_pro-main",
        "C:\Users\$env:USERNAME\Documents\moveease_pro-main",
        ".\moveease_pro-main",
        ".\"
    )
    
    foreach ($path in $possiblePaths) {
        if (Test-Path $path) {
            Push-Location $path
            if (Test-ProjectDirectory) {
                Write-Host "✅ Found MoveEase Pro project at: $path" -ForegroundColor Green
                return $path
            }
            Pop-Location
        }
    }
    return $null
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

# Function to test network connectivity
function Test-VercelConnectivity {
    Write-Host "🌐 Testing network connectivity..." -ForegroundColor Yellow
    
    try {
        $response = Test-NetConnection -ComputerName "api.vercel.com" -Port 443 -InformationLevel Quiet
        if ($response) {
            Write-Host "✅ Network connectivity to Vercel API: OK" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ Cannot connect to Vercel API" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "⚠️ Network test inconclusive, proceeding anyway..." -ForegroundColor Yellow
        return $true
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
    Write-Host "🏗️ Building project for production..." -ForegroundColor Yellow
    
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Build failed" -ForegroundColor Red
        return $false
    }
    
    if (!(Test-Path "dist")) {
        Write-Host "❌ Build directory not created" -ForegroundColor Red
        return $false
    }
    
    Write-Host "✅ Build completed successfully" -ForegroundColor Green
    return $true
}

# Function to ensure Vercel CLI is installed
function Install-VercelCLI {
    Write-Host "🔧 Checking Vercel CLI..." -ForegroundColor Yellow
    
    try {
        $null = vercel --version
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
    Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Yellow
    
    # Create a simple deployment script
    $deployScript = @"
const { spawn } = require('child_process');

const deploy = spawn('vercel', ['--prod', '--yes'], {
    stdio: 'inherit',
    shell: true
});

deploy.on('close', (code) => {
    if (code === 0) {
        console.log('✅ Deployment successful!');
        process.exit(0);
    } else {
        console.log('❌ Deployment failed with code:', code);
        process.exit(1);
    }
});

deploy.on('error', (error) => {
    console.log('❌ Deployment error:', error.message);
    process.exit(1);
});
"@
    
    $deployScript | Out-File -FilePath "deploy-temp.js" -Encoding UTF8
    
    try {
        node deploy-temp.js
        $deployResult = $LASTEXITCODE
        Remove-Item "deploy-temp.js" -ErrorAction SilentlyContinue
        
        if ($deployResult -eq 0) {
            Write-Host "✅ Deployment completed successfully!" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ Deployment failed" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "❌ Deployment error: $($_.Exception.Message)" -ForegroundColor Red
        Remove-Item "deploy-temp.js" -ErrorAction SilentlyContinue
        return $false
    }
}

# Function for manual deployment fallback
function Show-ManualDeploymentSteps {
    Write-Host ""
    Write-Host "📋 MANUAL DEPLOYMENT STEPS" -ForegroundColor Cyan
    Write-Host "=========================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "If automated deployment fails, follow these steps:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Open PowerShell as Administrator" -ForegroundColor White
    Write-Host "2. Navigate to project directory:" -ForegroundColor White
    Write-Host "   cd `"$(Get-Location)`"" -ForegroundColor Gray
    Write-Host ""
    Write-Host "3. Login to Vercel:" -ForegroundColor White
    Write-Host "   vercel login" -ForegroundColor Gray
    Write-Host ""
    Write-Host "4. Deploy:" -ForegroundColor White
    Write-Host "   vercel --prod" -ForegroundColor Gray
    Write-Host ""
    Write-Host "5. When prompted:" -ForegroundColor White
    Write-Host "   - Set up and deploy? → yes" -ForegroundColor Gray
    Write-Host "   - Which scope? → ricoamal's projects" -ForegroundColor Gray
    Write-Host "   - Link to existing project? → no" -ForegroundColor Gray
    Write-Host "   - Project name? → moveease-pro" -ForegroundColor Gray
    Write-Host "   - Code directory? → ./" -ForegroundColor Gray
    Write-Host "   - Modify settings? → no" -ForegroundColor Gray
    Write-Host ""
}

# Main execution
try {
    # Step 1: Find and navigate to project directory
    Write-Host "📁 Locating MoveEase Pro project..." -ForegroundColor Yellow
    
    if (!(Test-ProjectDirectory)) {
        $projectPath = Find-ProjectDirectory
        if ($null -eq $projectPath) {
            Write-Host "❌ Could not find MoveEase Pro project directory" -ForegroundColor Red
            Write-Host "Please ensure you have the project files in one of these locations:" -ForegroundColor Yellow
            Write-Host "- C:\Amalgamate\Projects\Web\Longonot\moveease_pro-main" -ForegroundColor Gray
            Write-Host "- Desktop\moveease_pro-main" -ForegroundColor Gray
            Write-Host "- Documents\moveease_pro-main" -ForegroundColor Gray
            exit 1
        }
        Set-Location $projectPath
    }
    
    Write-Host "✅ Working in: $(Get-Location)" -ForegroundColor Green
    Write-Host ""
    
    # Step 2: Clean previous attempts
    Clear-PreviousDeployment
    Write-Host ""
    
    # Step 3: Test network connectivity
    if (!(Test-VercelConnectivity)) {
        Write-Host "⚠️ Network issues detected. Trying alternative approach..." -ForegroundColor Yellow
    }
    Write-Host ""
    
    # Step 4: Install Vercel CLI
    if (!(Install-VercelCLI)) {
        Write-Host "❌ Cannot proceed without Vercel CLI" -ForegroundColor Red
        exit 1
    }
    Write-Host ""
    
    # Step 5: Check authentication
    if (!(Test-VercelAuth)) {
        Write-Host "🔐 Please log in to Vercel..." -ForegroundColor Yellow
        vercel login
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Vercel login failed" -ForegroundColor Red
            Show-ManualDeploymentSteps
            exit 1
        }
    }
    Write-Host ""
    
    # Step 6: Install dependencies
    if (!(Install-Dependencies)) {
        Write-Host "❌ Cannot proceed without dependencies" -ForegroundColor Red
        exit 1
    }
    Write-Host ""
    
    # Step 7: Build project
    if (!(Build-Project)) {
        Write-Host "❌ Cannot deploy without successful build" -ForegroundColor Red
        exit 1
    }
    Write-Host ""
    
    # Step 8: Deploy
    if (Deploy-ToVercel) {
        Write-Host ""
        Write-Host "🎉 DEPLOYMENT SUCCESSFUL!" -ForegroundColor Green
        Write-Host "========================" -ForegroundColor Green
        Write-Host ""
        Write-Host "🌐 Your MoveEase Pro is now live!" -ForegroundColor Cyan
        Write-Host "🔗 Check your Vercel dashboard for the live URL" -ForegroundColor Cyan
        Write-Host "📱 Test the deployment on mobile and desktop" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "🚛 MoveEase Pro is ready to revolutionize the moving industry!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "❌ Automated deployment failed" -ForegroundColor Red
        Show-ManualDeploymentSteps
    }
    
} catch {
    Write-Host ""
    Write-Host "❌ DEPLOYMENT SCRIPT ERROR" -ForegroundColor Red
    Write-Host "=========================" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Show-ManualDeploymentSteps
    exit 1
}
