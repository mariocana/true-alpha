'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { TrendingUp } from 'lucide-react'

export function Header() {
  return (
    <header className="border-b border-border bg-terminal-surface/50 backdrop-blur">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded bg-gradient-to-br from-neon-green/20 to-neon-green/5 border border-neon-green/30 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-neon-green" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-neon-green tracking-tight">
                TRUEALPHA
              </h1>
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider">
                Reputation-Based Social Trading
              </p>
            </div>
          </div>

          <ConnectButton 
            showBalance={false}
            chainStatus="icon"
            accountStatus={{
              smallScreen: 'avatar',
              largeScreen: 'full',
            }}
          />
        </div>
      </div>
    </header>
  )
}
