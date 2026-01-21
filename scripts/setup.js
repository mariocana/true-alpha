#!/usr/bin/env node

console.log('\n🎯 TrueAlpha Setup\n')
console.log('Follow these steps to complete setup:\n')

console.log('1️⃣  Get WalletConnect Project ID')
console.log('   → Visit: https://cloud.walletconnect.com')
console.log('   → Create new project')
console.log('   → Copy Project ID\n')

console.log('2️⃣  Update lib/wagmi.ts')
console.log('   → Replace YOUR_PROJECT_ID with your WalletConnect ID\n')

console.log('3️⃣  Get Base Sepolia Testnet ETH')
console.log('   → Visit: https://www.base.org/faucet')
console.log('   → Connect wallet and claim ETH\n')

console.log('4️⃣  Deploy Smart Contract')
console.log('   → Open Remix IDE: https://remix.ethereum.org')
console.log('   → Upload contracts/TrueAlphaSignals.sol')
console.log('   → Compile and deploy to Base Sepolia')
console.log('   → Copy deployed address\n')

console.log('5️⃣  Update Contract Address')
console.log('   → Edit hooks/useWriteSignal.ts')
console.log('   → Replace CONTRACT_ADDRESS with your deployed address\n')

console.log('6️⃣  Start Development')
console.log('   → Run: npm run dev')
console.log('   → Open: http://localhost:3000\n')

console.log('✅ Ready to hack! Good luck! 🚀\n')
