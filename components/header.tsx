'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { TrendingUp, Trophy, Home, Users } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export function Header() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'Signals', icon: Home, color: 'neon-green' },
    { href: '/prizepool', label: 'Prize Pool', icon: Trophy, color: 'yellow' },
    { href: '/social', label: 'Social', icon: Users, color: 'purple' },
  ]

  return (
    <header className="border-b border-border bg-terminal-surface/50 backdrop-blur">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo + Nav */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="h-8 w-8 rounded bg-gradient-to-br from-neon-green/20 to-neon-green/5 border border-neon-green/30 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-neon-green" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-neon-green tracking-tight">
                  TRUEALPHA
                </h1>
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider hidden sm:block">
                  Reputation-Based Social Trading
                </p>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                
                return (
                  <Link 
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all",
                      isActive && item.color === 'neon-green' && "bg-neon-green/10 text-neon-green border border-neon-green/30",
                      isActive && item.color === 'yellow' && "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30",
                      isActive && item.color === 'purple' && "bg-purple-500/10 text-purple-400 border border-purple-500/30",
                      !isActive && "text-muted-foreground hover:text-foreground hover:bg-terminal-bg"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Wallet Connect */}
          <ConnectButton 
            showBalance={false}
            chainStatus="icon"
            accountStatus={{
              smallScreen: 'avatar',
              largeScreen: 'full',
            }}
          />
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex items-center gap-2 mt-3 pt-3 border-t border-border">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link 
                key={item.href}
                href={item.href}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded text-xs font-medium transition-all",
                  isActive && item.color === 'neon-green' && "bg-neon-green/10 text-neon-green border border-neon-green/30",
                  isActive && item.color === 'yellow' && "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30",
                  isActive && item.color === 'purple' && "bg-purple-500/10 text-purple-400 border border-purple-500/30",
                  !isActive && "text-muted-foreground hover:text-foreground bg-terminal-bg"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
