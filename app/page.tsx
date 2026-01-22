'use client'

import { Header } from '@/components/header'
import { Dashboard } from '@/components/dashboard'
import { SignalsFeed } from '@/components/signals-feed'
import { Leaderboard } from '@/components/leaderboard'

export default function Home() {
  return (
    <div className="min-h-screen bg-terminal-bg">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-[350px_1fr_280px] gap-6">
          {/* Left Sidebar - Dashboard */}
          <aside className="space-y-4">
            <Dashboard />
          </aside>

          {/* Main Content - Signals Feed */}
          <section>
            <SignalsFeed />
          </section>

          {/* Right Sidebar - Leaderboard */}
          <aside className="hidden lg:block">
            <div className="sticky top-4">
              <Leaderboard />
            </div>
          </aside>
        </div>

        {/* Mobile Leaderboard */}
        <div className="lg:hidden mt-6">
          <Leaderboard />
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
