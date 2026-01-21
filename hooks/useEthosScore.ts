'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'

// 🎯 DEMO WALLET: This wallet gets a mock high score for demo purposes
// All other wallets will get REAL Ethos API calls
const DEMO_WALLET = '0x7BAcbbaadCbEeCc443F9885FAF6a2C9894E2F2B2'
const DEMO_SCORE = 1500

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
        // 🎯 SPECIAL: If demo wallet, return mock high score immediately
        if (address.toLowerCase() === DEMO_WALLET.toLowerCase()) {
          console.log('🎭 Demo wallet detected - using mock score:', DEMO_SCORE)
          await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay
          setScore(DEMO_SCORE)
          setBadges(['Whale', 'Early Adopter', 'Verified Trader'])
          setLoading(false)
          return
        }

        // ✅ ALL OTHER WALLETS: Make REAL Ethos API call
        console.log('🔍 Fetching real Ethos score for:', address)
        
        const response = await fetch(`https://api.ethos.network/api/v1/profiles/${address}/credibility-score`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          const data = await response.json()
          const credibilityScore = data.score || 0
          
          console.log('✅ Ethos API response:', credibilityScore)
          setScore(credibilityScore)

          // Extract badges based on score
          const userBadges: string[] = []
          if (credibilityScore > 1500) userBadges.push('Top Trader')
          if (credibilityScore > 1200) userBadges.push('Verified')
          if (data.isVouched) userBadges.push('Vouched')
          
          setBadges(userBadges)
        } else {
          // API call failed - wallet probably has no Ethos profile
          console.log('⚠️ Ethos API returned error:', response.status)
          console.log('→ Wallet likely has no Ethos profile, score will be 0')
          
          setScore(0)
          setBadges([])
          setError(null) // Don't show error to user, 0 is valid
        }
        
      } catch (err) {
        // Network error or API unavailable
        console.error('❌ Failed to fetch Ethos score:', err)
        console.log('→ Setting score to 0')
        
        setScore(0)
        setBadges([])
        setError(null) // Don't show error to user
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
