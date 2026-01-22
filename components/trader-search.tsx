'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Input } from './input'
import { Button } from './button'
import { 
  Search, 
  UserPlus, 
  UserCheck, 
  ExternalLink, 
  TrendingUp, 
  TrendingDown,
  AlertCircle,
  Loader2,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface TraderProfile {
  address: string
  ethosScore: number
  totalTrades: number
  wins: number
  losses: number
  winRate: number
  reputation: number
  recentSignals: {
    pair: string
    direction: 'LONG' | 'SHORT'
    status: 'WIN' | 'LOSS' | 'PENDING'
    timestamp: number
  }[]
  isFollowing: boolean
}

// Mock database of traders
const MOCK_TRADERS_DB: Record<string, TraderProfile> = {
  '0x7bacbbaadcbeecc443f9885faf6a2c9894e2f2b2': {
    address: '0x7BAcbbaadCbEeCc443F9885FAF6a2C9894E2F2B2',
    ethosScore: 1500,
    totalTrades: 47,
    wins: 32,
    losses: 12,
    winRate: 73,
    reputation: 1300,
    recentSignals: [
      { pair: 'BTC/USD', direction: 'LONG', status: 'WIN', timestamp: Date.now() - 3600000 },
      { pair: 'ETH/USD', direction: 'LONG', status: 'LOSS', timestamp: Date.now() - 7200000 },
      { pair: 'SOL/USD', direction: 'SHORT', status: 'WIN', timestamp: Date.now() - 86400000 },
    ],
    isFollowing: false,
  },
  '0x1234567890abcdef1234567890abcdef12345678': {
    address: '0x1234567890abcdef1234567890abcdef12345678',
    ethosScore: 1350,
    totalTrades: 38,
    wins: 24,
    losses: 11,
    winRate: 69,
    reputation: 875,
    recentSignals: [
      { pair: 'ETH/USD', direction: 'SHORT', status: 'WIN', timestamp: Date.now() - 1800000 },
      { pair: 'BTC/USD', direction: 'LONG', status: 'PENDING', timestamp: Date.now() - 3600000 },
    ],
    isFollowing: true,
  },
  '0xabcdef1234567890abcdef1234567890abcdef12': {
    address: '0xabcdef1234567890abcdef1234567890abcdef12',
    ethosScore: 980,
    totalTrades: 15,
    wins: 8,
    losses: 5,
    winRate: 62,
    reputation: 275,
    recentSignals: [
      { pair: 'SOL/USD', direction: 'LONG', status: 'PENDING', timestamp: Date.now() - 900000 },
    ],
    isFollowing: false,
  },
}

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

export function TraderSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResult, setSearchResult] = useState<TraderProfile | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [following, setFollowing] = useState<Set<string>>(new Set(['0x1234567890abcdef1234567890abcdef12345678']))

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setNotFound(false)
    setSearchResult(null)

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))

    const normalizedQuery = searchQuery.toLowerCase().trim()
    
    // Search in mock database
    const found = MOCK_TRADERS_DB[normalizedQuery]
    
    if (found) {
      setSearchResult({
        ...found,
        isFollowing: following.has(found.address.toLowerCase())
      })
    } else {
      setNotFound(true)
    }

    setIsSearching(false)
  }

  const toggleFollow = (address: string) => {
    const normalizedAddress = address.toLowerCase()
    setFollowing(prev => {
      const newSet = new Set(prev)
      if (newSet.has(normalizedAddress)) {
        newSet.delete(normalizedAddress)
      } else {
        newSet.add(normalizedAddress)
      }
      return newSet
    })
    
    if (searchResult) {
      setSearchResult({
        ...searchResult,
        isFollowing: !searchResult.isFollowing
      })
    }
  }

  const clearSearch = () => {
    setSearchQuery('')
    setSearchResult(null)
    setNotFound(false)
  }

  return (
    <Card className="border-blue-500/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-blue-400 flex items-center gap-2 text-sm">
          <Search className="h-4 w-4" />
          SEARCH TRADERS
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        {/* Search Input */}
        <div className="space-y-2">
          <div className="relative">
            <Input
              placeholder="Enter wallet address (0x...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pr-8 font-mono text-xs"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button
            onClick={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            size="sm"
          >
            {isSearching ? (
              <>
                <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="h-3 w-3 mr-2" />
                Search Trader
              </>
            )}
          </Button>
        </div>

        {/* Demo Addresses */}
        <div className="bg-terminal-surface border border-border rounded p-2">
          <p className="text-[9px] text-muted-foreground mb-1.5">Try these addresses:</p>
          <div className="space-y-1">
            {Object.values(MOCK_TRADERS_DB).slice(0, 3).map((trader) => (
              <button
                key={trader.address}
                onClick={() => {
                  setSearchQuery(trader.address)
                  setSearchResult(null)
                  setNotFound(false)
                }}
                className="block w-full text-left text-[9px] font-mono text-blue-400 hover:text-blue-300 truncate"
              >
                {trader.address}
              </button>
            ))}
          </div>
        </div>

        {/* Not Found */}
        {notFound && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-3 text-center">
            <AlertCircle className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
            <p className="text-xs text-yellow-500 font-semibold">Trader Not Found</p>
            <p className="text-[10px] text-muted-foreground mt-1">
              This address has no trading history on TrueAlpha
            </p>
          </div>
        )}

        {/* Search Result */}
        {searchResult && (
          <div className="bg-terminal-surface border border-blue-500/30 rounded p-3 space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <a
                  href={`https://sepolia.basescan.org/address/${searchResult.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-foreground hover:text-blue-400 flex items-center gap-1"
                >
                  {shortenAddress(searchResult.address)}
                  <ExternalLink className="h-2.5 w-2.5 opacity-50" />
                </a>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-muted-foreground">
                    Ethos Score:
                  </span>
                  <span className={cn(
                    "text-[10px] font-bold",
                    searchResult.ethosScore >= 1200 ? "text-neon-green" : "text-yellow-500"
                  )}>
                    {searchResult.ethosScore}
                  </span>
                </div>
              </div>
              <Button
                onClick={() => toggleFollow(searchResult.address)}
                size="sm"
                variant={searchResult.isFollowing ? "outline" : "default"}
                className={cn(
                  "text-[10px] h-7 px-2",
                  searchResult.isFollowing 
                    ? "border-neon-green/30 text-neon-green hover:bg-neon-green/10" 
                    : "bg-blue-500 hover:bg-blue-600"
                )}
              >
                {searchResult.isFollowing ? (
                  <>
                    <UserCheck className="h-3 w-3 mr-1" />
                    Following
                  </>
                ) : (
                  <>
                    <UserPlus className="h-3 w-3 mr-1" />
                    Follow
                  </>
                )}
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-terminal-bg rounded p-2 text-center">
                <div className="text-sm font-bold text-foreground">{searchResult.totalTrades}</div>
                <div className="text-[8px] text-muted-foreground">Trades</div>
              </div>
              <div className="bg-terminal-bg rounded p-2 text-center">
                <div className={cn(
                  "text-sm font-bold",
                  searchResult.winRate >= 60 ? "text-neon-green" : 
                  searchResult.winRate >= 50 ? "text-yellow-500" : "text-neon-red"
                )}>
                  {searchResult.winRate}%
                </div>
                <div className="text-[8px] text-muted-foreground">Win Rate</div>
              </div>
              <div className="bg-terminal-bg rounded p-2 text-center">
                <div className={cn(
                  "text-sm font-bold",
                  searchResult.reputation >= 0 ? "text-neon-green" : "text-neon-red"
                )}>
                  {searchResult.reputation >= 0 ? '+' : ''}{searchResult.reputation}
                </div>
                <div className="text-[8px] text-muted-foreground">Rep</div>
              </div>
            </div>

            {/* W/L */}
            <div className="flex items-center justify-center gap-4 text-xs">
              <span className="text-neon-green font-bold">{searchResult.wins} Wins</span>
              <span className="text-muted-foreground">/</span>
              <span className="text-neon-red font-bold">{searchResult.losses} Losses</span>
            </div>

            {/* Recent Signals */}
            {searchResult.recentSignals.length > 0 && (
              <div>
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-1.5">
                  Recent Signals
                </p>
                <div className="space-y-1">
                  {searchResult.recentSignals.map((signal, i) => (
                    <div 
                      key={i}
                      className="flex items-center justify-between bg-terminal-bg rounded px-2 py-1.5 text-[10px]"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">{signal.pair}</span>
                        {signal.direction === 'LONG' ? (
                          <TrendingUp className="h-3 w-3 text-neon-green" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-neon-red" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "px-1.5 py-0.5 rounded text-[9px] font-bold",
                          signal.status === 'WIN' && "bg-neon-green/20 text-neon-green",
                          signal.status === 'LOSS' && "bg-neon-red/20 text-neon-red",
                          signal.status === 'PENDING' && "bg-yellow-500/20 text-yellow-500"
                        )}>
                          {signal.status}
                        </span>
                        <span className="text-muted-foreground">
                          {timeAgo(signal.timestamp)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Info */}
        <p className="text-[9px] text-muted-foreground text-center">
          Search any wallet address to view their trading history and follow them
        </p>
      </CardContent>
    </Card>
  )
}
