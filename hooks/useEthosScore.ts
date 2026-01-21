'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'

// 🚧 DEV MODE: Set to true to bypass API and use mock data for UI testing
const IS_DEV_MODE = false

export interface EthosScore {
  address: string
  score: number
  badges: string[]
  loading: boolean
  error: string | null
}

export function useEthosScore(): EthosScore {
  const { address, isConnected } = useAccount()
  const [score, setScore] = useState<number>(0)
  const [badges, setBadges] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isConnected || !address) {
      setScore(0)
      setBadges([])
      setLoading(false)
      setError(null)
      return
    }

    const fetchScore = async () => {
      setLoading(true)
      setError(null)

      try {
        // 🚧 DEV MODE: Return simulated high-reputation user for UI testing
        if (IS_DEV_MODE) {
          await new Promise(resolve => setTimeout(resolve, 500))
          setScore(1500)
          setBadges(['Whale', 'Early Adopter', 'Verified Trader'])
          setLoading(false)
          return
        }

        // ✅ PRODUCTION: Real Ethos API call
        const response = await fetch(`https://api.ethos.network/api/v1/profiles/${address}/credibility-score`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`Ethos API error: ${response.status}`)
        }

        const data = await response.json()
        
        // Ethos API returns score in the response
        const credibilityScore = data.score || 0
        setScore(credibilityScore)

        // Extract badges/achievements if available
        const userBadges: string[] = []
        if (credibilityScore > 1500) userBadges.push('Top Trader')
        if (credibilityScore > 1200) userBadges.push('Verified')
        if (data.isVouched) userBadges.push('Vouched')
        
        setBadges(userBadges)
        
      } catch (err) {
        console.error('Failed to fetch Ethos score:', err)
        setError('Unable to fetch credibility score. Please try again.')
        setScore(0)
        setBadges([])
      } finally {
        setLoading(false)
      }
    }

    fetchScore()
  }, [address, isConnected])

  return {
    address: address || '',
    score,
    badges,
    loading,
    error,
  }
}
