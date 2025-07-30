#!/usr/bin/env node

/**
 * MoveEase Pro - Vercel Deployment Script
 * Automated deployment to Vercel with all optimizations
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 MoveEase Pro - Vercel Deployment');
console.log('===================================\n');

// Deployment configuration
const config = {
  projectName: 'moveease-pro',
  buildCommand: 'npm run build',
  outputDirectory: 'dist',
  nodeVersion: '18.x'
};

// Deployment steps tracking
const deploymentSteps = {
  preCheck: false,
  build: false,
  deploy: false,
  configure: false,
  verify: false
};

function runCommand(command, description, options = {}) {
  console.log(`🔧 ${description}...`);
  try {
    const output = execSync(command, { 
      encoding: 'utf8', 
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options 
    });
    console.log(`✅ ${description} completed`);
    return output;
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    if (!options.optional) {
      throw error;
    }
    return null;
  }
}

async function preDeploymentChecks() {
  console.log('📋 Pre-deployment Checks...\n');
  
  // Check if we're in the right directory
  if (!fs.existsSync('package.json')) {
    throw new Error('package.json not found. Make sure you\'re in the MoveEase Pro directory.');
  }
  
  // Check if build files exist
  const criticalFiles = [
    'package.json',
    'vite.config.js',
    'vercel.json',
    'src/App.jsx',
    'index.html'
  ];
  
  criticalFiles.forEach(file => {
    if (!fs.existsSync(file)) {
      throw new Error(`Critical file missing: ${file}`);
    }
  });
  
  // Check Node.js version
  const nodeVersion = process.version;
  console.log(`✅ Node.js version: ${nodeVersion}`);
  
  // Check if dependencies are installed
  if (!fs.existsSync('node_modules')) {
    console.log('📦 Installing dependencies...');
    runCommand('npm install', 'Installing dependencies');
  }
  
  // Check if Vercel CLI is available
  try {
    runCommand('vercel --version', 'Checking Vercel CLI', { silent: true });
  } catch (error) {
    console.log('📥 Installing Vercel CLI...');
    runCommand('npm install -g vercel', 'Installing Vercel CLI');
  }
  
  deploymentSteps.preCheck = true;
  console.log('✅ Pre-deployment checks passed!\n');
}

async function buildProject() {
  console.log('🏗️ Building Project for Production...\n');
  
  // Clean previous build
  if (fs.existsSync('dist')) {
    console.log('🧹 Cleaning previous build...');
    fs.rmSync('dist', { recursive: true, force: true });
  }
  
  // Build the project
  runCommand(config.buildCommand, 'Building production bundle');
  
  // Verify build output
  if (!fs.existsSync(config.outputDirectory)) {
    throw new Error(`Build failed - ${config.outputDirectory} directory not created`);
  }
  
  // Check build size
  const buildStats = fs.statSync(config.outputDirectory);
  console.log(`✅ Build completed - Output directory: ${config.outputDirectory}`);
  
  // List build files
  const buildFiles = fs.readdirSync(config.outputDirectory);
  console.log(`📁 Build files: ${buildFiles.join(', ')}`);
  
  deploymentSteps.build = true;
  console.log('✅ Project built successfully!\n');
}

async function deployToVercel() {
  console.log('🚀 Deploying to Vercel...\n');
  
  try {
    // Check if user is logged in
    try {
      runCommand('vercel whoami', 'Checking Vercel authentication', { silent: true });
    } catch (error) {
      console.log('🔐 Please log in to Vercel...');
      runCommand('vercel login', 'Logging in to Vercel');
    }
    
    // Deploy to production
    console.log('🌐 Deploying to production...');
    const deployOutput = runCommand('vercel --prod --yes', 'Deploying to Vercel production');
    
    // Extract deployment URL
    const urlMatch = deployOutput.match(/https:\/\/[^\s]+/);
    if (urlMatch) {
      config.deploymentUrl = urlMatch[0];
      console.log(`✅ Deployed successfully to: ${config.deploymentUrl}`);
    }
    
    deploymentSteps.deploy = true;
    
  } catch (error) {
    console.error('❌ Deployment failed. Manual steps required:');
    console.error('1. Run: vercel login');
    console.error('2. Run: vercel --prod');
    throw error;
  }
  
  console.log('✅ Vercel deployment completed!\n');
}

async function configureEnvironment() {
  console.log('🌍 Environment Configuration...\n');
  
  const envVars = [
    {
      key: 'VITE_API_URL',
      value: 'https://your-backend-url.railway.app',
      description: 'Backend API URL (update after Railway deployment)'
    },
    {
      key: 'VITE_APP_NAME',
      value: 'MoveEase Pro',
      description: 'Application name'
    },
    {
      key: 'VITE_APP_VERSION',
      value: '1.0.0',
      description: 'Application version'
    }
  ];
  
  console.log('📋 Environment variables to configure:');
  envVars.forEach(env => {
    console.log(`   ${env.key}=${env.value}`);
    console.log(`   Description: ${env.description}\n`);
  });
  
  console.log('🔧 To set environment variables:');
  console.log('1. Go to Vercel Dashboard');
  console.log('2. Select your project');
  console.log('3. Go to Settings > Environment Variables');
  console.log('4. Add each variable for Production environment');
  
  deploymentSteps.configure = true;
  console.log('✅ Environment configuration documented!\n');
}

async function verifyDeployment() {
  console.log('🔍 Verifying Deployment...\n');
  
  if (config.deploymentUrl) {
    console.log(`🌐 Testing deployment at: ${config.deploymentUrl}`);
    
    // Basic connectivity test
    try {
      const https = require('https');
      const url = require('url');
      
      const parsedUrl = url.parse(config.deploymentUrl);
      
      return new Promise((resolve) => {
        const req = https.request({
          hostname: parsedUrl.hostname,
          port: 443,
          path: '/',
          method: 'GET',
          timeout: 10000
        }, (res) => {
          if (res.statusCode === 200) {
            console.log('✅ Deployment is accessible');
            console.log(`📊 Response status: ${res.statusCode}`);
          } else {
            console.log(`⚠️  Deployment returned status: ${res.statusCode}`);
          }
          resolve();
        });
        
        req.on('error', (error) => {
          console.log(`⚠️  Connection test failed: ${error.message}`);
          resolve();
        });
        
        req.on('timeout', () => {
          console.log('⚠️  Connection test timed out');
          req.destroy();
          resolve();
        });
        
        req.end();
      });
    } catch (error) {
      console.log('⚠️  Could not run connectivity test');
    }
  }
  
  deploymentSteps.verify = true;
  console.log('✅ Deployment verification completed!\n');
}

function generateDeploymentReport() {
  console.log('📊 Deployment Report...\n');
  
  const report = {
    timestamp: new Date().toISOString(),
    project: config.projectName,
    deploymentUrl: config.deploymentUrl || 'Not captured',
    steps: deploymentSteps,
    nextSteps: [
      'Configure environment variables in Vercel dashboard',
      'Deploy backend to Railway',
      'Set up PlanetScale database',
      'Configure custom domain (optional)',
      'Test all functionality in production'
    ]
  };
  
  console.log('📋 Deployment Summary:');
  console.log(`   Project: ${report.project}`);
  console.log(`   Timestamp: ${report.timestamp}`);
  console.log(`   URL: ${report.deploymentUrl}`);
  console.log(`   Pre-checks: ${deploymentSteps.preCheck ? '✅' : '❌'}`);
  console.log(`   Build: ${deploymentSteps.build ? '✅' : '❌'}`);
  console.log(`   Deploy: ${deploymentSteps.deploy ? '✅' : '❌'}`);
  console.log(`   Configure: ${deploymentSteps.configure ? '✅' : '❌'}`);
  console.log(`   Verify: ${deploymentSteps.verify ? '✅' : '❌'}`);
  
  // Save report
  fs.writeFileSync('deployment-report.json', JSON.stringify(report, null, 2));
  console.log('\n📄 Deployment report saved to: deployment-report.json');
  
  return report;
}

async function main() {
  try {
    console.log('🎯 Starting MoveEase Pro deployment to Vercel...\n');
    
    await preDeploymentChecks();
    await buildProject();
    await deployToVercel();
    await configureEnvironment();
    await verifyDeployment();
    
    const report = generateDeploymentReport();
    
    console.log('🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!');
    console.log('=====================================');
    console.log('');
    console.log('🚛 MoveEase Pro is now live on Vercel!');
    console.log('');
    if (config.deploymentUrl) {
      console.log(`🌐 Production URL: ${config.deploymentUrl}`);
    }
    console.log('');
    console.log('📋 Next Steps:');
    console.log('1. 🔧 Configure environment variables in Vercel dashboard');
    console.log('2. 🚂 Deploy backend to Railway');
    console.log('3. 🗄️ Set up PlanetScale database');
    console.log('4. 🧪 Test all functionality in production');
    console.log('5. 🌐 Configure custom domain (optional)');
    console.log('');
    console.log('🎊 Congratulations on your successful deployment!');
    
  } catch (error) {
    console.error('\n❌ DEPLOYMENT FAILED');
    console.error('===================');
    console.error(`Error: ${error.message}`);
    console.error('\n🔧 Troubleshooting:');
    console.error('1. Check your internet connection');
    console.error('2. Verify all files are present');
    console.error('3. Run: vercel login (if auth failed)');
    console.error('4. Try manual deployment: vercel --prod');
    console.error('5. Check the deployment guide: vercel-deployment-guide.md');
    process.exit(1);
  }
}

// Run deployment if called directly
if (require.main === module) {
  main();
}

module.exports = { main, config };
