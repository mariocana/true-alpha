#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('\n🔍 TrueAlpha Setup Verification\n');

const checks = [
  {
    name: 'package.json exists',
    test: () => fs.existsSync('package.json'),
  },
  {
    name: 'node_modules exists',
    test: () => fs.existsSync('node_modules'),
    warning: 'Run: npm install',
  },
  {
    name: 'Next.js config exists',
    test: () => fs.existsSync('next.config.js'),
  },
  {
    name: 'Tailwind config exists',
    test: () => fs.existsSync('tailwind.config.js'),
  },
  {
    name: 'App directory exists',
    test: () => fs.existsSync('app'),
  },
  {
    name: 'Components directory exists',
    test: () => fs.existsSync('components'),
  },
  {
    name: 'Hooks directory exists',
    test: () => fs.existsSync('hooks'),
  },
  {
    name: 'Contracts directory exists',
    test: () => fs.existsSync('contracts'),
  },
];

let passed = 0;
let failed = 0;

checks.forEach(check => {
  const result = check.test();
  if (result) {
    console.log(`✅ ${check.name}`);
    passed++;
  } else {
    console.log(`❌ ${check.name}`);
    if (check.warning) {
      console.log(`   → ${check.warning}`);
    }
    failed++;
  }
});

console.log(`\n📊 Results: ${passed}/${checks.length} passed\n`);

if (failed === 0) {
  console.log('🎉 All checks passed! You\'re ready to start!\n');
  console.log('Run: npm run dev\n');
} else {
  console.log('⚠️  Some checks failed. Please fix them before starting.\n');
}

// Check for WalletConnect Project ID
console.log('📝 Configuration Reminders:\n');

const wagmiPath = path.join('lib', 'wagmi.ts');
if (fs.existsSync(wagmiPath)) {
  const content = fs.readFileSync(wagmiPath, 'utf8');
  if (content.includes('YOUR_PROJECT_ID')) {
    console.log('⚠️  Update WalletConnect Project ID in lib/wagmi.ts');
    console.log('   Get one at: https://cloud.walletconnect.com\n');
  } else {
    console.log('✅ WalletConnect Project ID configured\n');
  }
}

const signalPath = path.join('hooks', 'useWriteSignal.ts');
if (fs.existsSync(signalPath)) {
  const content = fs.readFileSync(signalPath, 'utf8');
  if (content.includes('0x0000000000000000000000000000000000000000')) {
    console.log('ℹ️  Contract address is using mock (0x000...000)');
    console.log('   Deploy contract from contracts/TrueAlphaSignals.sol');
    console.log('   and update address in hooks/useWriteSignal.ts\n');
  } else {
    console.log('✅ Contract address configured\n');
  }
}

console.log('Good luck! 🚀\n');
