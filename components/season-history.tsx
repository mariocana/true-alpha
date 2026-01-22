'use client'

import { Card, CardContent, CardHeader, CardTitle } from './card'
import { History, Trophy, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PastSeason {
  season: number
  endDate: string
  totalPool: number
  winners: {
    place: number
    address: string
    winRate: number
    prize: number
  }[]
}

const MOCK_PAST_SEASONS: PastSeason[] = [
  {
    season: 2,
    endDate: 'Jan 14, 2026',
    totalPool: 0.32,
    winners: [
      { place: 1, address: '0x9876...5432', winRate: 78, prize: 0.16 },
      { place: 2, address: '0x7BAc...F2B2', winRate: 71, prize: 0.096 },
      { place: 3, address: '0xfedc...ba09', winRate: 65, prize: 0.064 },
    ]
  },
  {
    season: 1,
    endDate: 'Jan 7, 2026',
    totalPool: 0.18,
    winners: [
      { place: 1, address: '0x1234...5678', winRate: 82, prize: 0.09 },
      { place: 2, address: '0xabcd...ef12', winRate: 69, prize: 0.054 },
      { place: 3, address: '0x7BAc...F2B2', winRate: 64, prize: 0.036 },
    ]
  },
]

function shortenAddress(address: string): string {
  return address
}

function PlaceBadge({ place }: { place: number }) {
  const styles = {
    1: 'text-yellow-400',
    2: 'text-gray-300',
    3: 'text-amber-500',
  }
  
  const icons = {
    1: '🥇',
    2: '🥈',
    3: '🥉',
  }
  
  return (
    <span className={cn('text-sm', styles[place as keyof typeof styles])}>
      {icons[place as keyof typeof icons]}
    </span>
  )
}

export function SeasonHistory() {
  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-foreground flex items-center gap-2 text-sm">
          <History className="h-4 w-4 text-muted-foreground" />
          PAST SEASONS
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        {MOCK_PAST_SEASONS.map((season) => (
          <div 
            key={season.season}
            className="bg-terminal-surface border border-border rounded p-3"
          >
            {/* Season Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-yellow-400" />
                <span className="text-sm font-bold text-foreground">
                  Season {season.season}
                </span>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono text-neon-green">
                  {season.totalPool} ETH
                </div>
                <div className="text-[9px] text-muted-foreground">
                  {season.endDate}
                </div>
              </div>
            </div>

            {/* Winners */}
            <div className="space-y-1.5">
              {season.winners.map((winner) => (
                <div 
                  key={`${season.season}-${winner.place}`}
                  className="flex items-center justify-between text-[11px] bg-terminal-bg rounded px-2 py-1.5"
                >
                  <div className="flex items-center gap-2">
                    <PlaceBadge place={winner.place} />
                    <a
                      href={`https://sepolia.basescan.org/address/${winner.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-muted-foreground hover:text-foreground flex items-center gap-1"
                    >
                      {shortenAddress(winner.address)}
                      <ExternalLink className="h-2 w-2 opacity-50" />
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      'font-bold',
                      winner.winRate >= 70 ? 'text-neon-green' : 'text-yellow-500'
                    )}>
                      {winner.winRate}%
                    </span>
                    <span className="font-mono text-foreground">
                      +{winner.prize} ETH
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Info */}
        <p className="text-[9px] text-muted-foreground text-center pt-2">
          Seasons run weekly • Sunday 23:59 UTC → Sunday 23:59 UTC
        </p>
      </CardContent>
    </Card>
  )
}
