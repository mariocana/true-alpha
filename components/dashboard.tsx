'use client'

import { useAccount } from 'wagmi'
import { useEthosScore } from '@/hooks/useEthosScore'
import { SignalForm } from './signal-form'
import { RoadToAlpha } from './road-to-alpha'
import { Card, CardContent } from './card'
import { Shield, AlertCircle, Loader2, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

const REPUTATION_THRESHOLD = 1200

export function Dashboard() {
  const { isConnected } = useAccount()
  const { score, badges, loading, error } = useEthosScore()

  if (!isConnected) {
    return (
      <Card className="border-yellow-500/30">
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-3 text-yellow-500" />
          <p className="text-sm text-muted-foreground">
            CONNECT WALLET TO ACCESS TRUEALPHA
          </p>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Loader2 className="h-8 w-8 mx-auto mb-3 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            LOADING CREDIBILITY SCORE...
          </p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-neon-red/30">
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-3 text-neon-red" />
          <p className="text-sm text-neon-red">{error}</p>
        </CardContent>
      </Card>
    )
  }

  const canPost = score >= REPUTATION_THRESHOLD
  const scorePercentage = Math.min((score / 2000) * 100, 100)

  return (
    <div className="space-y-4">
      {/* Reputation Score Display */}
      <Card className={cn(
        'border-2',
        canPost ? 'border-neon-green/50 glow-green' : 'border-yellow-500/30'
      )}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                'p-2 rounded-sm border',
                canPost ? 'border-neon-green/30 bg-neon-green/10' : 'border-yellow-500/30 bg-yellow-500/10'
              )}>
                <Shield className={cn(
                  'h-5 w-5',
                  canPost ? 'text-neon-green' : 'text-yellow-500'
                )} />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Ethos Credibility Score
                </p>
                <p className={cn(
                  'text-2xl font-bold font-mono',
                  canPost ? 'text-neon-green' : 'text-yellow-500'
                )}>
                  {score.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                Status
              </p>
              <div className={cn(
                'px-2 py-1 rounded text-[10px] font-bold border',
                canPost 
                  ? 'bg-neon-green/10 text-neon-green border-neon-green/30'
                  : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30'
              )}>
                {canPost ? 'AUTHORIZED' : 'READ ONLY'}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3">
            <div className="h-1 bg-terminal-bg rounded-full overflow-hidden">
              <div 
                className={cn(
                  'h-full transition-all duration-500',
                  canPost ? 'bg-neon-green' : 'bg-yellow-500'
                )}
                style={{ width: `${scorePercentage}%` }}
              />
            </div>
            <p className="text-[9px] text-muted-foreground mt-1">
              {canPost 
                ? `${score - REPUTATION_THRESHOLD} points above threshold`
                : `${REPUTATION_THRESHOLD - score} points needed to post signals`
              }
            </p>
          </div>

          {/* Badges */}
          {badges.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-2">
                Achievements
              </p>
              <div className="flex flex-wrap gap-1.5">
                {badges.map((badge, i) => (
                  <div
                    key={i}
                    className="px-2 py-0.5 text-[10px] font-bold bg-gradient-to-r from-neon-green/20 to-neon-green/5 border border-neon-green/30 rounded-sm text-neon-green"
                  >
                    {badge}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Conditional Content */}
      {canPost ? (
        <SignalForm />
      ) : (
        <RoadToAlpha currentScore={score} />
      )}
    </div>
  )
}
