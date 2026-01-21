'use client'

import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Button } from './button'
import { ExternalLink, Trophy, TrendingUp } from 'lucide-react'

interface RoadToAlphaTask {
  id: string
  title: string
  description: string
  points: number
}

export function RoadToAlpha({ currentScore }: { currentScore: number }) {
  const pointsNeeded = Math.max(0, 1200 - currentScore)
  const progressPercentage = Math.min(
    ((currentScore / 1200) * 100),
    100
  )

  return (
    <Card className="border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-transparent">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-blue-400 flex items-center gap-2 mb-1">
              <Trophy className="h-4 w-4" />
              ROAD TO ALPHA
            </CardTitle>
            <p className="text-[10px] text-muted-foreground">
              Build your on-chain reputation to unlock posting privileges
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs text-blue-400 font-bold">
              {currentScore} / 1200
            </div>
            <div className="text-[9px] text-muted-foreground">
              {pointsNeeded} pts needed
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current Status Badge */}
        <div className="bg-terminal-bg border border-yellow-500/30 rounded-sm p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 border border-yellow-500/30 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-yellow-500" />
              </div>
              <div>
                <div className="text-xs font-bold text-yellow-500">ROOKIE TRADER</div>
                <div className="text-[9px] text-muted-foreground">Read-Only Access</div>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-2">
            <div className="h-1.5 bg-terminal-surface rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[8px] text-muted-foreground">Current</span>
              <span className="text-[8px] text-blue-400 font-bold">{progressPercentage.toFixed(0)}%</span>
              <span className="text-[8px] text-muted-foreground">Alpha</span>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-500/10 to-transparent border-l-2 border-blue-500 p-3 rounded-sm">
          <p className="text-xs font-semibold text-blue-400 mb-1">
            Want to post your signals?
          </p>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Build your on-chain reputation on Ethos Network. Each action below increases your Credibility Score.
          </p>
        </div>

        {/* Simple Task List */}
        <div className="space-y-3">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            How to Increase Your Score
          </div>
        </div>

        {/* Learn More - SINGLE LINK TO ETHOS */}
        <Button
          variant="outline"
          className="w-full border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
          onClick={() => window.open('https://www.ethos.network', '_blank')}
        >
          <span className="flex items-center gap-2">
            <span>Start Building Your Reputation on Ethos</span>
            <ExternalLink className="h-3 w-3" />
          </span>
        </Button>

        {/* Info Box */}
        <div className="bg-blue-500/5 border border-blue-500/20 rounded-sm p-2">
          <p className="text-[9px] text-muted-foreground leading-relaxed">
            💡 <span className="text-blue-400 font-semibold">Tip:</span> Ethos uses a decentralized reputation system. Your score is based on real community interactions like reviews, vouches, and attestations. The more you participate authentically, the higher your score!
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
