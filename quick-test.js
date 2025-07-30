// Quick MoveEase Pro Test
const fs = require('fs');

console.log('🧪 MoveEase Pro - Quick Test');
console.log('============================\n');

// Test 1: Check if we have the main files
const criticalFiles = [
  'package.json',
  'src/App.jsx',
  'src/index.jsx',
  'vite.config.js',
  'vercel.json'
];

console.log('📁 Checking Critical Files:');
criticalFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} - EXISTS`);
  } else {
    console.log(`❌ ${file} - MISSING`);
  }
});

// Test 2: Check package.json content
console.log('\n📦 Checking Package.json:');
try {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log(`✅ Project Name: ${pkg.name}`);
  console.log(`✅ Version: ${pkg.version}`);
  console.log(`✅ Has Build Script: ${pkg.scripts?.build ? 'YES' : 'NO'}`);
  console.log(`✅ Has Start Script: ${pkg.scripts?.start ? 'YES' : 'NO'}`);
  console.log(`✅ React Dependency: ${pkg.dependencies?.react || 'MISSING'}`);
} catch (error) {
  console.log(`❌ Error reading package.json: ${error.message}`);
}

// Test 3: Check backend
console.log('\n🔙 Checking Backend:');
if (fs.existsSync('backend')) {
  console.log('✅ Backend directory exists');
  if (fs.existsSync('backend/package.json')) {
    console.log('✅ Backend package.json exists');
  } else {
    console.log('❌ Backend package.json missing');
  }
  if (fs.existsSync('backend/server.js')) {
    console.log('✅ Backend server.js exists');
  } else {
    console.log('❌ Backend server.js missing');
  }
} else {
  console.log('❌ Backend directory missing');
}

// Test 4: Check key components
console.log('\n🧩 Checking Key Components:');
const keyComponents = [
  'src/components/ui/Button.jsx',
  'src/pages/Dashboard.jsx',
  'src/pages/website-builder/WebsiteBuilder.jsx'
];

keyComponents.forEach(component => {
  if (fs.existsSync(component)) {
    console.log(`✅ ${component} - EXISTS`);
  } else {
    console.log(`❌ ${component} - MISSING`);
  }
});

console.log('\n🎯 QUICK TEST COMPLETE!');
console.log('Ready to proceed with detailed testing and deployment.');
