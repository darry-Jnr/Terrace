'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Target, CheckCircle2, Clock } from 'lucide-react'

type Match = {
  id: string
  home_team: string
  away_team: string
  home_logo: string
  away_logo: string
  match_time: string
  match_date: string
}

type Prediction = {
  match_id: string
  home_score: number
  away_score: number
}

// Mock upcoming matches — later replace with real API
const upcomingMatches: Match[] = [
  {
    id: 'm1',
    home_team: 'Liverpool',
    away_team: 'Man City',
    home_logo: 'https://resources.premierleague.com/premierleague/badges/t14.png',
    away_logo: 'https://resources.premierleague.com/premierleague/badges/t43.png',
    match_time: '12:30',
    match_date: 'Sat 1 Mar',
  },
  {
    id: 'm2',
    home_team: 'Arsenal',
    away_team: 'Chelsea',
    home_logo: 'https://resources.premierleague.com/premierleague/badges/t3.png',
    away_logo: 'https://resources.premierleague.com/premierleague/badges/t8.png',
    match_time: '15:00',
    match_date: 'Sat 1 Mar',
  },
  {
    id: 'm3',
    home_team: 'Man Utd',
    away_team: 'Spurs',
    home_logo: 'https://resources.premierleague.com/premierleague/badges/t1.png',
    away_logo: 'https://resources.premierleague.com/premierleague/badges/t6.png',
    match_time: '17:30',
    match_date: 'Sat 1 Mar',
  },
  {
    id: 'm4',
    home_team: 'Newcastle',
    away_team: 'Aston Villa',
    home_logo: 'https://resources.premierleague.com/premierleague/badges/t4.png',
    away_logo: 'https://resources.premierleague.com/premierleague/badges/t7.png',
    match_time: '14:00',
    match_date: 'Sun 2 Mar',
  },
  {
    id: 'm5',
    home_team: 'Brighton',
    away_team: 'Fulham',
    home_logo: 'https://resources.premierleague.com/premierleague/badges/t36.png',
    away_logo: 'https://resources.premierleague.com/premierleague/badges/t54.png',
    match_time: '16:30',
    match_date: 'Sun 2 Mar',
  },
]

