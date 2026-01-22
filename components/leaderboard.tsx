'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Trophy, TrendingUp, TrendingDown, Medal, Crown, Award, ExternalLink } from 'lucide-react'
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
      // Sort by wins first, then by win rate
      if (b.wins !== a.wins) return b.wins - a.wins
      return b.winRate - a.winRate
    })
    .map((t, i) => ({ ...t, rank: i + 1 }))
  
  return traders.slice(0, 10) // Top 10
}

// Mock data for demo when no trades exist
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

function getRankIcon(rank: number) {
  switch (rank) {
    case 1:
      return <Crown className="h-4 w-4 text-yellow-400" />
    case 2:
      return <Medal className="h-4 w-4 text-gray-300" />
    case 3:
      return <Medal className="h-4 w-4 text-amber-600" />
    default:
      return <span className="text-xs text-muted-foreground font-mono">#{rank}</span>
  }
}

function getRankBg(rank: number) {
  switch (rank) {
    case 1:
      return 'bg-gradient-to-r from-yellow-500/10 to-transparent border-yellow-500/30'
    case 2:
      return 'bg-gradient-to-r from-gray-400/10 to-transparent border-gray-400/30'
    case 3:
      return 'bg-gradient-to-r from-amber-600/10 to-transparent border-amber-600/30'
    default:
      return 'bg-terminal-surface border-border'
  }
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

    // Listen for new trades
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
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-purple-400 flex items-center gap-2 text-sm">
            <Trophy className="h-4 w-4" />
            TOP TRADERS
          </CardTitle>
          {useMock && (
            <span className="text-[9px] px-1.5 py-0.5 bg-purple-500/10 border border-purple-500/30 rounded text-purple-400">
              DEMO DATA
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* Header Row */}
        <div className="grid grid-cols-12 gap-2 text-[9px] text-muted-foreground uppercase tracking-wider px-2 pb-1 border-b border-border">
          <div className="col-span-1">#</div>
          <div className="col-span-4">Trader</div>
          <div className="col-span-2 text-center">W/L</div>
          <div className="col-span-2 text-center">Win %</div>
          <div className="col-span-3 text-right">Rep</div>
        </div>

        {/* Trader Rows */}
        {traders.map((trader) => (
          <div
            key={trader.address}
            className={cn(
              'grid grid-cols-12 gap-2 items-center p-2 rounded border transition-all hover:border-purple-500/50',
              getRankBg(trader.rank)
            )}
          >
            {/* Rank */}
            <div className="col-span-1 flex items-center justify-center">
              {getRankIcon(trader.rank)}
            </div>

            {/* Address */}
            <div className="col-span-4">
              <a
                href={`https://sepolia.basescan.org/address/${trader.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs font-mono text-foreground hover:text-purple-400 transition-colors"
              >
                {shortenAddress(trader.address)}
                <ExternalLink className="h-2.5 w-2.5 opacity-50" />
              </a>
              <p className="text-[9px] text-muted-foreground">
                {trader.totalTrades} trades
              </p>
            </div>

            {/* W/L */}
            <div className="col-span-2 text-center">
              <div className="flex items-center justify-center gap-1 text-xs">
                <span className="text-neon-green font-bold">{trader.wins}</span>
                <span className="text-muted-foreground">/</span>
                <span className="text-neon-red font-bold">{trader.losses}</span>
              </div>
              {trader.pending > 0 && (
                <p className="text-[9px] text-yellow-500">
                  +{trader.pending} pending
                </p>
              )}
            </div>

            {/* Win Rate */}
            <div className="col-span-2 text-center">
              <div className={cn(
                'text-xs font-bold',
                trader.winRate >= 60 ? 'text-neon-green' : 
                trader.winRate >= 50 ? 'text-yellow-500' : 'text-neon-red'
              )}>
                {trader.winRate}%
              </div>
              {/* Mini progress bar */}
              <div className="h-1 bg-terminal-bg rounded-full overflow-hidden mt-1 mx-2">
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

            {/* Reputation */}
            <div className="col-span-3 text-right">
              <div className={cn(
                'text-xs font-bold font-mono',
                trader.reputation >= 0 ? 'text-neon-green' : 'text-neon-red'
              )}>
                {trader.reputation >= 0 ? '+' : ''}{trader.reputation}
              </div>
              <p className="text-[9px] text-muted-foreground">
                pts earned
              </p>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {traders.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <Trophy className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p className="text-xs">No traders yet</p>
            <p className="text-[10px]">Be the first to post a signal!</p>
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 border-t border-border">
          <p className="text-[9px] text-muted-foreground text-center">
            Rankings update automatically • Win = +50 pts • Loss = -25 pts
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
