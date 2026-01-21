'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Input } from './input'
import { Button } from './button'
import { useWriteSignal, TradeSignal } from '@/hooks/useWriteSignal'
import { TrendingUp, TrendingDown, CheckCircle2, Loader2 } from 'lucide-react'

export function SignalForm() {
  const [pair, setPair] = useState('')
  const [direction, setDirection] = useState<'LONG' | 'SHORT'>('LONG')
  const [targetPrice, setTargetPrice] = useState('')
  
  const { writeSignal, isPending, isConfirming, isConfirmed, error } = useWriteSignal()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const signal: TradeSignal = {
      pair,
      direction,
      targetPrice,
      timestamp: Date.now(),
    }

    await writeSignal(signal)
    
    // Reset form after successful submission
    if (isConfirmed) {
      setPair('')
      setTargetPrice('')
    }
  }

  return (
    <Card className="border-neon-green/30">
      <CardHeader>
        <CardTitle className="text-neon-green flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          POST TRADE SIGNAL
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              TRADING PAIR
            </label>
            <Input
              placeholder="BTC/USD"
              value={pair}
              onChange={(e) => setPair(e.target.value)}
              required
              className="uppercase"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              DIRECTION
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={direction === 'LONG' ? 'default' : 'outline'}
                onClick={() => setDirection('LONG')}
                className={direction === 'LONG' ? 'bg-neon-green text-black hover:bg-neon-green/90' : ''}
              >
                <TrendingUp className="h-3 w-3 mr-1" />
                LONG
              </Button>
              <Button
                type="button"
                variant={direction === 'SHORT' ? 'destructive' : 'outline'}
                onClick={() => setDirection('SHORT')}
                className={direction === 'SHORT' ? 'bg-neon-red hover:bg-neon-red/90' : ''}
              >
                <TrendingDown className="h-3 w-3 mr-1" />
                SHORT
              </Button>
            </div>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              TARGET PRICE
            </label>
            <Input
              placeholder="50000.00"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              required
              type="number"
              step="0.01"
            />
          </div>

          {error && (
            <div className="text-xs text-neon-red border border-neon-red/30 p-2 rounded-sm">
              Error: {error.message}
            </div>
          )}

          {isConfirmed && (
            <div className="text-xs text-neon-green border border-neon-green/30 p-2 rounded-sm flex items-center gap-2">
              <CheckCircle2 className="h-3 w-3" />
              Signal posted on-chain successfully!
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-neon-green text-black hover:bg-neon-green/90 font-semibold"
            disabled={isPending || isConfirming}
          >
            {isPending || isConfirming ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                {isPending ? 'SIGNING...' : 'CONFIRMING...'}
              </>
            ) : (
              'BROADCAST SIGNAL'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
