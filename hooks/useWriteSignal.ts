'use client'

import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi'
import { keccak256, toHex } from 'viem'

// Simple contract ABI for storing signal hashes
const SIGNAL_CONTRACT_ABI = [
  {
    name: 'storeSignal',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'signalHash', type: 'bytes32' }],
    outputs: [],
  },
] as const

// ⚠️ IMPORTANT: Deploy the contract and update this address!
// 1. Go to https://remix.ethereum.org
// 2. Upload contracts/TrueAlphaSignals.sol
// 3. Compile and deploy to Base Sepolia
// 4. Copy the deployed address and paste it here
const CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000' // ← REPLACE THIS

export interface TradeSignal {
  id: string
  pair: string
  token: string
  direction: 'LONG' | 'SHORT'
  entryPrice: number
  targetPrice: number
  stopLoss: number
  expiresIn: '24h' | '3d' | '7d'
  timestamp: number
  trader?: string // Optional, added automatically
}

export function useWriteSignal() {
  const { data: hash, writeContract, isPending, error } = useWriteContract()
  const { address } = useAccount()
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  const writeSignal = async (signal: TradeSignal) => {
    // Add trader address to signal
    const signalWithTrader = {
      ...signal,
      trader: address || '0x0000000000000000000000000000000000000000',
    }
    
    // Save to localStorage first
    saveSignalToLocalStorage(signalWithTrader)

    // Create a hash of the signal for blockchain
    const signalString = JSON.stringify(signalWithTrader)
    const signalHash = keccak256(toHex(signalString))

    // Write to contract
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: SIGNAL_CONTRACT_ABI,
      functionName: 'storeSignal',
      args: [signalHash],
    })

    return signalHash
  }

  return {
    writeSignal,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  }
}

/**
 * Save signal to localStorage for UI display and verification
 */
function saveSignalToLocalStorage(signal: TradeSignal) {
  const stored = localStorage.getItem('truealpha-trades')
  const trades = stored ? JSON.parse(stored) : []
  
  trades.unshift(signal) // Add to beginning
  
  // Keep only last 100 trades
  if (trades.length > 100) {
    trades.pop()
  }
  
  localStorage.setItem('truealpha-trades', JSON.stringify(trades))
}
