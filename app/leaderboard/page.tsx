'use client'

import { Header } from '@/components/header'
import { PrizePool } from '@/components/prize-pool'
import { Leaderboard } from '@/components/leaderboard'
import { SeasonHistory } from '@/components/season-history'

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-terminal-bg">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-foreground">Prize Pool & Rankings</h1>
          <p className="text-sm text-muted-foreground">
            Compete for weekly rewards • Top traders split the prize pool
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-6">
          {/* Main Content - Prize Pool + Season History */}
          <div className="space-y-6">
            <PrizePool />
            <SeasonHistory />
          </div>

          {/* Sidebar - Full Leaderboard */}
          <aside>
            <div className="sticky top-4">
              <Leaderboard />
            </div>
          </aside>
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
