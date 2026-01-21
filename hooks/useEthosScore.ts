'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'

// 🚧 DEV MODE: Set to true to simulate high reputation user
const IS_DEV_MODE = true

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
        // 🚧 DEV MODE: Return simulated high-reputation user
        if (IS_DEV_MODE) {
          await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay
          setScore(1500)
          setBadges(['Whale', 'Early Adopter', 'Verified Trader'])
          setLoading(false)
          return
        }

        // Production: Real Ethos API call
        // Uncomment when you have real API key
        // const response = await fetch(`https://api.ethos.network/v1/score/${address}`, {
        //   headers: {
        //     'X-API-Key': process.env.NEXT_PUBLIC_ETHOS_API_KEY || '',
        //   },
        // })
        // const data = await response.json()
        // setScore(data.score)
        // setBadges(data.badges || [])

        // Mock implementation for hackathon (when IS_DEV_MODE = false)
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Generate deterministic score based on address
        const hash = address.toLowerCase().split('').reduce((acc, char) => {
          return acc + char.charCodeAt(0)
        }, 0)
        
        const mockScore = 800 + (hash % 1000)
        const mockBadges: string[] = []
        
        if (mockScore > 1200) mockBadges.push('Verified')
        if (mockScore > 1500) mockBadges.push('Top Trader')
        
        setScore(mockScore)
        setBadges(mockBadges)
      } catch (err) {
        setError('Failed to fetch credibility score')
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
