'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'

export interface RoadToAlphaProgress {
  completedTasks: string[]
  totalPoints: number
  lastUpdated: number
}

/**
 * Hook to track user's progress on Road to Alpha tasks
 * In production, this would sync with backend/localStorage
 */
export function useRoadToAlphaProgress() {
  const { address } = useAccount()
  const [progress, setProgress] = useState<RoadToAlphaProgress>({
    completedTasks: [],
    totalPoints: 0,
    lastUpdated: Date.now(),
  })

  // Load progress from localStorage
  useEffect(() => {
    if (!address) return

    const stored = localStorage.getItem(`road-to-alpha-${address}`)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setProgress(parsed)
      } catch (e) {
        console.error('Failed to load progress:', e)
      }
    }
  }, [address])

  // Save progress to localStorage
  const saveProgress = (newProgress: RoadToAlphaProgress) => {
    if (!address) return
    
    localStorage.setItem(
      `road-to-alpha-${address}`,
      JSON.stringify(newProgress)
    )
    setProgress(newProgress)
  }

  // Mark task as completed
  const completeTask = (taskId: string, points: number) => {
    if (progress.completedTasks.includes(taskId)) return

    const newProgress: RoadToAlphaProgress = {
      completedTasks: [...progress.completedTasks, taskId],
      totalPoints: progress.totalPoints + points,
      lastUpdated: Date.now(),
    }

    saveProgress(newProgress)
  }

  // Check if task is completed
  const isTaskCompleted = (taskId: string): boolean => {
    return progress.completedTasks.includes(taskId)
  }

  // Reset progress (for testing)
  const resetProgress = () => {
    const emptyProgress: RoadToAlphaProgress = {
      completedTasks: [],
      totalPoints: 0,
      lastUpdated: Date.now(),
    }
    saveProgress(emptyProgress)
  }

  return {
    progress,
    completeTask,
    isTaskCompleted,
    resetProgress,
  }
}