export default function PredictionsPage() {
  const supabase = createClient()
  const [predictions, setPredictions] = useState<Record<string, Prediction>>({})
  const [saved, setSaved] = useState<Record<string, boolean>>({})
  const [user, setUser] = useState<any>(null)
  const [existingPredictions, setExistingPredictions] = useState<string[]>([])

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data } = await supabase
          .from('predictions')
          .select('match_id')
          .eq('user_id', user.id)
        setExistingPredictions(data?.map(p => p.match_id) || [])
      }
    }
    init()
  }, [])

  const updateScore = (matchId: string, team: 'home' | 'away', delta: number) => {
    setPredictions(prev => {
      const current = prev[matchId] || { match_id: matchId, home_score: 0, away_score: 0 }
      const key = team === 'home' ? 'home_score' : 'away_score'
      const newVal = Math.max(0, Math.min(9, (current[key] || 0) + delta))
      return { ...prev, [matchId]: { ...current, [key]: newVal } }
    })
  }

  const handleSubmit = async (match: Match) => {
    if (!user) return
    const pred = predictions[match.id] || { home_score: 0, away_score: 0 }

    await supabase.from('predictions').upsert({
      user_id: user.id,
      match_id: match.id,
      home_team: match.home_team,
      away_team: match.away_team,
      home_score: pred.home_score,
      away_score: pred.away_score,
    })

    setSaved(prev => ({ ...prev, [match.id]: true }))
    setExistingPredictions(prev => [...prev, match.id])

    setTimeout(() => setSaved(prev => ({ ...prev, [match.id]: false })), 2000)
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-5 h-5 text-black" />
            <h1 className="text-black font-extrabold text-2xl tracking-tight">Predictions</h1>
          </div>
          <p className="text-zinc-400 text-sm">Call the score before kickoff. Earn points for accuracy.</p>
        </div>

        {/* Points guide */}
        <div className="bg-black rounded-3xl p-5 mb-6 flex items-center gap-6">
          <div className="text-center">
            <div className="text-white font-black text-2xl">3</div>
            <div className="text-zinc-500 text-xs mt-0.5">Exact score</div>
          </div>
          <div className="w-px h-10 bg-zinc-800" />
          <div className="text-center">
            <div className="text-white font-black text-2xl">1</div>
            <div className="text-zinc-500 text-xs mt-0.5">Correct result</div>
          </div>
          <div className="w-px h-10 bg-zinc-800" />
          <div className="text-center">
            <div className="text-white font-black text-2xl">0</div>
            <div className="text-zinc-500 text-xs mt-0.5">Wrong</div>
          </div>
          <div className="ml-auto text-zinc-600 text-xs text-right leading-relaxed">
            Points go to<br />your club too 🏆
          </div>
        </div>

        {/* Matches grouped by date */}
        {['Sat 1 Mar', 'Sun 2 Mar'].map(date => (
          <div key={date} className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-zinc-400 text-xs font-bold tracking-widest uppercase">{date}</span>
            </div>

            <div className="flex flex-col gap-3">
              {upcomingMatches.filter(m => m.match_date === date).map(match => {
                const pred = predictions[match.id] || { home_score: 0, away_score: 0 }
                const alreadyPredicted = existingPredictions.includes(match.id)
                const isSaved = saved[match.id]

                return (
                  <div key={match.id} className="bg-white border border-zinc-100 rounded-3xl p-5 hover:border-zinc-200 transition-all">

                    {/* Match time */}
                    <div className="text-center text-zinc-400 text-xs font-semibold mb-4">{match.match_time}</div>

                    {/* Teams + Score input */}
                    <div className="flex items-center justify-between gap-3">

                      {/* Home team */}
                      <div className="flex flex-col items-center gap-2 flex-1">
                        <img src={match.home_logo} alt={match.home_team} width={40} height={40} className="object-contain" />
                        <span className="text-zinc-900 font-bold text-sm text-center leading-tight">{match.home_team}</span>
                      </div>

                      {/* Score picker */}
                      <div className="flex items-center gap-2">
                        {/* Home score */}
                        <div className="flex flex-col items-center gap-1">
                          <button
                            onClick={() => updateScore(match.id, 'home', 1)}
                            disabled={alreadyPredicted}
                            className="w-7 h-7 rounded-xl bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-600 font-bold text-sm transition-all disabled:opacity-30"
                          >
                            +
                          </button>
                          <div className="w-10 h-10 bg-zinc-900 rounded-2xl flex items-center justify-center text-white font-black text-lg">
                            {pred.home_score}
                          </div>
                          <button
                            onClick={() => updateScore(match.id, 'home', -1)}
                            disabled={alreadyPredicted}
                            className="w-7 h-7 rounded-xl bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-600 font-bold text-sm transition-all disabled:opacity-30"
                          >
                            −
                          </button>
                        </div>

                        <span className="text-zinc-300 font-black text-xl">:</span>

                        {/* Away score */}
                        <div className="flex flex-col items-center gap-1">
                          <button
                            onClick={() => updateScore(match.id, 'away', 1)}
                            disabled={alreadyPredicted}
                            className="w-7 h-7 rounded-xl bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-600 font-bold text-sm transition-all disabled:opacity-30"
                          >
                            +
                          </button>
                          <div className="w-10 h-10 bg-zinc-900 rounded-2xl flex items-center justify-center text-white font-black text-lg">
                            {pred.away_score}
                          </div>
                          <button
                            onClick={() => updateScore(match.id, 'away', -1)}
                            disabled={alreadyPredicted}
                            className="w-7 h-7 rounded-xl bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-600 font-bold text-sm transition-all disabled:opacity-30"
                          >
                            −
                          </button>
                        </div>
                      </div>

                      {/* Away team */}
                      <div className="flex flex-col items-center gap-2 flex-1">
                        <img src={match.away_logo} alt={match.away_team} width={40} height={40} className="object-contain" />
                        <span className="text-zinc-900 font-bold text-sm text-center leading-tight">{match.away_team}</span>
                      </div>

                    </div>

                    {/* Submit */}
                    <div className="mt-5 flex justify-center">
                      {alreadyPredicted ? (
                        <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold">
                          <CheckCircle2 className="w-4 h-4" />
                          Prediction locked in
                        </div>
                      ) : (
                        <button
                          onClick={() => handleSubmit(match)}
                          className={`text-sm font-bold px-6 py-2.5 rounded-full transition-all ${
                            isSaved
                              ? 'bg-emerald-500 text-white'
                              : 'bg-black text-white hover:bg-zinc-800 hover:scale-[1.02]'
                          }`}
                        >
                          {isSaved ? '✓ Saved!' : 'Lock in prediction'}
                        </button>
                      )}
                    </div>

                  </div>
                )
              })}
            </div>
          </div>
        ))}

      </div>
    </div>
  )
}