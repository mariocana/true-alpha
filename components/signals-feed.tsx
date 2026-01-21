'use client'

import { SignalCard } from './signal-card'
import { Activity } from 'lucide-react'

// Mock data for the feed
const MOCK_SIGNALS = [
  {
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    ethosScore: 1456,
    pair: 'ETH/USD',
    direction: 'LONG' as const,
    targetPrice: '2850.00',
    timestamp: Date.now() - 1000 * 60 * 15, // 15 min ago
    status: 'PENDING' as const,
  },
  {
    address: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
    ethosScore: 1823,
    pair: 'BTC/USD',
    direction: 'SHORT' as const,
    targetPrice: '42500.00',
    timestamp: Date.now() - 1000 * 60 * 45, // 45 min ago
    status: 'HIT' as const,
  },
  {
    address: '0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec',
    ethosScore: 1234,
    pair: 'SOL/USD',
    direction: 'LONG' as const,
    targetPrice: '115.50',
    timestamp: Date.now() - 1000 * 60 * 120, // 2 hours ago
    status: 'HIT' as const,
  },
  {
    address: '0x9b8f4f8e01e5D8B8C4C9c3C3e4B4B4B4B4B4B4B4',
    ethosScore: 987,
    pair: 'AVAX/USD',
    direction: 'SHORT' as const,
    targetPrice: '38.20',
    timestamp: Date.now() - 1000 * 60 * 180, // 3 hours ago
    status: 'MISS' as const,
  },
  {
    address: '0x5A4e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e',
    ethosScore: 1567,
    pair: 'ARB/USD',
    direction: 'LONG' as const,
    targetPrice: '1.85',
    timestamp: Date.now() - 1000 * 60 * 240, // 4 hours ago
    status: 'PENDING' as const,
  },
]

export function SignalsFeed() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-neon-green mb-4">
        <Activity className="h-4 w-4 animate-pulse" />
        <h2 className="text-sm font-bold tracking-wider">LIVE SIGNALS FEED</h2>
      </div>

      <div className="space-y-2">
        {MOCK_SIGNALS.map((signal, index) => (
          <SignalCard key={index} {...signal} />
        ))}
      </div>

      <div className="text-center pt-4">
        <p className="text-[10px] text-muted-foreground">
          SHOWING {MOCK_SIGNALS.length} RECENT SIGNALS
        </p>
      </div>
    </div>
  )
}
