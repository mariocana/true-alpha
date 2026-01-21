'use client'

import { Card, CardContent } from './card'
import { TrendingUp, TrendingDown, Circle, Clock, Target, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TradeSignal } from '@/hooks/useTradeVerification'
import { useTradeVerification } from '@/hooks/useTradeVerification'

interface SignalCardProps {
  signal: TradeSignal
  ethosScore: number
}

export function SignalCard({ signal, ethosScore }: SignalCardProps) {
  // Automatically verify trade status on mount
  const { status, loading, closedAt, closedPrice } = useTradeVerification(signal)

  const isLong = signal.direction === 'LONG'
  const displayStatus = status || signal.status || 'PENDING'
  
  const statusConfig = {
    WIN: { color: 'text-neon-green', bg: 'bg-neon-green/10', border: 'border-neon-green/30', glow: 'glow-green' },
    LOSS: { color: 'text-neon-red', bg: 'bg-neon-red/10', border: 'border-neon-red/30', glow: 'glow-red' },
    EXPIRED: { color: 'text-muted-foreground', bg: 'bg-muted/10', border: 'border-muted/30', glow: '' },
    PENDING: { color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', glow: '' },
  }

  const config = statusConfig[displayStatus]

  // Calculate potential gain/loss percentages
  const potentialGain = ((signal.targetPrice - signal.entryPrice) / signal.entryPrice) * 100
  const potentialLoss = ((signal.entryPrice - signal.stopLoss) / signal.entryPrice) * 100
  const riskReward = Math.abs(potentialGain / potentialLoss)

  return (
    <Card className={cn(
      'hover:border-primary/50 transition-all',
      displayStatus === 'WIN' && 'border-neon-green/50 glow-green',
      displayStatus === 'LOSS' && 'border-neon-red/50 glow-red'
    )}>
      <CardContent className="p-4">
        <div className="grid grid-cols-[auto_1fr_auto] gap-4 items-start">
          {/* Left: Avatar & Score */}
          <div className="flex flex-col items-center gap-1">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center">
              <span className="text-xs font-bold text-primary">
                {signal.trader.slice(2, 4).toUpperCase()}
              </span>
            </div>
            <div className="text-[10px] text-neon-green font-bold px-1.5 py-0.5 bg-neon-green/10 rounded border border-neon-green/30">
              {ethosScore}
            </div>
          </div>

          {/* Center: Signal Info */}
          <div className="space-y-2 min-w-0">
            {/* Header: Pair + Direction */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold">{signal.pair}</span>
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
                {signal.direction}
              </div>
            </div>

            {/* Prices Grid */}
            <div className="grid grid-cols-3 gap-2 text-[10px]">
              <div>
                <div className="text-muted-foreground">ENTRY</div>
                <div className="font-mono font-bold">${signal.entryPrice.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-neon-green flex items-center gap-1">
                  <Target className="h-2.5 w-2.5" />
                  TP
                </div>
                <div className="font-mono font-bold text-neon-green">${signal.targetPrice.toLocaleString()}</div>
                <div className="text-muted-foreground">+{potentialGain.toFixed(1)}%</div>
              </div>
              <div>
                <div className="text-neon-red flex items-center gap-1">
                  <Shield className="h-2.5 w-2.5" />
                  SL
                </div>
                <div className="font-mono font-bold text-neon-red">${signal.stopLoss.toLocaleString()}</div>
                <div className="text-muted-foreground">-{potentialLoss.toFixed(1)}%</div>
              </div>
            </div>

            {/* Meta Info */}
            <div className="flex items-center gap-3 text-[9px] text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-2.5 w-2.5" />
                {new Date(signal.timestamp).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
              <div>R/R: 1:{riskReward.toFixed(2)}</div>
              <div>Expires: {signal.expiresIn}</div>
            </div>

            {/* Closed Info */}
            {displayStatus !== 'PENDING' && closedAt && (
              <div className="text-[9px] text-muted-foreground border-t border-border pt-1.5 mt-1.5">
                Closed at ${closedPrice?.toLocaleString() || 'N/A'} on {new Date(closedAt).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            )}
          </div>

          {/* Right: Status */}
          <div className="flex flex-col items-end gap-1">
            <div
              className={cn(
                'flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold border',
                config.color,
                config.bg,
                config.border,
                config.glow
              )}
            >
              <Circle className="h-2 w-2 fill-current" />
              {loading ? 'CHECKING...' : displayStatus}
            </div>
            <div className="text-[9px] text-muted-foreground">
              {signal.trader.slice(0, 6)}...{signal.trader.slice(-4)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
