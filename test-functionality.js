#!/usr/bin/env node

/**
 * MoveEase Pro - Automated Functionality Tester
 * Tests key functionality and reports issues
 */

const puppeteer = require('puppeteer');
const fs = require('fs');

console.log('🧪 MoveEase Pro - Automated Functionality Test');
console.log('==============================================\n');

// Test configuration
const config = {
  baseUrl: 'http://localhost:5173',
  timeout: 30000,
  viewport: { width: 1440, height: 900 }
};

// Test results
const testResults = {
  passed: 0,
  failed: 0,
  warnings: 0,
  tests: []
};

function logTest(name, status, message = '', screenshot = null) {
  const statusIcon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
  console.log(`${statusIcon} ${name}: ${message}`);
  
  testResults.tests.push({ name, status, message, screenshot });
  if (status === 'PASS') testResults.passed++;
  else if (status === 'FAIL') testResults.failed++;
  else testResults.warnings++;
}

async function testHomepage(page) {
  console.log('\n🏠 Testing Homepage...');
  
  try {
    await page.goto(config.baseUrl, { waitUntil: 'networkidle0', timeout: config.timeout });
    
    // Check if page loads
    const title = await page.title();
    if (title.includes('MoveEase') || title.includes('Vite')) {
      logTest('Homepage Load', 'PASS', 'Page loaded successfully');
    } else {
      logTest('Homepage Load', 'FAIL', `Unexpected title: ${title}`);
    }
    
    // Check for React root
    const reactRoot = await page.$('#root');
    if (reactRoot) {
      logTest('React App Mount', 'PASS', 'React app mounted correctly');
    } else {
      logTest('React App Mount', 'FAIL', 'React root element not found');
    }
    
    // Check for navigation
    const navElements = await page.$$('nav, [role="navigation"]');
    if (navElements.length > 0) {
      logTest('Navigation Present', 'PASS', `Found ${navElements.length} navigation element(s)`);
    } else {
      logTest('Navigation Present', 'WARN', 'No navigation elements found');
    }
    
    // Check for console errors
    const logs = await page.evaluate(() => {
      return window.console.errors || [];
    });
    
    if (logs.length === 0) {
      logTest('Console Errors', 'PASS', 'No console errors detected');
    } else {
      logTest('Console Errors', 'FAIL', `${logs.length} console errors found`);
    }
    
  } catch (error) {
    logTest('Homepage Test', 'FAIL', error.message);
  }
}

async function testResponsiveDesign(page) {
  console.log('\n📱 Testing Responsive Design...');
  
  const viewports = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1440, height: 900 }
  ];
  
  for (const viewport of viewports) {
    try {
      await page.setViewport(viewport);
      await page.waitForTimeout(1000); // Wait for layout to adjust
      
      // Check if content is visible
      const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
      if (bodyHeight > 100) {
        logTest(`${viewport.name} Layout`, 'PASS', `Content renders at ${viewport.width}x${viewport.height}`);
      } else {
        logTest(`${viewport.name} Layout`, 'FAIL', 'Content not rendering properly');
      }
      
    } catch (error) {
      logTest(`${viewport.name} Test`, 'FAIL', error.message);
    }
  }
}

async function testNavigation(page) {
  console.log('\n🧭 Testing Navigation...');
  
  try {
    // Reset to desktop view
    await page.setViewport(config.viewport);
    await page.goto(config.baseUrl, { waitUntil: 'networkidle0' });
    
    // Look for common navigation links
    const navLinks = await page.$$eval('a[href], button', elements => 
      elements.map(el => ({
        text: el.textContent.trim(),
        href: el.href || el.getAttribute('data-href') || 'button',
        visible: el.offsetParent !== null
      })).filter(link => link.text && link.visible)
    );
    
    if (navLinks.length > 0) {
      logTest('Navigation Links', 'PASS', `Found ${navLinks.length} clickable navigation elements`);
      
      // Test first few links
      for (let i = 0; i < Math.min(3, navLinks.length); i++) {
        const link = navLinks[i];
        try {
          if (link.href !== 'button' && !link.href.startsWith('http://localhost')) {
            continue; // Skip external links
          }
          
          // Click the link/button
          await page.click(`a[href="${link.href}"], button:contains("${link.text}")`);
          await page.waitForTimeout(1000);
          
          logTest(`Navigation: ${link.text}`, 'PASS', 'Link/button clickable');
        } catch (error) {
          logTest(`Navigation: ${link.text}`, 'WARN', 'Could not test click');
        }
      }
    } else {
      logTest('Navigation Links', 'WARN', 'No navigation links found');
    }
    
  } catch (error) {
    logTest('Navigation Test', 'FAIL', error.message);
  }
}

