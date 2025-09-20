const fs = require('fs');
const path = require('path');

// Verify that components are clean of settings buttons
function verifyCleanComponents() {
  const componentsToCheck = [
    'src/components/QuoteManagement.tsx',
    'src/components/InvoiceManagement.tsx'
  ];

  const forbiddenPatterns = [
    'Quote Settings',
    'Email Settings',
    'setShowSettings',
    'setShowEmailSettings',
    'QuoteNumberingSettings',
    'EmailSettings.*onClose'
  ];

  let allClean = true;

  componentsToCheck.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      console.log(`\n🔍 Checking ${filePath}...`);
      
      forbiddenPatterns.forEach(pattern => {
        const regex = new RegExp(pattern, 'gi');
        const matches = content.match(regex);
        
        if (matches) {
          console.log(`❌ Found forbidden pattern "${pattern}": ${matches.length} matches`);
          allClean = false;
        } else {
          console.log(`✅ Clean of "${pattern}"`);
        }
      });
    } else {
      console.log(`⚠️  File not found: ${filePath}`);
    }
  });

  console.log(`\n${allClean ? '🎉 ALL COMPONENTS ARE CLEAN!' : '❌ SOME COMPONENTS STILL HAVE SETTINGS BUTTONS'}`);
  return allClean;
}

verifyCleanComponents();
