#!/usr/bin/env node

/**
 * MoveEase Pro - Local Server Troubleshooting Script
 * Diagnoses and fixes common local development issues
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const net = require('net');

console.log('🔧 MoveEase Pro - Local Server Fix');
console.log('==================================\n');

// Check if port is in use
function checkPort(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.once('close', () => resolve(true));
      server.close();
    });
    server.on('error', () => resolve(false));
  });
}

// Kill process on port
function killPort(port) {
  try {
    if (process.platform === 'win32') {
      execSync(`netstat -ano | findstr :${port}`, { stdio: 'pipe' });
      execSync(`for /f "tokens=5" %a in ('netstat -ano ^| findstr :${port}') do taskkill /f /pid %a`, { stdio: 'pipe' });
    } else {
      execSync(`lsof -ti:${port} | xargs kill -9`, { stdio: 'pipe' });
    }
    console.log(`✅ Killed process on port ${port}`);
    return true;
  } catch (error) {
    console.log(`ℹ️  No process found on port ${port}`);
    return false;
  }
}

// Run command with real-time output
function runCommandWithOutput(command, args = []) {
  return new Promise((resolve, reject) => {
    console.log(`🔧 Running: ${command} ${args.join(' ')}`);
    
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });
    
    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function diagnoseAndFix() {
  console.log('🔍 Diagnosing local development issues...\n');
  
  // Step 1: Check if we're in the right directory
  console.log('📁 Checking project structure...');
  const requiredFiles = ['package.json', 'vite.config.js', 'src/index.jsx', 'index.html'];
  let structureOk = true;
  
  requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file} - exists`);
    } else {
      console.log(`❌ ${file} - missing`);
      structureOk = false;
    }
  });
  
  if (!structureOk) {
    console.log('\n❌ Project structure incomplete. Make sure you\'re in the MoveEase Pro directory.');
    return;
  }
  
  // Step 2: Check Node.js and npm versions
  console.log('\n🔧 Checking Node.js and npm...');
  try {
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    console.log(`✅ Node.js: ${nodeVersion}`);
    console.log(`✅ npm: ${npmVersion}`);
    
    // Check if Node.js version is compatible
    const majorVersion = parseInt(nodeVersion.replace('v', '').split('.')[0]);
    if (majorVersion < 16) {
      console.log('⚠️  Warning: Node.js 16+ recommended for Vite');
    }
  } catch (error) {
    console.log('❌ Node.js or npm not found. Please install Node.js first.');
    return;
  }
  
  // Step 3: Check if port 5173 is available
  console.log('\n🔌 Checking port availability...');
  const portAvailable = await checkPort(5173);
  if (!portAvailable) {
    console.log('⚠️  Port 5173 is in use. Attempting to free it...');
    killPort(5173);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
  } else {
    console.log('✅ Port 5173 is available');
  }
  
  // Step 4: Check node_modules
  console.log('\n📦 Checking dependencies...');
  if (!fs.existsSync('node_modules')) {
    console.log('❌ node_modules not found. Installing dependencies...');
    try {
      await runCommandWithOutput('npm', ['install']);
      console.log('✅ Dependencies installed successfully');
    } catch (error) {
      console.log('❌ Failed to install dependencies. Trying alternative methods...');
      
      // Try clearing cache and reinstalling
      try {
        console.log('🧹 Clearing npm cache...');
        execSync('npm cache clean --force', { stdio: 'inherit' });
        
        console.log('🔄 Retrying installation...');
        await runCommandWithOutput('npm', ['install', '--legacy-peer-deps']);
        console.log('✅ Dependencies installed with legacy peer deps');
      } catch (retryError) {
        console.log('❌ Still failed. Please try manually:');
        console.log('   1. Delete node_modules: rm -rf node_modules');
        console.log('   2. Delete package-lock.json: rm package-lock.json');
        console.log('   3. Reinstall: npm install');
        return;
      }
    }
  } else {
    console.log('✅ node_modules exists');
    
    // Check if key dependencies are installed
    const keyDeps = ['react', 'vite', '@vitejs/plugin-react'];
    keyDeps.forEach(dep => {
      if (fs.existsSync(`node_modules/${dep}`)) {
        console.log(`✅ ${dep} - installed`);
      } else {
        console.log(`❌ ${dep} - missing`);
      }
    });
  }
  
  // Step 5: Try to start the development server
  console.log('\n🚀 Starting development server...');
  console.log('📝 If successful, you should see:');
  console.log('   - "Local: http://localhost:5173/"');
  console.log('   - "ready in XXXms"');
  console.log('\n🌐 The server will open in your browser automatically.');
  console.log('⏹️  Press Ctrl+C to stop the server when done.\n');
  
  try {
    // Start the server
    await runCommandWithOutput('npm', ['start']);
  } catch (error) {
    console.log('\n❌ Failed to start development server.');
    console.log('🔧 Troubleshooting steps:');
    console.log('1. Check if all dependencies are installed: npm list');
    console.log('2. Try alternative start command: npm run dev');
    console.log('3. Try different port: npm start -- --port 3000');
    console.log('4. Check for errors in package.json scripts');
    console.log('5. Restart your terminal/command prompt');
  }
}

// Alternative start methods
function showAlternativeStartMethods() {
  console.log('\n🔄 Alternative Start Methods:');
  console.log('============================');
  console.log('');
  console.log('Method 1 - Standard:');
  console.log('  npm start');
  console.log('');
  console.log('Method 2 - Dev command:');
  console.log('  npm run dev');
  console.log('');
  console.log('Method 3 - Different port:');
  console.log('  npm start -- --port 3000');
  console.log('');
  console.log('Method 4 - Vite directly:');
  console.log('  npx vite');
  console.log('');
  console.log('Method 5 - Force reinstall:');
  console.log('  rm -rf node_modules package-lock.json');
  console.log('  npm install');
  console.log('  npm start');
  console.log('');
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showAlternativeStartMethods();
  } else {
    diagnoseAndFix().catch(error => {
      console.error('\n❌ Diagnostic failed:', error.message);
      showAlternativeStartMethods();
    });
  }
}

module.exports = { diagnoseAndFix, checkPort, killPort };
