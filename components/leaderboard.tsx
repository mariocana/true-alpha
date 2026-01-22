'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Trophy, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TraderStats {
  address: string
  totalTrades: number
  wins: number
  losses: number
  pending: number
  winRate: number
  reputation: number
  rank: number
}

// Calculate trader stats from localStorage trades
function calculateLeaderboard(): TraderStats[] {
  if (typeof window === 'undefined') return []
  
  const stored = localStorage.getItem('truealpha-trades')
  const trades = stored ? JSON.parse(stored) : []
  
  // Group trades by trader
  const traderMap: Record<string, TraderStats> = {}
  
  trades.forEach((trade: any) => {
    const addr = trade.trader || '0x0000000000000000000000000000000000000000'
    
    if (!traderMap[addr]) {
      traderMap[addr] = {
        address: addr,
        totalTrades: 0,
        wins: 0,
        losses: 0,
        pending: 0,
        winRate: 0,
        reputation: 0,
        rank: 0,
      }
    }
    
    traderMap[addr].totalTrades++
    
    if (trade.status === 'WIN') {
      traderMap[addr].wins++
      traderMap[addr].reputation += 50
    } else if (trade.status === 'LOSS') {
      traderMap[addr].losses++
      traderMap[addr].reputation -= 25
    } else {
      traderMap[addr].pending++
    }
  })
  
  // Calculate win rates and sort
  const traders = Object.values(traderMap)
    .map(t => ({
      ...t,
      winRate: t.wins + t.losses > 0 
        ? Math.round((t.wins / (t.wins + t.losses)) * 100) 
        : 0
    }))
    .sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins
      return b.winRate - a.winRate
    })
    .map((t, i) => ({ ...t, rank: i + 1 }))
  
  return traders.slice(0, 10)
}

// Mock data for demo
const MOCK_LEADERBOARD: TraderStats[] = [
  { address: '0x7BAcbbaadCbEeCc443F9885FAF6a2C9894E2F2B2', totalTrades: 47, wins: 32, losses: 12, pending: 3, winRate: 73, reputation: 1300, rank: 1 },
  { address: '0x1234567890abcdef1234567890abcdef12345678', totalTrades: 38, wins: 24, losses: 11, pending: 3, winRate: 69, reputation: 875, rank: 2 },
  { address: '0xabcdef1234567890abcdef1234567890abcdef12', totalTrades: 29, wins: 18, losses: 9, pending: 2, winRate: 67, reputation: 675, rank: 3 },
  { address: '0x9876543210fedcba9876543210fedcba98765432', totalTrades: 22, wins: 13, losses: 7, pending: 2, winRate: 65, reputation: 475, rank: 4 },
  { address: '0xfedcba0987654321fedcba0987654321fedcba09', totalTrades: 18, wins: 10, losses: 6, pending: 2, winRate: 63, reputation: 350, rank: 5 },
]

function shortenAddress(address: string): string {
  if (!address || address.length < 10) return address
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function Leaderboard() {
  const [traders, setTraders] = useState<TraderStats[]>([])
  const [useMock, setUseMock] = useState(true)

  useEffect(() => {
    const realTraders = calculateLeaderboard()
    if (realTraders.length > 0) {
      setTraders(realTraders)
      setUseMock(false)
    } else {
      setTraders(MOCK_LEADERBOARD)
      setUseMock(true)
    }

    const handleNewTrade = () => {
      const updated = calculateLeaderboard()
      if (updated.length > 0) {
        setTraders(updated)
        setUseMock(false)
      }
    }

    window.addEventListener('signal-posted', handleNewTrade)
    return () => window.removeEventListener('signal-posted', handleNewTrade)
  }, [])

  return (
    <Card className="border-purple-500/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-purple-400 flex items-center gap-2 text-sm">
            <Trophy className="h-4 w-4" />
            TOP TRADERS
          </CardTitle>
          {useMock && (
            <span className="text-[8px] px-1.5 py-0.5 bg-purple-500/10 border border-purple-500/30 rounded text-purple-400">
              DEMO
            </span>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2 pt-0">
        {traders.map((trader) => (
          <div
            key={trader.address}
            className={cn(
              'p-2 rounded border bg-terminal-surface',
              trader.rank === 1 && 'border-yellow-500/30 bg-yellow-500/5',
              trader.rank === 2 && 'border-gray-400/30 bg-gray-400/5',
              trader.rank === 3 && 'border-amber-600/30 bg-amber-600/5',
              trader.rank > 3 && 'border-border'
            )}
          >
            {/* Row 1: Rank + Address */}
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className={cn(
                  'text-xs font-bold w-5',
                  trader.rank === 1 && 'text-yellow-400',
                  trader.rank === 2 && 'text-gray-300',
                  trader.rank === 3 && 'text-amber-600',
                  trader.rank > 3 && 'text-muted-foreground'
                )}>
                  #{trader.rank}
                </span>
                <a
                  href={`https://sepolia.basescan.org/address/${trader.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-mono text-foreground hover:text-purple-400 flex items-center gap-1"
                >
                  {shortenAddress(trader.address)}
                  <ExternalLink className="h-2 w-2 opacity-50" />
                </a>
              </div>
              <span className="text-[9px] text-muted-foreground">
                {trader.totalTrades} trades
              </span>
            </div>

            {/* Row 2: Stats */}
            <div className="flex items-center justify-between text-[10px]">
              {/* W/L */}
              <div className="flex items-center gap-1">
                <span className="text-neon-green font-bold">{trader.wins}W</span>
                <span className="text-muted-foreground">/</span>
                <span className="text-neon-red font-bold">{trader.losses}L</span>
              </div>

              {/* Win Rate */}
              <div className={cn(
                'font-bold',
                trader.winRate >= 60 ? 'text-neon-green' : 
                trader.winRate >= 50 ? 'text-yellow-500' : 'text-neon-red'
              )}>
                {trader.winRate}%
              </div>

              {/* Rep */}
              <div className={cn(
                'font-bold font-mono',
                trader.reputation >= 0 ? 'text-neon-green' : 'text-neon-red'
              )}>
                {trader.reputation >= 0 ? '+' : ''}{trader.reputation}
              </div>
            </div>

            {/* Mini win rate bar */}
            <div className="h-1 bg-terminal-bg rounded-full overflow-hidden mt-1.5">
              <div 
                className={cn(
                  'h-full transition-all',
                  trader.winRate >= 60 ? 'bg-neon-green' : 
                  trader.winRate >= 50 ? 'bg-yellow-500' : 'bg-neon-red'
                )}
                style={{ width: `${trader.winRate}%` }}
              />
            </div>
          </div>
        ))}

        {traders.length === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            <Trophy className="h-6 w-6 mx-auto mb-2 opacity-30" />
            <p className="text-[10px]">No traders yet</p>
          </div>
        )}

        {/* Legend */}
        <div className="pt-2 border-t border-border text-[8px] text-muted-foreground text-center">
          Win = +50 pts • Loss = -25 pts
        </div>
      </CardContent>
    </Card>
  )
}
