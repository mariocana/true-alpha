'use client'

import { Card, CardContent } from './card'
import { TrendingUp, TrendingDown, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SignalCardProps {
  address: string
  ethosScore: number
  pair: string
  direction: 'LONG' | 'SHORT'
  targetPrice: string
  timestamp: number
  status: 'PENDING' | 'HIT' | 'MISS'
}

export function SignalCard({
  address,
  ethosScore,
  pair,
  direction,
  targetPrice,
  timestamp,
  status,
}: SignalCardProps) {
  const isLong = direction === 'LONG'
  const statusColor = status === 'HIT' ? 'text-neon-green' : status === 'MISS' ? 'text-neon-red' : 'text-yellow-500'

  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardContent className="p-4">
        <div className="grid grid-cols-[auto_1fr_auto] gap-4 items-center">
          {/* Avatar & Score */}
          <div className="flex flex-col items-center gap-1">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center">
              <span className="text-xs font-bold text-primary">
                {address.slice(2, 4).toUpperCase()}
              </span>
            </div>
            <div className="text-[10px] text-neon-green font-bold px-1.5 py-0.5 bg-neon-green/10 rounded border border-neon-green/30">
              {ethosScore}
            </div>
          </div>

          {/* Signal Info */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold">{pair}</span>
              <div
                className={cn(
                  'flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold',
                  isLong
                    ? 'bg-neon-green/10 text-neon-green border border-neon-green/30'
                    : 'bg-neon-red/10 text-neon-red border border-neon-red/30'
                )}
              >
                {isLong ? (
                  <TrendingUp className="h-2.5 w-2.5" />
                ) : (
                  <TrendingDown className="h-2.5 w-2.5" />
                )}
                {direction}
              </div>
            </div>

            <div className="text-[10px] text-muted-foreground">
              TARGET: <span className="text-foreground font-mono">${targetPrice}</span>
            </div>

            <div className="text-[10px] text-muted-foreground">
              {new Date(timestamp).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>

          {/* Status */}
          <div className="flex flex-col items-end gap-1">
            <div
              className={cn(
                'flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold border',
                statusColor,
                status === 'HIT' && 'bg-neon-green/10 border-neon-green/30 glow-green',
                status === 'MISS' && 'bg-neon-red/10 border-neon-red/30 glow-red',
                status === 'PENDING' && 'bg-yellow-500/10 border-yellow-500/30'
              )}
            >
              <Circle className="h-2 w-2 fill-current" />
              {status}
            </div>
            <div className="text-[9px] text-muted-foreground">
              {address.slice(0, 6)}...{address.slice(-4)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