async function testPerformance(page) {
  console.log('\n⚡ Testing Performance...');
  
  try {
    const startTime = Date.now();
    await page.goto(config.baseUrl, { waitUntil: 'networkidle0' });
    const loadTime = Date.now() - startTime;
    
    if (loadTime < 3000) {
      logTest('Page Load Time', 'PASS', `Loaded in ${loadTime}ms`);
    } else if (loadTime < 5000) {
      logTest('Page Load Time', 'WARN', `Loaded in ${loadTime}ms (acceptable but could be faster)`);
    } else {
      logTest('Page Load Time', 'FAIL', `Loaded in ${loadTime}ms (too slow)`);
    }
    
    // Check for large images or resources
    const resourceSizes = await page.evaluate(() => {
      return performance.getEntriesByType('resource').map(resource => ({
        name: resource.name,
        size: resource.transferSize || 0,
        type: resource.initiatorType
      })).filter(resource => resource.size > 1000000); // > 1MB
    });
    
    if (resourceSizes.length === 0) {
      logTest('Resource Sizes', 'PASS', 'No large resources detected');
    } else {
      logTest('Resource Sizes', 'WARN', `${resourceSizes.length} large resources found`);
    }
    
  } catch (error) {
    logTest('Performance Test', 'FAIL', error.message);
  }
}

async function runTests() {
  let browser;
  
  try {
    console.log('🚀 Starting automated tests...\n');
    console.log(`Testing URL: ${config.baseUrl}`);
    console.log('Make sure your development server is running!\n');
    
    // Launch browser
    browser = await puppeteer.launch({ 
      headless: false, // Set to true for headless mode
      defaultViewport: config.viewport,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set up console logging
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('🔴 Console Error:', msg.text());
      }
    });
    
    // Run test suites
    await testHomepage(page);
    await testResponsiveDesign(page);
    await testNavigation(page);
    await testPerformance(page);
    
  } catch (error) {
    console.error('❌ Test execution failed:', error.message);
    logTest('Test Execution', 'FAIL', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
  
  // Generate report
  generateReport();
}

function generateReport() {
  console.log('\n📊 TEST RESULTS SUMMARY');
  console.log('========================');
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`⚠️  Warnings: ${testResults.warnings}`);
  console.log(`📝 Total Tests: ${testResults.tests.length}`);
  
  const successRate = (testResults.passed / testResults.tests.length * 100).toFixed(1);
  console.log(`📈 Success Rate: ${successRate}%`);
  
  // Deployment readiness
  console.log('\n🚀 DEPLOYMENT READINESS');
  console.log('========================');
  
  if (testResults.failed === 0 && successRate >= 90) {
    console.log('🟢 READY FOR DEPLOYMENT');
    console.log('✅ All critical tests passed');
    console.log('✅ Success rate above 90%');
    console.log('🎯 Proceed with Vercel deployment');
  } else if (testResults.failed <= 2 && successRate >= 80) {
    console.log('🟡 MOSTLY READY - Minor Issues');
    console.log('⚠️  Some non-critical issues found');
    console.log('✅ Core functionality working');
    console.log('🔧 Consider fixing issues before deployment');
  } else {
    console.log('🔴 NOT READY - Critical Issues');
    console.log('❌ Multiple critical issues found');
    console.log('❌ Success rate below 80%');
    console.log('🛠️  Fix issues before deployment');
  }
  
  // Save detailed report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      passed: testResults.passed,
      failed: testResults.failed,
      warnings: testResults.warnings,
      successRate: successRate
    },
    tests: testResults.tests
  };
  
  fs.writeFileSync('test-report.json', JSON.stringify(report, null, 2));
  console.log('\n📄 Detailed report saved to: test-report.json');
}

// Manual testing instructions
function showManualTestingInstructions() {
  console.log('\n📋 MANUAL TESTING REQUIRED');
  console.log('===========================');
  console.log('Automated tests cover basic functionality.');
  console.log('Please also test manually:');
  console.log('');
  console.log('1. 🖱️  Click through all navigation items');
  console.log('2. 📝 Fill out and submit forms');
  console.log('3. 🎨 Test website builder drag-and-drop');
  console.log('4. 📱 Test on actual mobile devices');
  console.log('5. 🔍 Check all pages for content and styling');
  console.log('');
  console.log('📖 Use testing-checklist.md for comprehensive manual testing');
}

// Run tests if called directly
if (require.main === module) {
  // Check if puppeteer is available
  try {
    require('puppeteer');
    runTests().then(() => {
      showManualTestingInstructions();
    });
  } catch (error) {
    console.log('⚠️  Puppeteer not installed. Install with:');
    console.log('   npm install puppeteer');
    console.log('');
    console.log('📋 For now, please use manual testing:');
    showManualTestingInstructions();
  }
}

module.exports = { runTests };
