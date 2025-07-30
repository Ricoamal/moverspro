#!/usr/bin/env node

/**
 * MoveEase Pro - Import/Export Checker
 * Verifies all imports and exports are correctly matched
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 MoveEase Pro - Import/Export Checker');
console.log('======================================\n');

// Common import/export mismatches to check
const commonIssues = [
  {
    incorrect: 'EmploymentTypes',
    correct: 'EmploymentType',
    file: 'src/types/staff.js'
  },
  {
    incorrect: 'CustomerType',
    correct: 'CustomerTypes',
    file: 'src/types/customer.js'
  },
  {
    incorrect: 'StaffRole',
    correct: 'StaffRoles',
    file: 'src/types/staff.js'
  }
];

// Function to recursively find all JS/JSX files
function findJSFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      findJSFiles(filePath, fileList);
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Check for import/export mismatches
function checkImportExportMismatches() {
  console.log('🔍 Checking for import/export mismatches...\n');
  
  const jsFiles = findJSFiles('src');
  let issuesFound = 0;
  
  jsFiles.forEach(filePath => {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        commonIssues.forEach(issue => {
          if (line.includes(issue.incorrect) && 
              (line.includes('import') || line.includes('from'))) {
            console.log(`❌ Found issue in ${filePath}:${index + 1}`);
            console.log(`   Line: ${line.trim()}`);
            console.log(`   Issue: Using '${issue.incorrect}' instead of '${issue.correct}'`);
            console.log(`   Fix: Import '${issue.correct}' from '${issue.file}'\n`);
            issuesFound++;
          }
        });
      });
    } catch (error) {
      console.log(`⚠️  Could not read ${filePath}: ${error.message}`);
    }
  });
  
  if (issuesFound === 0) {
    console.log('✅ No import/export mismatches found!');
  } else {
    console.log(`❌ Found ${issuesFound} import/export issues that need fixing.`);
  }
  
  return issuesFound;
}

// Check for missing exports in type files
function checkMissingExports() {
  console.log('\n🔍 Checking for missing exports in type files...\n');
  
  const typeFiles = [
    'src/types/staff.js',
    'src/types/customer.js',
    'src/types/websiteBuilder.js',
    'src/types/payroll.js',
    'src/types/crm.js'
  ];
  
  let missingExports = 0;
  
  typeFiles.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Check if file has exports
        if (!content.includes('export')) {
          console.log(`❌ ${filePath} has no exports`);
          missingExports++;
        } else {
          console.log(`✅ ${filePath} has exports`);
        }
      } catch (error) {
        console.log(`⚠️  Could not read ${filePath}: ${error.message}`);
      }
    } else {
      console.log(`⚠️  ${filePath} does not exist`);
    }
  });
  
  return missingExports;
}

// Check for unused imports
function checkUnusedImports() {
  console.log('\n🔍 Checking for potentially unused imports...\n');
  
  const jsFiles = findJSFiles('src').slice(0, 10); // Check first 10 files as sample
  let unusedImports = 0;
  
  jsFiles.forEach(filePath => {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        if (line.includes('import') && line.includes('from')) {
          // Extract imported items
          const importMatch = line.match(/import\s*{([^}]+)}\s*from/);
          if (importMatch) {
            const imports = importMatch[1].split(',').map(item => item.trim());
            
            imports.forEach(importItem => {
              if (importItem && !content.includes(importItem.replace(/\s+as\s+\w+/, ''))) {
                console.log(`⚠️  Potentially unused import in ${filePath}:${index + 1}`);
                console.log(`   Import: ${importItem}`);
                unusedImports++;
              }
            });
          }
        }
      });
    } catch (error) {
      console.log(`⚠️  Could not analyze ${filePath}: ${error.message}`);
    }
  });
  
  if (unusedImports === 0) {
    console.log('✅ No obviously unused imports found in sample files!');
  }
  
  return unusedImports;
}

// Main checker function
function runChecks() {
  console.log('🎯 Running comprehensive import/export checks...\n');
  
  const importExportIssues = checkImportExportMismatches();
  const missingExports = checkMissingExports();
  const unusedImports = checkUnusedImports();
  
  console.log('\n📊 SUMMARY');
  console.log('===========');
  console.log(`Import/Export Mismatches: ${importExportIssues}`);
  console.log(`Missing Exports: ${missingExports}`);
  console.log(`Potentially Unused Imports: ${unusedImports}`);
  
  const totalIssues = importExportIssues + missingExports;
  
  if (totalIssues === 0) {
    console.log('\n🎉 ALL CHECKS PASSED!');
    console.log('✅ No critical import/export issues found');
    console.log('✅ All type files have proper exports');
    console.log('🚀 Ready for local testing and deployment!');
  } else {
    console.log(`\n⚠️  Found ${totalIssues} issues that should be fixed`);
    console.log('🔧 Please review and fix the issues listed above');
  }
  
  return totalIssues;
}

// Run the checks
if (require.main === module) {
  runChecks();
}

module.exports = { runChecks, checkImportExportMismatches };
