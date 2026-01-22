'use client'

import { Card, CardContent, CardHeader, CardTitle } from './card'
import { ScrollText, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

export function PrizePoolRules() {
  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-foreground flex items-center gap-2 text-sm">
          <ScrollText className="h-4 w-4 text-muted-foreground" />
          HOW IT WORKS
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        {/* Scoring */}
        <div>
          <h4 className="text-xs font-bold text-foreground mb-2">Scoring System</h4>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[11px]">
              <CheckCircle className="h-3.5 w-3.5 text-neon-green" />
              <span className="text-muted-foreground">Winning trade:</span>
              <span className="font-bold text-neon-green">+50 points</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <XCircle className="h-3.5 w-3.5 text-neon-red" />
              <span className="text-muted-foreground">Losing trade:</span>
              <span className="font-bold text-neon-red">-25 points</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <AlertTriangle className="h-3.5 w-3.5 text-yellow-500" />
              <span className="text-muted-foreground">Expired trade:</span>
              <span className="font-bold text-yellow-500">0 points</span>
            </div>
          </div>
        </div>

        {/* Distribution */}
        <div>
          <h4 className="text-xs font-bold text-foreground mb-2">Prize Distribution</h4>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] bg-yellow-500/10 border border-yellow-500/20 rounded px-2 py-1.5">
              <span className="text-yellow-400">🥇 1st Place</span>
              <span className="font-bold text-yellow-400">50% of pool</span>
            </div>
            <div className="flex items-center justify-between text-[11px] bg-gray-400/10 border border-gray-400/20 rounded px-2 py-1.5">
              <span className="text-gray-300">🥈 2nd Place</span>
              <span className="font-bold text-gray-300">30% of pool</span>
            </div>
            <div className="flex items-center justify-between text-[11px] bg-amber-600/10 border border-amber-600/20 rounded px-2 py-1.5">
              <span className="text-amber-500">🥉 3rd Place</span>
              <span className="font-bold text-amber-500">20% of pool</span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div>
          <h4 className="text-xs font-bold text-foreground mb-2">Season Timeline</h4>
          <div className="bg-terminal-surface border border-border rounded p-3">
            <div className="space-y-2 text-[10px]">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-neon-green mt-1.5"></div>
                <div>
                  <span className="font-bold text-foreground">Start:</span>
                  <span className="text-muted-foreground ml-1">Monday 00:00 UTC</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5"></div>
                <div>
                  <span className="font-bold text-foreground">End:</span>
                  <span className="text-muted-foreground ml-1">Sunday 23:59 UTC</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5"></div>
                <div>
                  <span className="font-bold text-foreground">Payout:</span>
                  <span className="text-muted-foreground ml-1">Within 24h after season ends</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Requirements */}
        <div>
          <h4 className="text-xs font-bold text-foreground mb-2">Requirements</h4>
          <ul className="space-y-1 text-[10px] text-muted-foreground">
            <li>• Minimum 3 trades to qualify for prizes</li>
            <li>• Must have Ethos score ≥ 1200 to post signals</li>
            <li>• Trades must be verified (hit TP or SL)</li>
            <li>• One wallet per participant</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
