'use client'

import { useState, useEffect } from 'react'

export interface LivePrice {
  token: string
  price: number
  change24h: number
  lastUpdated: number
  loading: boolean
  error: string | null
}

/**
 * Hook to fetch live price from CoinGecko API
 * Auto-refreshes every 30 seconds
 */
export function useLivePrice(token: string, autoRefresh = true): LivePrice {
  const [price, setPrice] = useState<number>(0)
  const [change24h, setChange24h] = useState<number>(0)
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now())
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return

    const fetchPrice = async () => {
      try {
        setLoading(true)
        setError(null)

        // CoinGecko simple price endpoint
        const url = `https://api.coingecko.com/api/v3/simple/price?ids=${token}&vs_currencies=usd&include_24hr_change=true`

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

        if (data[token]) {
          setPrice(data[token].usd)
          setChange24h(data[token].usd_24h_change || 0)
          setLastUpdated(Date.now())
        } else {
          throw new Error('Token not found')
        }

      } catch (err) {
        console.error('Failed to fetch price:', err)
        setError('Unable to fetch live price')
      } finally {
        setLoading(false)
      }
    }

    // Initial fetch
    fetchPrice()

    // Auto-refresh every 30 seconds
    if (autoRefresh) {
      const interval = setInterval(fetchPrice, 30000)
      return () => clearInterval(interval)
    }
  }, [token, autoRefresh])

  return {
    token,
    price,
    change24h,
    lastUpdated,
    loading,
    error,
  }
}

/**
 * Get price at specific timestamp (used for entry price)
 * Note: This uses current price as approximation
 * For production, you'd want to use historical endpoint
 */
export async function getPriceAtTimestamp(
  token: string,
  timestamp: number
): Promise<number> {
  try {
    // For recent timestamps (< 1 day), use current price as approximation
    const now = Date.now()
    const oneDayMs = 24 * 60 * 60 * 1000

    if (now - timestamp < oneDayMs) {
      const url = `https://api.coingecko.com/api/v3/simple/price?ids=${token}&vs_currencies=usd`
      const response = await fetch(url)
      const data = await response.json()
      return data[token]?.usd || 0
    }

    // For older timestamps, use historical data
    const dateUnix = Math.floor(timestamp / 1000)
    const url = `https://api.coingecko.com/api/v3/coins/${token}/history?date=${formatDate(timestamp)}`
    
    const response = await fetch(url)
    const data = await response.json()
    
    return data.market_data?.current_price?.usd || 0

  } catch (err) {
    console.error('Failed to get historical price:', err)
    return 0
  }
}

/**
 * Format timestamp to DD-MM-YYYY for CoinGecko history endpoint
 */
function formatDate(timestamp: number): string {
  const date = new Date(timestamp)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}-${month}-${year}`
}

/**
 * Token ID mapping for CoinGecko
 * Add more as needed
 */
export const TOKEN_IDS: Record<string, string> = {
  'BTC': 'bitcoin',
  'ETH': 'ethereum',
  'SOL': 'solana',
  'AVAX': 'avalanche-2',
  'ARB': 'arbitrum',
  'OP': 'optimism',
  'MATIC': 'matic-network',
  'BNB': 'binancecoin',
  'ADA': 'cardano',
  'DOT': 'polkadot',
  'LINK': 'chainlink',
  'UNI': 'uniswap',
  'AAVE': 'aave',
  'CRV': 'curve-dao-token',
}

/**
 * Get token ID for CoinGecko from symbol
 */
export function getTokenId(symbol: string): string {
  return TOKEN_IDS[symbol.toUpperCase()] || symbol.toLowerCase()
}
