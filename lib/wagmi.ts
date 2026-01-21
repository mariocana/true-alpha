import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { baseSepolia } from 'wagmi/chains'

export const config = getDefaultConfig({
  appName: 'TrueAlpha',
  projectId: 'YOUR_PROJECT_ID', // Get from WalletConnect Cloud
  chains: [baseSepolia],
  ssr: true,
})
