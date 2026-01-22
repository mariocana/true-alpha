'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Button } from './button'
import { 
  Users, 
  Bell, 
  BellRing, 
  UserPlus, 
  UserMinus, 
  ExternalLink,
  TrendingUp,
  TrendingDown,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Trader {
  address: string
  winRate: number
  totalTrades: number
  recentSignal?: {
    pair: string
    direction: 'LONG' | 'SHORT'
    timestamp: number
  }
  isFollowing: boolean
}

interface Notification {
  id: string
  trader: string
  pair: string
  direction: 'LONG' | 'SHORT'
  timestamp: number
  read: boolean
}

// Mock traders data
const MOCK_TRADERS: Trader[] = [
  { 
    address: '0x7BAcbbaadCbEeCc443F9885FAF6a2C9894E2F2B2', 
    winRate: 73, 
    totalTrades: 47,
    recentSignal: { pair: 'BTC/USD', direction: 'LONG', timestamp: Date.now() - 3600000 },
    isFollowing: true 
  },
  { 
    address: '0x1234567890abcdef1234567890abcdef12345678', 
    winRate: 69, 
    totalTrades: 38,
    recentSignal: { pair: 'ETH/USD', direction: 'SHORT', timestamp: Date.now() - 7200000 },
    isFollowing: true 
  },
  { 
    address: '0xabcdef1234567890abcdef1234567890abcdef12', 
    winRate: 67, 
    totalTrades: 29,
    isFollowing: false 
  },
  { 
    address: '0x9876543210fedcba9876543210fedcba98765432', 
    winRate: 65, 
    totalTrades: 22,
    recentSignal: { pair: 'SOL/USD', direction: 'LONG', timestamp: Date.now() - 1800000 },
    isFollowing: false 
  },
]

// Mock notifications
const MOCK_NOTIFICATIONS: Notification[] = [
  { 
    id: '1', 
    trader: '0x7BAc...F2B2', 
    pair: 'BTC/USD', 
    direction: 'LONG', 
    timestamp: Date.now() - 300000, // 5 min ago
    read: false 
  },
  { 
    id: '2', 
    trader: '0x1234...5678', 
    pair: 'ETH/USD', 
    direction: 'SHORT', 
    timestamp: Date.now() - 1800000, // 30 min ago
    read: false 
  },
  { 
    id: '3', 
    trader: '0x7BAc...F2B2', 
    pair: 'SOL/USD', 
    direction: 'LONG', 
    timestamp: Date.now() - 7200000, // 2 hours ago
    read: true 
  },
]

function shortenAddress(address: string): string {
  if (!address || address.length < 10) return address
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

export function FollowingTraders() {
  const [traders, setTraders] = useState<Trader[]>(MOCK_TRADERS)
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS)
  const [showNotifications, setShowNotifications] = useState(false)

  const followingCount = traders.filter(t => t.isFollowing).length
  const unreadCount = notifications.filter(n => !n.read).length

  const toggleFollow = (address: string) => {
    setTraders(prev => prev.map(t => 
      t.address === address ? { ...t, isFollowing: !t.isFollowing } : t
    ))
  }

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  return (
    <div className="space-y-4">
      {/* Notifications Panel */}
      <Card className={cn(
        "border-blue-500/30",
        unreadCount > 0 && "bg-gradient-to-br from-blue-500/5 to-transparent"
      )}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-blue-400 flex items-center gap-2 text-sm">
              {unreadCount > 0 ? (
                <BellRing className="h-4 w-4 animate-pulse" />
              ) : (
                <Bell className="h-4 w-4" />
              )}
              NOTIFICATIONS
            </CardTitle>
            {unreadCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 bg-blue-500 text-white rounded-full font-bold">
                {unreadCount}
              </span>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {notifications.length === 0 ? (
            <p className="text-[10px] text-muted-foreground text-center py-3">
              No notifications yet
            </p>
          ) : (
            <div className="space-y-2">
              {notifications.slice(0, 3).map((notif) => (
                <div 
                  key={notif.id}
                  className={cn(
                    "flex items-start justify-between gap-2 p-2 rounded border",
                    notif.read 
                      ? "bg-terminal-surface border-border" 
                      : "bg-blue-500/10 border-blue-500/30"
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-foreground">
                        {notif.trader}
                      </span>
                      <span className={cn(
                        "text-[9px] px-1 py-0.5 rounded font-bold",
                        notif.direction === 'LONG' 
                          ? "bg-neon-green/20 text-neon-green" 
                          : "bg-neon-red/20 text-neon-red"
                      )}>
                        {notif.direction}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-foreground font-semibold">
                        {notif.pair}
                      </span>
                      <span className="text-[9px] text-muted-foreground">
                        {timeAgo(notif.timestamp)}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => dismissNotification(notif.id)}
                    className="text-muted-foreground hover:text-foreground p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}

              {unreadCount > 0 && (
                <button 
                  onClick={markAllRead}
                  className="text-[10px] text-blue-400 hover:text-blue-300 w-full text-center py-1"
                >
                  Mark all as read
                </button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Following Traders */}
      <Card className="border-purple-500/30">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-purple-400 flex items-center gap-2 text-sm">
              <Users className="h-4 w-4" />
              FOLLOWING
            </CardTitle>
            <span className="text-[10px] text-muted-foreground">
              {followingCount} traders
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-2 pt-0">
          {traders.map((trader) => (
            <div 
              key={trader.address}
              className={cn(
                "p-2 rounded border transition-all",
                trader.isFollowing 
                  ? "bg-purple-500/5 border-purple-500/30" 
                  : "bg-terminal-surface border-border"
              )}
            >
              {/* Trader Info Row */}
              <div className="flex items-center justify-between mb-1.5">
                <a
                  href={`https://sepolia.basescan.org/address/${trader.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-mono text-foreground hover:text-purple-400 flex items-center gap-1"
                >
                  {shortenAddress(trader.address)}
                  <ExternalLink className="h-2 w-2 opacity-50" />
                </a>
                <button
                  onClick={() => toggleFollow(trader.address)}
                  className={cn(
                    "p-1 rounded transition-all",
                    trader.isFollowing 
                      ? "text-purple-400 hover:text-purple-300 hover:bg-purple-500/10" 
                      : "text-muted-foreground hover:text-foreground hover:bg-terminal-bg"
                  )}
                >
                  {trader.isFollowing ? (
                    <UserMinus className="h-3.5 w-3.5" />
                  ) : (
                    <UserPlus className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>

              {/* Stats Row */}
              <div className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "font-bold",
                    trader.winRate >= 70 ? "text-neon-green" : 
                    trader.winRate >= 50 ? "text-yellow-500" : "text-neon-red"
                  )}>
                    {trader.winRate}% win
                  </span>
                  <span className="text-muted-foreground">
                    {trader.totalTrades} trades
                  </span>
                </div>
              </div>

              {/* Recent Signal */}
              {trader.recentSignal && trader.isFollowing && (
                <div className="mt-1.5 pt-1.5 border-t border-border">
                  <div className="flex items-center gap-1.5 text-[9px]">
                    <span className="text-muted-foreground">Latest:</span>
                    <span className="font-semibold text-foreground">
                      {trader.recentSignal.pair}
                    </span>
                    {trader.recentSignal.direction === 'LONG' ? (
                      <TrendingUp className="h-3 w-3 text-neon-green" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-neon-red" />
                    )}
                    <span className="text-muted-foreground ml-auto">
                      {timeAgo(trader.recentSignal.timestamp)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Info */}
          <div className="bg-purple-500/5 border border-purple-500/20 rounded p-2 mt-2">
            <p className="text-[9px] text-muted-foreground leading-relaxed">
              💡 Follow top traders to get notified when they post new signals. Never miss an alpha!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
