import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { baseSepolia } from 'wagmi/chains'

// ⚠️ IMPORTANT: Get your WalletConnect Project ID
// 1. Go to https://cloud.walletconnect.com
// 2. Create a new project
// 3. Copy the Project ID
// 4. Replace 'YOUR_PROJECT_ID' below
export const config = getDefaultConfig({
  appName: 'TrueAlpha',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID', // ← SET THIS!
  chains: [baseSepolia],
  ssr: true,
})
