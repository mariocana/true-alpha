'use client'

import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Button } from './button'
import { Check, ExternalLink, Trophy, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRoadToAlphaProgress } from '@/hooks/useRoadToAlphaProgress'

interface RoadToAlphaTask {
  id: string
  title: string
  description: string
  points: number
  link?: string
  linkText?: string
}

const TASKS: RoadToAlphaTask[] = [
  {
    id: 'twitter',
    title: 'Connect Twitter on Ethos',
    description: 'Link your Twitter account to verify your social presence',
    points: 200,
    link: 'https://ethos.network/connect/twitter',
    linkText: 'Connect Twitter',
  },
  {
    id: 'vouch',
    title: 'Receive 1 Vouch',
    description: 'Get vouched by a trusted community member',
    points: 500,
    link: 'https://ethos.network/vouches',
    linkText: 'Learn about Vouches',
  },
  {
    id: 'transactions',
    title: 'Complete 5 Transactions on Base',
    description: 'Show on-chain activity by making 5 verified transactions',
    points: 100,
    link: 'https://base.org',
    linkText: 'Explore Base',
  },
  {
    id: 'attestation',
    title: 'Create an Attestation',
    description: 'Write an attestation for someone you trust',
    points: 150,
    link: 'https://ethos.network/attestations',
    linkText: 'Create Attestation',
  },
  {
    id: 'profile',
    title: 'Complete Your Ethos Profile',
    description: 'Add bio, avatar, and social links to your profile',
    points: 100,
    link: 'https://ethos.network/profile',
    linkText: 'Edit Profile',
  },
]

export function RoadToAlpha({ currentScore }: { currentScore: number }) {
  const { isTaskCompleted, completeTask } = useRoadToAlphaProgress()
  
  const pointsNeeded = Math.max(0, 1200 - currentScore)
  const completedTasksCount = TASKS.filter(task => isTaskCompleted(task.id)).length
  const totalPossiblePoints = TASKS.reduce((sum, task) => sum + task.points, 0)
  const progressPercentage = Math.min(
    ((currentScore / 1200) * 100),
    100
  )

  return (
    <Card className="border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-transparent">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-blue-400 flex items-center gap-2 mb-1">
              <Trophy className="h-4 w-4" />
              ROAD TO ALPHA
            </CardTitle>
            <p className="text-[10px] text-muted-foreground">
              Complete tasks to unlock posting privileges
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs text-blue-400 font-bold">
              {currentScore} / 1200
            </div>
            <div className="text-[9px] text-muted-foreground">
              {pointsNeeded} pts needed
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current Status Badge */}
        <div className="bg-terminal-bg border border-yellow-500/30 rounded-sm p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 border border-yellow-500/30 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-yellow-500" />
              </div>
              <div>
                <div className="text-xs font-bold text-yellow-500">ROOKIE TRADER</div>
                <div className="text-[9px] text-muted-foreground">Read-Only Access</div>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-2">
            <div className="h-1.5 bg-terminal-surface rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[8px] text-muted-foreground">Current</span>
              <span className="text-[8px] text-blue-400 font-bold">{progressPercentage.toFixed(0)}%</span>
              <span className="text-[8px] text-muted-foreground">Alpha</span>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-500/10 to-transparent border-l-2 border-blue-500 p-3 rounded-sm">
          <p className="text-xs font-semibold text-blue-400 mb-1">
            Want to post your signals?
          </p>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Build your on-chain reputation by completing the tasks below. 
            Each task increases your Ethos Credibility Score.
          </p>
        </div>

        {/* Tasks Checklist */}
        <div className="space-y-2">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            Reputation Tasks ({completedTasksCount}/{TASKS.length})
          </div>
          
          {TASKS.map((task) => {
            const completed = isTaskCompleted(task.id)
            
            return (
              <div
                key={task.id}
                className={cn(
                  'border rounded-sm p-3 transition-all hover:border-blue-500/30',
                  completed 
                    ? 'bg-neon-green/5 border-neon-green/30' 
                    : 'bg-terminal-surface border-border'
                )}
              >
                <div className="flex items-start gap-3">
                  {/* Checkbox - clickable for demo purposes */}
                  <button
                    onClick={() => !completed && completeTask(task.id, task.points)}
                    className={cn(
                      'flex-shrink-0 h-4 w-4 rounded border-2 flex items-center justify-center mt-0.5 transition-all',
                      completed
                        ? 'bg-neon-green border-neon-green'
                        : 'border-muted-foreground/30 hover:border-blue-400 cursor-pointer'
                    )}
                  >
                    {completed && (
                      <Check className="h-3 w-3 text-black font-bold" />
                    )}
                  </button>

                  {/* Task Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4
                        className={cn(
                          'text-xs font-semibold',
                          completed ? 'text-neon-green line-through' : 'text-foreground'
                        )}
                      >
                        {task.title}
                      </h4>
                      <span
                        className={cn(
                          'flex-shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded border',
                          completed
                            ? 'text-neon-green bg-neon-green/10 border-neon-green/30'
                            : 'text-blue-400 bg-blue-400/10 border-blue-400/30'
                        )}
                      >
                        +{task.points}
                      </span>
                    </div>
                    
                    <p className="text-[10px] text-muted-foreground mb-2">
                      {task.description}
                    </p>

                    {task.link && !completed && (
                      <a
                        href={task.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        {task.linkText || 'Learn More'}
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Potential Score Preview */}
        <div className="bg-terminal-bg border border-neon-green/30 rounded-sm p-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] text-muted-foreground mb-1">
                Potential Score After Completion
              </div>
              <div className="text-lg font-bold text-neon-green">
                {currentScore + totalPossiblePoints}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-neon-green font-bold">
                ✓ ALPHA UNLOCKED
              </div>
              <div className="text-[9px] text-muted-foreground">
                Post unlimited signals
              </div>
            </div>
          </div>
        </div>

        {/* Learn More */}
        <Button
          variant="outline"
          className="w-full border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
          onClick={() => window.open('https://ethos.network', '_blank')}
        >
          Learn More About Ethos Network
          <ExternalLink className="h-3 w-3 ml-2" />
        </Button>
      </CardContent>
    </Card>
  )
}
