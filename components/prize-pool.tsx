'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Trophy, Clock, Zap, TrendingUp, Gift, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

// Mock data
const MOCK_POOL = {
  totalPool: 0.25,
  currency: 'ETH',
  seasonNumber: 3,
  participants: 47,
  tradesThisSeason: 156,
}

const MOCK_DISTRIBUTION = [
  { place: 1, percentage: 50, address: '0x7BAc...F2B2', amount: 0.125 },
  { place: 2, percentage: 30, address: '0x1234...5678', amount: 0.075 },
  { place: 3, percentage: 20, address: '0xabcd...ef12', amount: 0.05 },
]

function getTimeUntilEndOfWeek(): { days: number; hours: number; minutes: number; seconds: number } {
  const now = new Date()
  const endOfWeek = new Date()
  
  // Set to next Sunday 23:59:59 UTC
  const daysUntilSunday = (7 - now.getUTCDay()) % 7 || 7
  endOfWeek.setUTCDate(now.getUTCDate() + daysUntilSunday)
  endOfWeek.setUTCHours(23, 59, 59, 999)
  
  const diff = endOfWeek.getTime() - now.getTime()
  
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  }
}

function PlaceBadge({ place }: { place: number }) {
  const colors = {
    1: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    2: 'bg-gray-400/20 text-gray-300 border-gray-400/30',
    3: 'bg-amber-600/20 text-amber-500 border-amber-600/30',
  }
  
  const labels = {
    1: '🥇 1st',
    2: '🥈 2nd', 
    3: '🥉 3rd',
  }
  
  return (
    <span className={cn(
      'text-[10px] font-bold px-2 py-0.5 rounded border',
      colors[place as keyof typeof colors]
    )}>
      {labels[place as keyof typeof labels]}
    </span>
  )
}

export function PrizePool() {
  const [timeLeft, setTimeLeft] = useState(getTimeUntilEndOfWeek())

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeUntilEndOfWeek())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <Card className="border-yellow-500/30 bg-gradient-to-br from-yellow-500/5 to-transparent">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-yellow-400 flex items-center gap-2 text-sm">
            <Trophy className="h-4 w-4" />
            WEEKLY ALPHA POOL
          </CardTitle>
          <span className="text-[9px] px-1.5 py-0.5 bg-yellow-500/10 border border-yellow-500/30 rounded text-yellow-400">
            SEASON {MOCK_POOL.seasonNumber}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        {/* Prize Pool Amount */}
        <div className="bg-terminal-bg border border-yellow-500/20 rounded p-3 text-center">
          <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-1">
            Current Prize Pool
          </p>
          <div className="flex items-center justify-center gap-2">
            <Zap className="h-5 w-5 text-yellow-400" />
            <span className="text-2xl font-bold text-yellow-400 font-mono">
              {MOCK_POOL.totalPool}
            </span>
            <span className="text-sm text-yellow-400/70">
              {MOCK_POOL.currency}
            </span>
          </div>
          <p className="text-[9px] text-muted-foreground mt-1">
            ≈ ${(MOCK_POOL.totalPool * 2500).toLocaleString()} USD
          </p>
        </div>

        {/* Countdown Timer */}
        <div className="bg-terminal-surface border border-border rounded p-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Clock className="h-3 w-3" />
              Season ends in
            </div>
          </div>
          <div className="grid grid-cols-4 gap-1 text-center">
            <div className="bg-terminal-bg rounded p-1.5">
              <div className="text-lg font-bold font-mono text-foreground">
                {timeLeft.days}
              </div>
              <div className="text-[8px] text-muted-foreground uppercase">Days</div>
            </div>
            <div className="bg-terminal-bg rounded p-1.5">
              <div className="text-lg font-bold font-mono text-foreground">
                {timeLeft.hours.toString().padStart(2, '0')}
              </div>
              <div className="text-[8px] text-muted-foreground uppercase">Hrs</div>
            </div>
            <div className="bg-terminal-bg rounded p-1.5">
              <div className="text-lg font-bold font-mono text-foreground">
                {timeLeft.minutes.toString().padStart(2, '0')}
              </div>
              <div className="text-[8px] text-muted-foreground uppercase">Min</div>
            </div>
            <div className="bg-terminal-bg rounded p-1.5">
              <div className="text-lg font-bold font-mono text-neon-green animate-pulse">
                {timeLeft.seconds.toString().padStart(2, '0')}
              </div>
              <div className="text-[8px] text-muted-foreground uppercase">Sec</div>
            </div>
          </div>
        </div>

        {/* Distribution Preview */}
        <div>
          <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-2">
            Prize Distribution
          </p>
          <div className="space-y-1.5">
            {MOCK_DISTRIBUTION.map((item) => (
              <div 
                key={item.place}
                className="flex items-center justify-between bg-terminal-surface border border-border rounded p-2"
              >
                <div className="flex items-center gap-2">
                  <PlaceBadge place={item.place} />
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {item.address}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-foreground">
                    {item.amount} {MOCK_POOL.currency}
                  </div>
                  <div className="text-[9px] text-muted-foreground">
                    {item.percentage}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="bg-terminal-surface border border-border rounded p-2 text-center">
            <Users className="h-3 w-3 mx-auto mb-1 text-muted-foreground" />
            <div className="text-sm font-bold text-foreground">{MOCK_POOL.participants}</div>
            <div className="text-[8px] text-muted-foreground">Participants</div>
          </div>
          <div className="bg-terminal-surface border border-border rounded p-2 text-center">
            <TrendingUp className="h-3 w-3 mx-auto mb-1 text-muted-foreground" />
            <div className="text-sm font-bold text-foreground">{MOCK_POOL.tradesThisSeason}</div>
            <div className="text-[8px] text-muted-foreground">Trades</div>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-yellow-500/5 border border-yellow-500/20 rounded p-2">
          <div className="flex items-start gap-2">
            <Gift className="h-3 w-3 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[9px] text-yellow-400 font-semibold mb-0.5">
                How to Win
              </p>
              <p className="text-[8px] text-muted-foreground leading-relaxed">
                Post winning signals to climb the leaderboard. Top 3 traders at the end of each week split the prize pool. More wins = higher rank = bigger rewards!
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
