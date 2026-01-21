'use client'

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
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

// Mock contract address - deploy your own for production
const CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000'

export interface TradeSignal {
  pair: string
  direction: 'LONG' | 'SHORT'
  targetPrice: string
  timestamp: number
}

export function useWriteSignal() {
  const { data: hash, writeContract, isPending, error } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  const writeSignal = async (signal: TradeSignal) => {
    // Create a hash of the signal
    const signalString = JSON.stringify(signal)
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
