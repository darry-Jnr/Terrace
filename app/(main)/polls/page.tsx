'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { BarChart3, Clock, CheckCircle2 } from 'lucide-react'

type Poll = {
  id: string
  question: string
  options: string[]
  expires_at: string
  created_at: string
}

type VoteCounts = Record<number, number>

// Mock polls — replace with real DB data later
const mockPolls: Poll[] = [
  {
    id: 'p1',
    question: '🔥 Who is the most overrated player in the EPL right now?',
    options: ['Marcus Rashford', 'Raheem Sterling', 'Jack Grealish', 'Anthony Gordon'],
    expires_at: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: 'p2',
    question: '🏆 Who wins the title this season?',
    options: ['Liverpool', 'Arsenal', 'Man City', 'Chelsea'],
    expires_at: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: 'p3',
    question: '🪑 Which manager gets sacked first?',
    options: ['Erik ten Hag', 'Oliver Glasner', 'Sean Dyche', 'Andoni Iraola'],
    expires_at: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  },
]

export default function PollsPage() {
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [userVotes, setUserVotes] = useState<Record<string, number>>({})
  const [voteCounts, setVoteCounts] = useState<Record<string, VoteCounts>>({})
  const [totalVotes, setTotalVotes] = useState<Record<string, number>>({})
  const [voting, setVoting] = useState<string | null>(null)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        // Get user's existing votes
        const { data: votes } = await supabase
          .from('poll_votes')
          .select('poll_id, option_index')
          .eq('user_id', user.id)

        const votesMap: Record<string, number> = {}
        votes?.forEach(v => { votesMap[v.poll_id] = v.option_index })
        setUserVotes(votesMap)
      }

      // Get vote counts per poll
      const { data: allVotes } = await supabase
        .from('poll_votes')
        .select('poll_id, option_index')

      const counts: Record<string, VoteCounts> = {}
      const totals: Record<string, number> = {}

      allVotes?.forEach(v => {
        if (!counts[v.poll_id]) counts[v.poll_id] = {}
        counts[v.poll_id][v.option_index] = (counts[v.poll_id][v.option_index] || 0) + 1
        totals[v.poll_id] = (totals[v.poll_id] || 0) + 1
      })

      setVoteCounts(counts)
      setTotalVotes(totals)
    }
    init()
  }, [])

  const handleVote = async (pollId: string, optionIndex: number) => {
    if (!user || userVotes[pollId] !== undefined) return
    setVoting(pollId)

    await supabase.from('poll_votes').insert({
      poll_id: pollId,
      user_id: user.id,
      option_index: optionIndex,
    })

    setUserVotes(prev => ({ ...prev, [pollId]: optionIndex }))
    setVoteCounts(prev => ({
      ...prev,
      [pollId]: {
        ...prev[pollId],
        [optionIndex]: ((prev[pollId]?.[optionIndex]) || 0) + 1,
      }
    }))
    setTotalVotes(prev => ({ ...prev, [pollId]: (prev[pollId] || 0) + 1 }))
    setVoting(null)
  }

  const getPercent = (pollId: string, optionIndex: number) => {
    const total = totalVotes[pollId] || 0
    if (total === 0) return 0
    return Math.round(((voteCounts[pollId]?.[optionIndex] || 0) / total) * 100)
  }

  const getTimeLeft = (expiresAt: string) => {
    const diff = new Date(expiresAt).getTime() - Date.now()
    if (diff <= 0) return 'Expired'
    const hrs = Math.floor(diff / 3600000)
    const mins = Math.floor((diff % 3600000) / 60000)
    if (hrs > 0) return `${hrs}h ${mins}m left`
    return `${mins}m left`
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-5 h-5 text-black" />
            <h1 className="text-black font-extrabold text-2xl tracking-tight">Daily Polls</h1>
          </div>
          <p className="text-zinc-400 text-sm">Vote before they expire. Your vote earns your club points.</p>
        </div>

        {/* Polls */}
        <div className="flex flex-col gap-4">
          {mockPolls.map(poll => {
            const hasVoted = userVotes[poll.id] !== undefined
            const isVoting = voting === poll.id

            return (
              <div key={poll.id} className="bg-white border border-zinc-100 rounded-3xl p-6 hover:border-zinc-200 transition-all">

                {/* Timer */}
                <div className="flex items-center gap-1.5 mb-4">
                  <Clock className="w-3.5 h-3.5 text-zinc-300" />
                  <span className="text-zinc-400 text-xs font-semibold">{getTimeLeft(poll.expires_at)}</span>
                  {hasVoted && (
                    <>
                      <span className="text-zinc-200 text-xs">·</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-500 text-xs font-semibold">Voted</span>
                    </>
                  )}
                </div>

                {/* Question */}
                <h3 className="text-zinc-900 font-bold text-base mb-5 leading-snug">
                  {poll.question}
                </h3>

                {/* Options */}
                <div className="flex flex-col gap-2">
                  {poll.options.map((option, i) => {
                    const percent = getPercent(poll.id, i)
                    const isMyVote = userVotes[poll.id] === i
                    const isWinning = hasVoted && percent === Math.max(...poll.options.map((_, idx) => getPercent(poll.id, idx)))

                    return (
                      <button
                        key={i}
                        onClick={() => handleVote(poll.id, i)}
                        disabled={hasVoted || isVoting}
                        className={`relative w-full text-left rounded-2xl overflow-hidden transition-all duration-200 ${
                          hasVoted ? 'cursor-default' : 'hover:scale-[1.01] active:scale-[0.99]'
                        }`}
                      >
                        {/* Background bar */}
                        {hasVoted && (
                          <div
                            className={`absolute inset-y-0 left-0 rounded-2xl transition-all duration-700 ${
                              isMyVote ? 'bg-black' : 'bg-zinc-100'
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        )}

                        {/* Content */}
                        <div className={`relative flex items-center justify-between px-4 py-3.5 rounded-2xl border transition-all ${
                          !hasVoted
                            ? 'bg-zinc-50 border-zinc-100 hover:bg-zinc-100 hover:border-zinc-200'
                            : isMyVote
                              ? 'border-black'
                              : 'border-zinc-100'
                        }`}>
                          <span className={`text-sm font-semibold ${
                            hasVoted && isMyVote ? 'text-white' : 'text-zinc-900'
                          }`}>
                            {option}
                          </span>

                          {hasVoted && (
                            <span className={`text-sm font-black ${
                              isMyVote ? 'text-white' : 'text-zinc-400'
                            }`}>
                              {percent}%
                            </span>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Total votes */}
                {hasVoted && (
                  <p className="text-zinc-300 text-xs mt-4 text-center font-medium">
                    {totalVotes[poll.id] || 0} votes
                  </p>
                )}

              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}