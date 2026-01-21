'use client'

import { useState, useEffect } from 'react'

export interface TradeSignal {
  id: string
  trader: string
  token: string // e.g., "bitcoin", "ethereum"
  entryPrice: number
  targetPrice: number
  stopLoss: number
  timestamp: number
  expiresIn: '24h' | '3d' | '7d' // Scadenza massima
  direction: 'LONG' | 'SHORT'
  status?: 'PENDING' | 'WIN' | 'LOSS' | 'EXPIRED'
  closedAt?: number
  closedPrice?: number
}

interface PriceData {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
}

const EXPIRY_DURATION = {
  '24h': 24 * 60 * 60 * 1000,
  '3d': 3 * 24 * 60 * 60 * 1000,
  '7d': 7 * 24 * 60 * 60 * 1000,
}

/**
 * Hook to check and verify trade status using CoinGecko API
 * Implements lazy loading - only checks when component mounts
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
        setLoading(false)
        updateLocalStorage(trade.id, 'EXPIRED', now, trade.entryPrice)
        return
      }

      // Fetch historical price data from CoinGecko
      const priceHistory = await fetchPriceHistory(
        trade.token,
        trade.timestamp,
        now
      )

      // Verify if TP or SL was hit
      const result = verifyTrade(trade, priceHistory)

      setStatus(result.status)
      setClosedAt(result.closedAt)
      setClosedPrice(result.closedPrice)

      // Update local storage with result
      if (result.status !== 'PENDING') {
        updateLocalStorage(trade.id, result.status, result.closedAt!, result.closedPrice!)
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
 * Fetch historical OHLC data from CoinGecko
 */
async function fetchPriceHistory(
  token: string,
  fromTimestamp: number,
  toTimestamp: number
): Promise<PriceData[]> {
  // CoinGecko free API - market_chart/range endpoint
  // Returns price data in 5-minute intervals for recent data
  const fromUnix = Math.floor(fromTimestamp / 1000)
  const toUnix = Math.floor(toTimestamp / 1000)

  const url = `https://api.coingecko.com/api/v3/coins/${token}/market_chart/range?vs_currency=usd&from=${fromUnix}&to=${toUnix}`

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`CoinGecko API error: ${response.status}`)
  }

  const data = await response.json()

  // CoinGecko returns [timestamp, price] arrays
  // We need to convert to OHLC format
  // For simplicity, we'll treat each point as both high and low
  const priceData: PriceData[] = []

  if (data.prices && data.prices.length > 0) {
    // Group prices into 1-hour candles for better OHLC approximation
    const hourlyCandles = groupIntoCandles(data.prices)
    priceData.push(...hourlyCandles)
  }

  return priceData
}

/**
 * Group price points into hourly OHLC candles
 */
function groupIntoCandles(prices: [number, number][]): PriceData[] {
  const candles: PriceData[] = []
  const hourMs = 60 * 60 * 1000

  let currentHour = Math.floor(prices[0][0] / hourMs) * hourMs
  let open = prices[0][1]
  let high = prices[0][1]
  let low = prices[0][1]
  let close = prices[0][1]

  for (const [timestamp, price] of prices) {
    const candleHour = Math.floor(timestamp / hourMs) * hourMs

    if (candleHour !== currentHour) {
      // Save current candle
      candles.push({
        timestamp: currentHour,
        open,
        high,
        low,
        close,
      })

      // Start new candle
      currentHour = candleHour
      open = price
      high = price
      low = price
      close = price
    } else {
      // Update current candle
      high = Math.max(high, price)
      low = Math.min(low, price)
      close = price
    }
  }

  // Add last candle
  candles.push({
    timestamp: currentHour,
    open,
    high,
    low,
    close,
  })

  return candles
}

/**
 * Verify if trade hit TP or SL
 */
function verifyTrade(
  trade: TradeSignal,
  priceHistory: PriceData[]
): {
  status: 'PENDING' | 'WIN' | 'LOSS'
  closedAt?: number
  closedPrice?: number
} {
  const { direction, targetPrice, stopLoss, entryPrice } = trade

  for (const candle of priceHistory) {
    if (direction === 'LONG') {
      // LONG: Win if price reaches targetPrice, Loss if hits stopLoss
      if (candle.high >= targetPrice) {
        return {
          status: 'WIN',
          closedAt: candle.timestamp,
          closedPrice: targetPrice,
        }
      }
      if (candle.low <= stopLoss) {
        return {
          status: 'LOSS',
          closedAt: candle.timestamp,
          closedPrice: stopLoss,
        }
      }
    } else {
      // SHORT: Win if price drops to targetPrice, Loss if rises to stopLoss
      if (candle.low <= targetPrice) {
        return {
          status: 'WIN',
          closedAt: candle.timestamp,
          closedPrice: targetPrice,
        }
      }
      if (candle.high >= stopLoss) {
        return {
          status: 'LOSS',
          closedAt: candle.timestamp,
          closedPrice: stopLoss,
        }
      }
    }
  }

  return { status: 'PENDING' }
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
 * Batch verify multiple trades
 */
export function useBatchTradeVerification(trades: TradeSignal[]) {
  const [verifiedTrades, setVerifiedTrades] = useState<TradeSignal[]>(trades)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const verifyAll = async () => {
      setLoading(true)

      const updated = await Promise.all(
        trades.map(async (trade) => {
          if (trade.status === 'WIN' || trade.status === 'LOSS' || trade.status === 'EXPIRED') {
            return trade
          }

          try {
            const now = Date.now()
            const expiryTime = trade.timestamp + EXPIRY_DURATION[trade.expiresIn]

            if (now > expiryTime) {
              return { ...trade, status: 'EXPIRED' as const }
            }

            const priceHistory = await fetchPriceHistory(
              trade.token,
              trade.timestamp,
              now
            )

            const result = verifyTrade(trade, priceHistory)

            return {
              ...trade,
              status: result.status,
              closedAt: result.closedAt,
              closedPrice: result.closedPrice,
            }
          } catch (err) {
            console.error(`Failed to verify trade ${trade.id}:`, err)
            return trade
          }
        })
      )

      setVerifiedTrades(updated)
      setLoading(false)
    }

    verifyAll()
  }, [])

  return { verifiedTrades, loading }
}
