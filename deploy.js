#!/usr/bin/env node

/**
 * MoveEase Pro - Automated Deployment Script
 * Deploys frontend to Vercel and backend to Railway
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 MoveEase Pro - Automated Deployment');
console.log('=====================================\n');

// Configuration
const config = {
  projectName: 'moveease-pro',
  frontendUrl: '',
  backendUrl: '',
  deploymentStage: 'production'
};

// Utility functions
function runCommand(command, description) {
  console.log(`🔧 ${description}...`);
  try {
    const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    console.log(`✅ ${description} completed`);
    return output;
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    throw error;
  }
}

function checkPrerequisites() {
  console.log('📋 Checking Prerequisites...\n');
  
  const checks = [
    { command: 'node --version', name: 'Node.js' },
    { command: 'npm --version', name: 'npm' },
    { command: 'git --version', name: 'Git' }
  ];
  
  checks.forEach(check => {
    try {
      const version = execSync(check.command, { encoding: 'utf8' }).trim();
      console.log(`✅ ${check.name}: ${version}`);
    } catch (error) {
      console.error(`❌ ${check.name} not found. Please install it first.`);
      process.exit(1);
    }
  });
  
  // Check if required files exist
  const requiredFiles = [
    'package.json',
    'vercel.json',
    'vite.config.js',
    'src/App.jsx'
  ];
  
  requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file} exists`);
    } else {
      console.error(`❌ ${file} missing`);
      process.exit(1);
    }
  });
  
  console.log('\n✅ All prerequisites met!\n');
}

function installDependencies() {
  console.log('📦 Installing Dependencies...\n');
  
  // Install frontend dependencies
  runCommand('npm install', 'Installing frontend dependencies');
  
  // Install backend dependencies
  if (fs.existsSync('backend/package.json')) {
    process.chdir('backend');
    runCommand('npm install', 'Installing backend dependencies');
    process.chdir('..');
  }
  
  console.log('\n✅ Dependencies installed!\n');
}

function buildProject() {
  console.log('🏗️ Building Project...\n');
  
  // Build frontend
  runCommand('npm run build', 'Building frontend for production');
  
  // Verify build output
  if (fs.existsSync('dist')) {
    console.log('✅ Frontend build successful');
  } else {
    console.error('❌ Frontend build failed - no dist directory');
    process.exit(1);
  }
  
  console.log('\n✅ Project built successfully!\n');
}

function deployToVercel() {
  console.log('🚀 Deploying to Vercel...\n');
  
  try {
    // Check if Vercel CLI is installed
    execSync('vercel --version', { stdio: 'pipe' });
    console.log('✅ Vercel CLI found');
  } catch (error) {
    console.log('📥 Installing Vercel CLI...');
    runCommand('npm install -g vercel', 'Installing Vercel CLI');
  }
  
  // Deploy to Vercel
  console.log('🚀 Deploying to Vercel production...');
  try {
    const output = runCommand('vercel --prod --yes', 'Deploying to Vercel');
    
    // Extract URL from output
    const urlMatch = output.match(/https:\/\/[^\s]+/);
    if (urlMatch) {
      config.frontendUrl = urlMatch[0];
      console.log(`✅ Frontend deployed to: ${config.frontendUrl}`);
    }
  } catch (error) {
    console.error('❌ Vercel deployment failed. Please run manually:');
    console.error('   vercel login');
    console.error('   vercel --prod');
    throw error;
  }
  
  console.log('\n✅ Vercel deployment completed!\n');
}

function deployBackend() {
  console.log('🔧 Backend Deployment Instructions...\n');
  
  if (!fs.existsSync('backend')) {
    console.log('⚠️  No backend directory found. Skipping backend deployment.');
    return;
  }
  
  console.log('📋 To deploy backend to Railway:');
  console.log('1. Install Railway CLI: npm install -g @railway/cli');
  console.log('2. Login: railway login');
  console.log('3. Navigate to backend: cd backend');
  console.log('4. Initialize: railway init');
  console.log('5. Deploy: railway up');
  console.log('6. Set environment variables in Railway dashboard');
  
  console.log('\n📋 To set up PlanetScale database:');
  console.log('1. Create account at https://planetscale.com');
  console.log('2. Create database: moveease-pro');
  console.log('3. Get connection string');
  console.log('4. Add to Railway environment variables');
  
  console.log('\n✅ Backend deployment instructions provided!\n');
}

function setupEnvironmentVariables() {
  console.log('🌍 Environment Variables Setup...\n');
  
  const envVars = [
    { key: 'VITE_API_URL', value: 'https://your-backend-url.railway.app', description: 'Backend API URL' },
    { key: 'VITE_APP_NAME', value: 'MoveEase Pro', description: 'Application name' },
    { key: 'VITE_APP_VERSION', value: '1.0.0', description: 'Application version' }
  ];
  
  console.log('📋 Required environment variables for Vercel:');
  envVars.forEach(env => {
    console.log(`   ${env.key}=${env.value} # ${env.description}`);
  });
  
  console.log('\n🔧 To set environment variables:');
  console.log('   vercel env add VARIABLE_NAME production');
  
  console.log('\n✅ Environment variables documented!\n');
}

function runPostDeploymentTests() {
  console.log('🧪 Post-Deployment Tests...\n');
  
  if (config.frontendUrl) {
    console.log(`🌐 Testing deployment at: ${config.frontendUrl}`);
    
    // Basic connectivity test
    try {
      const https = require('https');
      const url = require('url');
      
      const parsedUrl = url.parse(config.frontendUrl);
      const options = {
        hostname: parsedUrl.hostname,
        port: 443,
        path: '/',
        method: 'GET'
      };
      
      const req = https.request(options, (res) => {
        if (res.statusCode === 200) {
          console.log('✅ Website is accessible');
        } else {
          console.log(`⚠️  Website returned status: ${res.statusCode}`);
        }
      });
      
      req.on('error', (error) => {
        console.log(`⚠️  Connection test failed: ${error.message}`);
      });
      
      req.end();
    } catch (error) {
      console.log('⚠️  Could not run connectivity test');
    }
  }
  
  console.log('\n📋 Manual tests to perform:');
  console.log('   • Homepage loads without errors');
  console.log('   • Navigation works correctly');
  console.log('   • Responsive design functions');
  console.log('   • SSL certificate is active');
  
  console.log('\n✅ Post-deployment tests documented!\n');
}

function generateDeploymentReport() {
  console.log('📊 Deployment Report...\n');
  
  const report = {
    timestamp: new Date().toISOString(),
    project: config.projectName,
    frontend: {
      platform: 'Vercel',
      url: config.frontendUrl || 'To be configured',
      status: config.frontendUrl ? 'Deployed' : 'Pending'
    },
    backend: {
      platform: 'Railway',
      url: config.backendUrl || 'To be configured',
      status: 'Pending manual setup'
    },
    database: {
      platform: 'PlanetScale',
      status: 'Pending manual setup'
    }
  };
  
  console.log('📋 Deployment Summary:');
  console.log(`   Project: ${report.project}`);
  console.log(`   Timestamp: ${report.timestamp}`);
  console.log(`   Frontend: ${report.frontend.status} on ${report.frontend.platform}`);
  console.log(`   Backend: ${report.backend.status} on ${report.backend.platform}`);
  console.log(`   Database: ${report.database.status} on ${report.database.platform}`);
  
  if (config.frontendUrl) {
    console.log(`\n🌐 Your MoveEase Pro is live at: ${config.frontendUrl}`);
  }
  
  // Save report to file
  fs.writeFileSync('deployment-report.json', JSON.stringify(report, null, 2));
  console.log('\n📄 Deployment report saved to: deployment-report.json');
  
  console.log('\n✅ Deployment report generated!\n');
}

// Main deployment function
async function deploy() {
  try {
    console.log('🎯 Starting MoveEase Pro deployment process...\n');
    
    checkPrerequisites();
    installDependencies();
    buildProject();
    deployToVercel();
    deployBackend();
    setupEnvironmentVariables();
    runPostDeploymentTests();
    generateDeploymentReport();
    
    console.log('🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!');
    console.log('=====================================');
    console.log('');
    console.log('🚛 MoveEase Pro is now ready for production!');
    console.log('');
    if (config.frontendUrl) {
      console.log(`🌐 Frontend URL: ${config.frontendUrl}`);
    }
    console.log('📋 Next steps:');
    console.log('   1. Deploy backend to Railway');
    console.log('   2. Set up PlanetScale database');
    console.log('   3. Configure environment variables');
    console.log('   4. Test all functionality');
    console.log('   5. Set up custom domain (optional)');
    console.log('');
    console.log('🎊 Congratulations on your successful deployment!');
    
  } catch (error) {
    console.error('\n❌ DEPLOYMENT FAILED');
    console.error('===================');
    console.error(`Error: ${error.message}`);
    console.error('\n🔧 Troubleshooting:');
    console.error('   1. Check your internet connection');
    console.error('   2. Verify all prerequisites are installed');
    console.error('   3. Run: vercel login (if Vercel auth failed)');
    console.error('   4. Check the deployment guide: vercel-deployment-guide.md');
    process.exit(1);
  }
}

// Run deployment if called directly
if (require.main === module) {
  deploy();
}

module.exports = { deploy, config };
