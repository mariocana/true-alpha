'use client'

import { useState, useEffect } from 'react'

export interface TradeSignal {
  id: string
  trader: string
  token: string
  entryPrice: number
  targetPrice: number
  stopLoss: number
  timestamp: number
  expiresIn: '24h' | '3d' | '7d'
  direction: 'LONG' | 'SHORT'
  status?: 'PENDING' | 'WIN' | 'LOSS' | 'EXPIRED'
  closedAt?: number
  closedPrice?: number
}

const EXPIRY_DURATION = {
  '24h': 24 * 60 * 60 * 1000,
  '3d': 3 * 24 * 60 * 60 * 1000,
  '7d': 7 * 24 * 60 * 60 * 1000,
}

/**
 * 🎭 MOCK verification for smooth demo
 * For real implementation: replace getMockVerificationResult with real CoinGecko OHLC check
 */
export function useTradeVerification(trade: TradeSignal) {
  const [status, setStatus] = useState<TradeSignal['status']>(trade.status || 'PENDING')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [closedAt, setClosedAt] = useState<number | undefined>(trade.closedAt)
  const [closedPrice, setClosedPrice] = useState<number | undefined>(trade.closedPrice)

  useEffect(() => {
    // Skip if already resolved
    if (trade.status === 'WIN' || trade.status === 'LOSS' || trade.status === 'EXPIRED') {
      setStatus(trade.status)
      setClosedAt(trade.closedAt)
      setClosedPrice(trade.closedPrice)
      return
    }

    checkTradeStatus(trade)
  }, [trade.id])

  const checkTradeStatus = async (trade: TradeSignal) => {
    setLoading(true)
    setError(null)

    try {
      const now = Date.now()
      const expiryTime = trade.timestamp + EXPIRY_DURATION[trade.expiresIn]

      // Check if trade has expired
      if (now > expiryTime) {
        setStatus('EXPIRED')
        setClosedAt(now)
        setClosedPrice(trade.entryPrice)
        updateLocalStorage(trade.id, 'EXPIRED', now, trade.entryPrice)
        setLoading(false)
        return
      }

      // 🎭 MOCK verification for demo (simulate checking OHLC data)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockResult = getMockVerificationResult(trade)
      
      setStatus(mockResult.status)
      setClosedAt(mockResult.closedAt)
      setClosedPrice(mockResult.closedPrice)
      
      if (mockResult.status !== 'PENDING') {
        updateLocalStorage(
          trade.id,
          mockResult.status,
          mockResult.closedAt!,
          mockResult.closedPrice!
        )
      }

    } catch (err) {
      console.error('Failed to verify trade:', err)
      setError('Unable to verify trade status')
    } finally {
      setLoading(false)
    }
  }

  return {
    status,
    loading,
    error,
    closedAt,
    closedPrice,
    recheck: () => checkTradeStatus(trade),
  }
}

/**
 * 🎭 Mock verification result
 * Returns deterministic outcome based on trade ID
 * For production: replace with real OHLC check from CoinGecko
 */
function getMockVerificationResult(trade: TradeSignal): {
  status: 'PENDING' | 'WIN' | 'LOSS'
  closedAt?: number
  closedPrice?: number
} {
  // Deterministic result based on trade ID (so it's consistent across refreshes)
  const hash = trade.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const outcome = hash % 3 // 0 = PENDING, 1 = WIN, 2 = LOSS
  
  const hoursSinceCreation = (Date.now() - trade.timestamp) / (1000 * 60 * 60)
  
  // Only resolve if trade is at least 2 seconds old (for demo realism)
  if (Date.now() - trade.timestamp < 2000) {
    return { status: 'PENDING' }
  }
  
  if (outcome === 0 || hoursSinceCreation < 0.1) {
    return { status: 'PENDING' }
  } else if (outcome === 1) {
    return {
      status: 'WIN',
      closedAt: trade.timestamp + (Math.max(hoursSinceCreation * 0.5, 0.1) * 60 * 60 * 1000),
      closedPrice: trade.targetPrice,
    }
  } else {
    return {
      status: 'LOSS',
      closedAt: trade.timestamp + (Math.max(hoursSinceCreation * 0.6, 0.1) * 60 * 60 * 1000),
      closedPrice: trade.stopLoss,
    }
  }
}

/**
 * Update trade status in localStorage
 */
function updateLocalStorage(
  tradeId: string,
  status: TradeSignal['status'],
  closedAt: number,
  closedPrice: number
) {
  const stored = localStorage.getItem('truealpha-trades')
  if (!stored) return

  try {
    const trades: TradeSignal[] = JSON.parse(stored)
    const tradeIndex = trades.findIndex(t => t.id === tradeId)

    if (tradeIndex !== -1) {
      trades[tradeIndex].status = status
      trades[tradeIndex].closedAt = closedAt
      trades[tradeIndex].closedPrice = closedPrice

      localStorage.setItem('truealpha-trades', JSON.stringify(trades))

      // Update reputation based on result
      updateReputation(trades[tradeIndex].trader, status)
    }
  } catch (err) {
    console.error('Failed to update localStorage:', err)
  }
}

/**
 * Update trader reputation (virtual points in localStorage)
 */
function updateReputation(traderAddress: string, status: TradeSignal['status']) {
  const stored = localStorage.getItem('truealpha-reputation')
  const reputation = stored ? JSON.parse(stored) : {}

  if (!reputation[traderAddress]) {
    reputation[traderAddress] = 0
  }

  if (status === 'WIN') {
    reputation[traderAddress] += 50
  } else if (status === 'LOSS') {
    reputation[traderAddress] -= 50
  }

  localStorage.setItem('truealpha-reputation', JSON.stringify(reputation))
}

/**
 * Get current reputation for a trader
 */
export function getTraderReputation(traderAddress: string): number {
  const stored = localStorage.getItem('truealpha-reputation')
  if (!stored) return 0

  try {
    const reputation = JSON.parse(stored)
    return reputation[traderAddress] || 0
  } catch {
    return 0
  }
}

/**
 * Manual admin function to force trade result (for demo)
 * Call from browser console: window.forceTradeResult('trade-id', 'WIN')
 */
if (typeof window !== 'undefined') {
  (window as any).forceTradeResult = (tradeId: string, result: 'WIN' | 'LOSS') => {
    const stored = localStorage.getItem('truealpha-trades')
    if (!stored) {
      console.error('No trades found')
      return
    }

    try {
      const trades: TradeSignal[] = JSON.parse(stored)
      const trade = trades.find(t => t.id === tradeId)
      
      if (!trade) {
        console.error('Trade not found:', tradeId)
        console.log('Available trade IDs:', trades.map(t => t.id))
        return
      }

      const closedPrice = result === 'WIN' ? trade.targetPrice : trade.stopLoss
      updateLocalStorage(tradeId, result, Date.now(), closedPrice)
      
      console.log(`✅ Trade ${tradeId} forced to ${result}`)
      console.log('Reload page to see changes')
      
      // Trigger a storage event to update UI
      window.dispatchEvent(new Event('storage'))
    } catch (err) {
      console.error('Failed to force result:', err)
    }
  }
  
  console.log('💡 Admin function available: window.forceTradeResult(tradeId, "WIN" | "LOSS")')
}
