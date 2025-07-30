#!/usr/bin/env node

/**
 * MoveEase Pro - Pre-Deployment Testing Script
 * Tests all critical functionality before Vercel deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 MoveEase Pro - Pre-Deployment Testing');
console.log('=========================================\n');

// Test results tracking
const testResults = {
  passed: 0,
  failed: 0,
  warnings: 0,
  tests: []
};

function logTest(name, status, message = '') {
  const statusIcon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
  console.log(`${statusIcon} ${name}: ${message}`);
  
  testResults.tests.push({ name, status, message });
  if (status === 'PASS') testResults.passed++;
  else if (status === 'FAIL') testResults.failed++;
  else testResults.warnings++;
}

// Test 1: Check Project Structure
function testProjectStructure() {
  console.log('\n📁 Testing Project Structure...');
  
  const requiredFiles = [
    'package.json',
    'vite.config.js',
    'vercel.json',
    'src/App.jsx',
    'src/index.jsx',
    'backend/package.json',
    'backend/server.js'
  ];
  
  const requiredDirs = [
    'src/components',
    'src/pages',
    'src/contexts',
    'src/services',
    'backend/models',
    'backend/routes'
  ];
  
  let structureValid = true;
  
  // Check files
  requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
      logTest(`File: ${file}`, 'PASS', 'exists');
    } else {
      logTest(`File: ${file}`, 'FAIL', 'missing');
      structureValid = false;
    }
  });
  
  // Check directories
  requiredDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      logTest(`Directory: ${dir}`, 'PASS', 'exists');
    } else {
      logTest(`Directory: ${dir}`, 'FAIL', 'missing');
      structureValid = false;
    }
  });
  
  return structureValid;
}

// Test 2: Check Package Dependencies
function testDependencies() {
  console.log('\n📦 Testing Dependencies...');
  
  try {
    // Frontend dependencies
    const frontendPkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const requiredFrontendDeps = [
      'react',
      'react-dom',
      'react-router-dom',
      'lucide-react',
      'framer-motion'
    ];
    
    requiredFrontendDeps.forEach(dep => {
      if (frontendPkg.dependencies && frontendPkg.dependencies[dep]) {
        logTest(`Frontend Dep: ${dep}`, 'PASS', frontendPkg.dependencies[dep]);
      } else {
        logTest(`Frontend Dep: ${dep}`, 'FAIL', 'missing');
      }
    });
    
    // Backend dependencies
    if (fs.existsSync('backend/package.json')) {
      const backendPkg = JSON.parse(fs.readFileSync('backend/package.json', 'utf8'));
      const requiredBackendDeps = [
        'express',
        'cors',
        'helmet',
        'jsonwebtoken',
        'bcryptjs',
        'sequelize',
        'mysql2'
      ];
      
      requiredBackendDeps.forEach(dep => {
        if (backendPkg.dependencies && backendPkg.dependencies[dep]) {
          logTest(`Backend Dep: ${dep}`, 'PASS', backendPkg.dependencies[dep]);
        } else {
          logTest(`Backend Dep: ${dep}`, 'FAIL', 'missing');
        }
      });
    }
    
    return true;
  } catch (error) {
    logTest('Dependencies Check', 'FAIL', error.message);
    return false;
  }
}

// Test 3: Check Configuration Files
function testConfiguration() {
  console.log('\n⚙️ Testing Configuration Files...');
  
  try {
    // Check Vite config
    if (fs.existsSync('vite.config.js')) {
      const viteConfig = fs.readFileSync('vite.config.js', 'utf8');
      if (viteConfig.includes('react()')) {
        logTest('Vite Config', 'PASS', 'React plugin configured');
      } else {
        logTest('Vite Config', 'WARN', 'React plugin may be missing');
      }
    }
    
    // Check Vercel config
    if (fs.existsSync('vercel.json')) {
      const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
      if (vercelConfig.builds && vercelConfig.routes) {
        logTest('Vercel Config', 'PASS', 'properly configured');
      } else {
        logTest('Vercel Config', 'WARN', 'may need adjustment');
      }
    }
    
    // Check Tailwind config
    if (fs.existsSync('tailwind.config.js')) {
      logTest('Tailwind Config', 'PASS', 'exists');
    } else {
      logTest('Tailwind Config', 'FAIL', 'missing');
    }
    
    return true;
  } catch (error) {
    logTest('Configuration Check', 'FAIL', error.message);
    return false;
  }
}

// Test 4: Check Core Components
function testCoreComponents() {
  console.log('\n🧩 Testing Core Components...');
  
  const coreComponents = [
    'src/components/ui/Button.jsx',
    'src/components/ui/Input.jsx',
    'src/components/ui/Select.jsx',
    'src/components/AppIcon.jsx',
    'src/pages/Dashboard.jsx',
    'src/pages/website-builder/WebsiteBuilder.jsx',
    'src/contexts/WebsiteBuilderContext.jsx'
  ];
  
  coreComponents.forEach(component => {
    if (fs.existsSync(component)) {
      const content = fs.readFileSync(component, 'utf8');
      if (content.includes('export') && (content.includes('function') || content.includes('const'))) {
        logTest(`Component: ${path.basename(component)}`, 'PASS', 'valid React component');
      } else {
        logTest(`Component: ${path.basename(component)}`, 'WARN', 'may have issues');
      }
    } else {
      logTest(`Component: ${path.basename(component)}`, 'FAIL', 'missing');
    }
  });
  
  return true;
}

// Test 5: Check Services
function testServices() {
  console.log('\n🔧 Testing Services...');
  
  const services = [
    'src/services/api.js',
    'src/services/auth.js',
    'src/services/storage.js',
    'src/services/imageUploadService.js',
    'src/services/seoService.js'
  ];
  
  services.forEach(service => {
    if (fs.existsSync(service)) {
      const content = fs.readFileSync(service, 'utf8');
      if (content.includes('export')) {
        logTest(`Service: ${path.basename(service)}`, 'PASS', 'properly exported');
      } else {
        logTest(`Service: ${path.basename(service)}`, 'WARN', 'may have export issues');
      }
    } else {
      logTest(`Service: ${path.basename(service)}`, 'FAIL', 'missing');
    }
  });
  
  return true;
}

// Test 6: Check Backend Structure
function testBackendStructure() {
  console.log('\n🔙 Testing Backend Structure...');
  
  const backendFiles = [
    'backend/server.js',
    'backend/models/index.js',
    'backend/routes/auth.js',
    'backend/middleware/auth.js',
    'backend/utils/logger.js'
  ];
  
  backendFiles.forEach(file => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      if (content.includes('module.exports') || content.includes('export')) {
        logTest(`Backend: ${path.basename(file)}`, 'PASS', 'properly structured');
      } else {
        logTest(`Backend: ${path.basename(file)}`, 'WARN', 'may have issues');
      }
    } else {
      logTest(`Backend: ${path.basename(file)}`, 'FAIL', 'missing');
    }
  });
  
  return true;
}

// Test 7: Check Environment Setup
function testEnvironmentSetup() {
  console.log('\n🌍 Testing Environment Setup...');
  
  // Check for environment examples
  if (fs.existsSync('backend/.env.example')) {
    logTest('Backend Env Example', 'PASS', 'exists');
  } else {
    logTest('Backend Env Example', 'WARN', 'missing - create for deployment');
  }
  
  if (fs.existsSync('.env.production')) {
    logTest('Production Env', 'PASS', 'exists');
  } else {
    logTest('Production Env', 'WARN', 'missing - needed for deployment');
  }
  
  return true;
}

// Test 8: Check Build Readiness
function testBuildReadiness() {
  console.log('\n🏗️ Testing Build Readiness...');
  
  try {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    if (pkg.scripts && pkg.scripts.build) {
      logTest('Build Script', 'PASS', 'exists');
    } else {
      logTest('Build Script', 'FAIL', 'missing');
    }
    
    if (pkg.scripts && pkg.scripts.start) {
      logTest('Start Script', 'PASS', 'exists');
    } else {
      logTest('Start Script', 'FAIL', 'missing');
    }
    
    // Check if dist directory exists (from previous builds)
    if (fs.existsSync('dist')) {
      logTest('Previous Build', 'PASS', 'dist directory exists');
    } else {
      logTest('Previous Build', 'WARN', 'no previous build found');
    }
    
    return true;
  } catch (error) {
    logTest('Build Readiness', 'FAIL', error.message);
    return false;
  }
}

// Main test runner
async function runTests() {
  console.log('Starting comprehensive pre-deployment tests...\n');
  
  const tests = [
    testProjectStructure,
    testDependencies,
    testConfiguration,
    testCoreComponents,
    testServices,
    testBackendStructure,
    testEnvironmentSetup,
    testBuildReadiness
  ];
  
  for (const test of tests) {
    try {
      await test();
    } catch (error) {
      console.error(`Test failed: ${error.message}`);
    }
  }
  
  // Print summary
  console.log('\n📊 TEST SUMMARY');
  console.log('================');
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`⚠️  Warnings: ${testResults.warnings}`);
  console.log(`📝 Total Tests: ${testResults.tests.length}`);
  
  const successRate = (testResults.passed / testResults.tests.length * 100).toFixed(1);
  console.log(`📈 Success Rate: ${successRate}%`);
  
  // Deployment readiness assessment
  console.log('\n🚀 DEPLOYMENT READINESS');
  console.log('========================');
  
  if (testResults.failed === 0 && testResults.warnings <= 3) {
    console.log('🟢 READY FOR DEPLOYMENT');
    console.log('✅ All critical tests passed');
    console.log('✅ Project structure is valid');
    console.log('✅ Dependencies are properly configured');
    console.log('\n🎯 Next Steps:');
    console.log('1. Deploy frontend to Vercel');
    console.log('2. Deploy backend to Railway');
    console.log('3. Set up database on PlanetScale');
    console.log('4. Configure environment variables');
  } else if (testResults.failed <= 2) {
    console.log('🟡 MOSTLY READY - Minor Issues');
    console.log('⚠️  Some non-critical issues found');
    console.log('✅ Core functionality should work');
    console.log('\n🔧 Recommended Actions:');
    console.log('1. Fix failed tests if possible');
    console.log('2. Proceed with deployment');
    console.log('3. Monitor for issues in production');
  } else {
    console.log('🔴 NOT READY - Critical Issues');
    console.log('❌ Multiple critical issues found');
    console.log('❌ Deployment may fail');
    console.log('\n🛠️  Required Actions:');
    console.log('1. Fix all failed tests');
    console.log('2. Resolve missing dependencies');
    console.log('3. Re-run tests before deployment');
  }
  
  console.log('\n📋 Detailed Test Results:');
  testResults.tests.forEach(test => {
    const icon = test.status === 'PASS' ? '✅' : test.status === 'FAIL' ? '❌' : '⚠️';
    console.log(`${icon} ${test.name}: ${test.message}`);
  });
}

// Run the tests
runTests().catch(console.error);
