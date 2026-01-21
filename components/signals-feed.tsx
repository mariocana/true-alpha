'use client'

import { useState, useEffect } from 'react'
import { SignalCard } from './signal-card'
import { Activity } from 'lucide-react'
import { TradeSignal } from '@/hooks/useTradeVerification'

export function SignalsFeed() {
  const [signals, setSignals] = useState<TradeSignal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load signals from localStorage
    const loadSignals = () => {
      try {
        const stored = localStorage.getItem('truealpha-trades')
        if (stored) {
          const trades: TradeSignal[] = JSON.parse(stored)
          setSignals(trades)
        } else {
          // Initialize with some example trades if empty
          const exampleTrades: TradeSignal[] = [
            {
              id: 'example-1',
              trader: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
              token: 'ethereum',
              pair: 'ETH/USD',
              direction: 'LONG',
              entryPrice: 2250,
              targetPrice: 2500,
              stopLoss: 2100,
              timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
              expiresIn: '3d',
              status: 'PENDING',
            },
            {
              id: 'example-2',
              trader: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
              token: 'bitcoin',
              pair: 'BTC/USD',
              direction: 'SHORT',
              entryPrice: 43000,
              targetPrice: 41000,
              stopLoss: 44500,
              timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
              expiresIn: '7d',
              status: 'PENDING',
            },
            {
              id: 'example-3',
              trader: '0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec',
              token: 'solana',
              pair: 'SOL/USD',
              direction: 'LONG',
              entryPrice: 98,
              targetPrice: 115,
              stopLoss: 92,
              timestamp: Date.now() - 1000 * 60 * 60 * 48, // 2 days ago
              expiresIn: '3d',
              status: 'PENDING',
            },
          ]
          
          localStorage.setItem('truealpha-trades', JSON.stringify(exampleTrades))
          setSignals(exampleTrades)
        }
      } catch (err) {
        console.error('Failed to load signals:', err)
      } finally {
        setLoading(false)
      }
    }

    loadSignals()

    // Listen for new signals (from SignalForm)
    const handleStorage = () => {
      loadSignals()
    }

    window.addEventListener('storage', handleStorage)
    
    // Also listen for custom event when signal is posted in same tab
    window.addEventListener('signal-posted', handleStorage as EventListener)

    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('signal-posted', handleStorage as EventListener)
    }
  }, [])

  // Map trader addresses to mock Ethos scores
  const getEthosScore = (address: string): number => {
    if (!address) return 1000
    
    const hash = address.toLowerCase().split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0)
    }, 0)
    return 1000 + (hash % 800)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-sm text-muted-foreground">Loading signals...</div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-neon-green mb-4">
        <Activity className="h-4 w-4 animate-pulse" />
        <h2 className="text-sm font-bold tracking-wider">LIVE SIGNALS FEED</h2>
      </div>

      {signals.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border rounded-sm">
          <p className="text-sm text-muted-foreground mb-2">No signals yet</p>
          <p className="text-xs text-muted-foreground">
            Be the first to post a trade signal!
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {signals.map((signal) => (
            <SignalCard 
              key={signal.id} 
              signal={signal}
              ethosScore={getEthosScore(signal.trader)}
            />
          ))}
        </div>
      )}

      <div className="text-center pt-4">
        <p className="text-[10px] text-muted-foreground">
          SHOWING {signals.length} SIGNAL{signals.length !== 1 ? 'S' : ''}
        </p>
      </div>
    </div>
  )
}
