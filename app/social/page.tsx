'use client'

import { Header } from '@/components/header'
import { Leaderboard } from '@/components/leaderboard'
import { FollowingTraders } from '@/components/following-traders'
import { TraderSearch } from '@/components/trader-search'

export default function SocialPage() {
  return (
    <div className="min-h-screen bg-terminal-bg">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-foreground">Social Activity</h1>
          <p className="text-sm text-muted-foreground">
            Follow top traders • Get notified on new signals • Build your network
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left - Search Traders */}
          <div>
            <TraderSearch />
          </div>

          {/* Center - Leaderboard */}
          <div>
            <Leaderboard />
          </div>

          {/* Right - Following */}
          <div>
            <FollowingTraders />
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
