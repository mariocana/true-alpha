'use client'

import { Header } from '@/components/header'
import { PrizePool } from '@/components/prize-pool'
import { SeasonHistory } from '@/components/season-history'
import { PrizePoolRules } from '@/components/prize-pool-rules'

export default function PrizePoolPage() {
  return (
    <div className="min-h-screen bg-terminal-bg">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-foreground">Weekly Prize Pool</h1>
          <p className="text-sm text-muted-foreground">
            Compete for weekly rewards • Top traders split the prize pool
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left - Prize Pool */}
          <div className="space-y-6">
            <PrizePool />
            <PrizePoolRules />
          </div>

          {/* Right - Season History */}
          <div>
            <SeasonHistory />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
            <div>
              <span className="text-neon-green">■</span> TRUEALPHA v1.0.0
            </div>
            <div className="flex items-center gap-4">
              <span>POWERED BY BASE</span>
              <span>•</span>
              <span>ETHOS NETWORK</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
