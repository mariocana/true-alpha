'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Input } from './input'
import { Button } from './button'
import { Select } from './select'
import { useWriteSignal, saveSignalToLocalStorage } from '@/hooks/useWriteSignal'
import { useLivePrice, getTokenId } from '@/hooks/useLivePrice'
import { TrendingUp, TrendingDown, CheckCircle2, Loader2, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

export function SignalForm() {
  const [pair, setPair] = useState('')
  const [direction, setDirection] = useState<'LONG' | 'SHORT'>('LONG')
  const [targetPrice, setTargetPrice] = useState('')
  const [stopLoss, setStopLoss] = useState('')
  const [expiresIn, setExpiresIn] = useState<'24h' | '3d' | '7d'>('3d')
  const [pendingSignal, setPendingSignal] = useState<any>(null)
  
  const { writeSignal, isPending, isConfirming, isConfirmed, error } = useWriteSignal()

  // Get token ID from pair (e.g., "BTC/USD" -> "bitcoin")
  const token = pair.split('/')[0]
  const tokenId = getTokenId(token)
  
  // Fetch live price
  const { price: entryPrice, loading: priceLoading, error: priceError } = useLivePrice(tokenId, true)

  // Watch for confirmation and save to localStorage
  useEffect(() => {
    if (isConfirmed && pendingSignal) {
      saveSignalToLocalStorage(pendingSignal.signalWithTrader)
      setPendingSignal(null)
      
      // Reset form
      setPair('')
      setTargetPrice('')
      setStopLoss('')
      setExpiresIn('3d')
    }
  }, [isConfirmed, pendingSignal])

  // Validate TP and SL based on direction
  const isValidTPSL = () => {
    if (!targetPrice || !stopLoss || !entryPrice) return false
    
    const tp = parseFloat(targetPrice)
    const sl = parseFloat(stopLoss)
    
    if (direction === 'LONG') {
      // LONG: TP > Entry > SL
      return tp > entryPrice && entryPrice > sl
    } else {
      // SHORT: SL > Entry > TP
      return sl > entryPrice && entryPrice > tp
    }
  }

  // Calculate risk/reward ratio
  const getRiskReward = () => {
    if (!targetPrice || !stopLoss || !entryPrice) return null
    
    const tp = parseFloat(targetPrice)
    const sl = parseFloat(stopLoss)
    
    const reward = Math.abs(tp - entryPrice)
    const risk = Math.abs(entryPrice - sl)
    
    if (risk === 0) return null
    
    return (reward / risk).toFixed(2)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isValidTPSL()) {
      alert('Invalid TP/SL values for selected direction')
      return
    }

    const signal = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      pair,
      token: tokenId,
      direction,
      entryPrice,
      targetPrice: parseFloat(targetPrice),
      stopLoss: parseFloat(stopLoss),
      expiresIn,
      timestamp: Date.now(),
    }

    // Write to blockchain and store signal for later save
    const result = await writeSignal(signal)
    setPendingSignal(result)
  }

  const riskReward = getRiskReward()

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
          {/* Trading Pair */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              TRADING PAIR
            </label>
            <Select
              value={pair}
              onChange={(e) => setPair(e.target.value)}
              required
              className="uppercase"
            >
              <option value="">Select pair...</option>
              <option value="BTC/USD">BTC/USD</option>
              <option value="ETH/USD">ETH/USD</option>
              <option value="SOL/USD">SOL/USD</option>
              <option value="AVAX/USD">AVAX/USD</option>
              <option value="ARB/USD">ARB/USD</option>
              <option value="OP/USD">OP/USD</option>
            </Select>
          </div>

          {/* Entry Price (Auto-fetched, Read-only) */}
          {pair && (
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                ENTRY PRICE (CURRENT MARKET)
              </label>
              <div className="relative">
                <Input
                  value={priceLoading ? 'Loading...' : `$${entryPrice.toLocaleString()}`}
                  readOnly
                  className="bg-terminal-surface text-neon-green font-bold cursor-not-allowed"
                />
                {priceLoading && (
                  <RefreshCw className="absolute right-2 top-2 h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>
              {priceError && (
                <p className="text-[10px] text-neon-red mt-1">
                  ⚠️ {priceError}
                </p>
              )}
              <p className="text-[9px] text-muted-foreground mt-1">
                Live price from CoinGecko • Updates every 30s
              </p>
            </div>
          )}

          {/* Direction */}
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

          {/* Target Price (Take Profit) */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              TARGET PRICE (TAKE PROFIT)
            </label>
            <Input
              placeholder="50000.00"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              required
              type="number"
              step="0.01"
            />
            {entryPrice > 0 && targetPrice && (
              <p className="text-[9px] text-muted-foreground mt-1">
                {direction === 'LONG' 
                  ? `+${(((parseFloat(targetPrice) - entryPrice) / entryPrice) * 100).toFixed(2)}%` 
                  : `+${(((entryPrice - parseFloat(targetPrice)) / entryPrice) * 100).toFixed(2)}%`
                } potential gain
              </p>
            )}
          </div>

          {/* Stop Loss */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              STOP LOSS (LIQUIDATION)
            </label>
            <Input
              placeholder="45000.00"
              value={stopLoss}
              onChange={(e) => setStopLoss(e.target.value)}
              required
              type="number"
              step="0.01"
            />
            {entryPrice > 0 && stopLoss && (
              <p className="text-[9px] text-neon-red mt-1">
                {direction === 'LONG'
                  ? `-${(((entryPrice - parseFloat(stopLoss)) / entryPrice) * 100).toFixed(2)}%`
                  : `-${(((parseFloat(stopLoss) - entryPrice) / entryPrice) * 100).toFixed(2)}%`
                } max loss
              </p>
            )}
          </div>

          {/* Expiry */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              EXPIRES IN
            </label>
            <Select
              value={expiresIn}
              onChange={(e) => setExpiresIn(e.target.value as '24h' | '3d' | '7d')}
              required
            >
              <option value="24h">24 Hours</option>
              <option value="3d">3 Days</option>
              <option value="7d">7 Days</option>
            </Select>
            <p className="text-[9px] text-muted-foreground mt-1">
              Trade expires if TP/SL not hit within this time
            </p>
          </div>

          {/* Risk/Reward Display */}
          {riskReward && (
            <div className={cn(
              "border rounded-sm p-2",
              parseFloat(riskReward) >= 2 ? "border-neon-green/30 bg-neon-green/5" : "border-yellow-500/30 bg-yellow-500/5"
            )}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">Risk/Reward Ratio</span>
                <span className={cn(
                  "text-xs font-bold",
                  parseFloat(riskReward) >= 2 ? "text-neon-green" : "text-yellow-500"
                )}>
                  1:{riskReward}
                </span>
              </div>
              <p className="text-[9px] text-muted-foreground mt-1">
                {parseFloat(riskReward) >= 2 
                  ? "✓ Good risk/reward ratio" 
                  : "⚠️ Consider higher TP or tighter SL"
                }
              </p>
            </div>
          )}

          {/* Validation Errors */}
          {pair && targetPrice && stopLoss && entryPrice > 0 && !isValidTPSL() && (
            <div className="text-xs text-neon-red border border-neon-red/30 p-2 rounded-sm">
              ⚠️ {direction === 'LONG' 
                ? 'For LONG: TP must be > Entry > SL' 
                : 'For SHORT: SL must be > Entry > TP'
              }
            </div>
          )}

          {error && (
            <div className="text-xs text-neon-red border border-neon-red/30 p-2 rounded-sm">
              Error: {error.message}
            </div>
          )}

          {isConfirmed && (
            <div className="text-xs text-neon-green border border-neon-green/30 p-2 rounded-sm flex items-center gap-2">
              <CheckCircle2 className="h-3 w-3" />
              Signal posted on-chain successfully! Check the feed below.
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-neon-green text-black hover:bg-neon-green/90 font-semibold"
            disabled={isPending || isConfirming || !entryPrice || priceLoading || !isValidTPSL()}
          >
            {isPending || isConfirming ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                {isPending ? 'SIGNING...' : isConfirming ? 'CONFIRMING ON-CHAIN...' : 'PROCESSING...'}
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


  const riskReward = getRiskReward()

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
          {/* Trading Pair */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              TRADING PAIR
            </label>
            <Select
              value={pair}
              onChange={(e) => setPair(e.target.value)}
              required
              className="uppercase"
            >
              <option value="">Select pair...</option>
              <option value="BTC/USD">BTC/USD</option>
              <option value="ETH/USD">ETH/USD</option>
              <option value="SOL/USD">SOL/USD</option>
              <option value="AVAX/USD">AVAX/USD</option>
              <option value="ARB/USD">ARB/USD</option>
              <option value="OP/USD">OP/USD</option>
            </Select>
          </div>

          {/* Entry Price (Auto-fetched, Read-only) */}
          {pair && (
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                ENTRY PRICE (CURRENT MARKET)
              </label>
              <div className="relative">
                <Input
                  value={priceLoading ? 'Loading...' : `$${entryPrice.toLocaleString()}`}
                  readOnly
                  className="bg-terminal-surface text-neon-green font-bold cursor-not-allowed"
                />
                {priceLoading && (
                  <RefreshCw className="absolute right-2 top-2 h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>
              {priceError && (
                <p className="text-[10px] text-neon-red mt-1">
                  ⚠️ {priceError}
                </p>
              )}
              <p className="text-[9px] text-muted-foreground mt-1">
                Live price from CoinGecko • Updates every 30s
              </p>
            </div>
          )}

          {/* Direction */}
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

          {/* Target Price (Take Profit) */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              TARGET PRICE (TAKE PROFIT)
            </label>
            <Input
              placeholder="50000.00"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              required
              type="number"
              step="0.01"
            />
            {entryPrice > 0 && targetPrice && (
              <p className="text-[9px] text-muted-foreground mt-1">
                {direction === 'LONG' 
                  ? `+${(((parseFloat(targetPrice) - entryPrice) / entryPrice) * 100).toFixed(2)}%` 
                  : `+${(((entryPrice - parseFloat(targetPrice)) / entryPrice) * 100).toFixed(2)}%`
                } potential gain
              </p>
            )}
          </div>

          {/* Stop Loss */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              STOP LOSS (LIQUIDATION)
            </label>
            <Input
              placeholder="45000.00"
              value={stopLoss}
              onChange={(e) => setStopLoss(e.target.value)}
              required
              type="number"
              step="0.01"
            />
            {entryPrice > 0 && stopLoss && (
              <p className="text-[9px] text-neon-red mt-1">
                {direction === 'LONG'
                  ? `-${(((entryPrice - parseFloat(stopLoss)) / entryPrice) * 100).toFixed(2)}%`
                  : `-${(((parseFloat(stopLoss) - entryPrice) / entryPrice) * 100).toFixed(2)}%`
                } max loss
              </p>
            )}
          </div>

          {/* Expiry */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              EXPIRES IN
            </label>
            <Select
              value={expiresIn}
              onChange={(e) => setExpiresIn(e.target.value as '24h' | '3d' | '7d')}
              required
            >
              <option value="24h">24 Hours</option>
              <option value="3d">3 Days</option>
              <option value="7d">7 Days</option>
            </Select>
            <p className="text-[9px] text-muted-foreground mt-1">
              Trade expires if TP/SL not hit within this time
            </p>
          </div>

          {/* Risk/Reward Display */}
          {riskReward && (
            <div className={cn(
              "border rounded-sm p-2",
              parseFloat(riskReward) >= 2 ? "border-neon-green/30 bg-neon-green/5" : "border-yellow-500/30 bg-yellow-500/5"
            )}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">Risk/Reward Ratio</span>
                <span className={cn(
                  "text-xs font-bold",
                  parseFloat(riskReward) >= 2 ? "text-neon-green" : "text-yellow-500"
                )}>
                  1:{riskReward}
                </span>
              </div>
              <p className="text-[9px] text-muted-foreground mt-1">
                {parseFloat(riskReward) >= 2 
                  ? "✓ Good risk/reward ratio" 
                  : "⚠️ Consider higher TP or tighter SL"
                }
              </p>
            </div>
          )}

          {/* Validation Errors */}
          {pair && targetPrice && stopLoss && entryPrice > 0 && !isValidTPSL() && (
            <div className="text-xs text-neon-red border border-neon-red/30 p-2 rounded-sm">
              ⚠️ {direction === 'LONG' 
                ? 'For LONG: TP must be > Entry > SL' 
                : 'For SHORT: SL must be > Entry > TP'
              }
            </div>
          )}

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
            disabled={isPending || isConfirming || !entryPrice || priceLoading || !isValidTPSL()}
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
