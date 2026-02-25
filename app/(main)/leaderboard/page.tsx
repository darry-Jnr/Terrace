'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Trophy, Flame, Target, Crown } from 'lucide-react'

type LeaderboardUser = {
  id: string
  full_name: string
  email: string
  club_id: string
  club_name: string
  points: number
  streak: number
}

type ClubStanding = {
  club_id: string
  club_name: string
  total_points: number
  total_members: number
}

const clubColors: Record<string, string> = {
  t3: '#EF0107', t7: '#95BFE5', t91: '#DA291C', t94: '#e30613',
  t36: '#0057B8', t8: '#034694', t31: '#1B458F', t11: '#003399',
  t54: '#CC0000', t40: '#0044A9', t13: '#003090', t14: '#C8102E',
  t43: '#6CABDD', t1: '#DA291C', t4: '#241F20', t17: '#DD0000',
  t20: '#D71920', t6: '#132257', t21: '#7A263A', t39: '#FDB913',
}

const clubLogos: Record<string, string> = {
  t3: 'https://resources.premierleague.com/premierleague/badges/t3.png',
  t7: 'https://resources.premierleague.com/premierleague/badges/t7.png',
  t14: 'https://resources.premierleague.com/premierleague/badges/t14.png',
  t43: 'https://resources.premierleague.com/premierleague/badges/t43.png',
  t1: 'https://resources.premierleague.com/premierleague/badges/t1.png',
  t8: 'https://resources.premierleague.com/premierleague/badges/t8.png',
  t6: 'https://resources.premierleague.com/premierleague/badges/t6.png',
  t4: 'https://resources.premierleague.com/premierleague/badges/t4.png',
  t17: 'https://resources.premierleague.com/premierleague/badges/t17.png',
  t36: 'https://resources.premierleague.com/premierleague/badges/t36.png',
}

type Tab = 'players' | 'clubs'

export default function LeaderboardPage() {
  const supabase = createClient()
  const [tab, setTab] = useState<Tab>('players')
  const [players, setPlayers] = useState<LeaderboardUser[]>([])
  const [clubs, setClubs] = useState<ClubStanding[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [myProfile, setMyProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user)

      // Get top players
      const { data: topPlayers } = await supabase
        .from('profiles')
        .select('id, full_name, email, club_id, club_name, points, streak')
        .order('points', { ascending: false })
        .limit(20)

      setPlayers(topPlayers || [])

      // Get club standings
      const { data: clubData } = await supabase
        .from('club_points')
        .select('*')
        .order('total_points', { ascending: false })

      setClubs(clubData || [])

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        setMyProfile(profile)
      }

      setLoading(false)
    }
    init()
  }, [])

  const myRank = players.findIndex(p => p.id === currentUser?.id) + 1

  const getRankStyle = (rank: number) => {
    if (rank === 1) return 'text-yellow-500'
    if (rank === 2) return 'text-zinc-400'
    if (rank === 3) return 'text-amber-600'
    return 'text-zinc-300'
  }

  const getRankBg = (rank: number) => {
    if (rank === 1) return 'bg-yellow-50 border-yellow-200'
    if (rank === 2) return 'bg-zinc-50 border-zinc-200'
    if (rank === 3) return 'bg-amber-50 border-amber-200'
    return 'bg-white border-zinc-100'
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-5 h-5 text-black" />
            <h1 className="text-black font-extrabold text-2xl tracking-tight">Leaderboard</h1>
          </div>
          <p className="text-zinc-400 text-sm">Top fans this week. Resets every Monday.</p>
        </div>

        {/* My rank card */}
        {myProfile && (
          <div className="bg-black rounded-3xl p-5 mb-6 flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg flex-shrink-0"
              style={{ background: clubColors[myProfile.club_id] || '#333' }}
            >
              {(myProfile.full_name || myProfile.email || '?').charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm truncate">
                {myProfile.full_name || myProfile.email?.split('@')[0] || 'You'}
              </p>
              <p className="text-zinc-500 text-xs">{myProfile.club_name}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-white font-black text-2xl">{myProfile.points || 0}</div>
              <div className="text-zinc-500 text-xs">pts</div>
            </div>
            {myRank > 0 && (
              <div className="flex-shrink-0 text-right ml-2">
                <div className="text-zinc-400 text-xs font-bold">Rank</div>
                <div className="text-white font-black text-xl">#{myRank}</div>
              </div>
            )}
          </div>
        )}

        {/* Tabs */}
        <div className="flex bg-zinc-100 rounded-2xl p-1 mb-6">
          {(['players', 'clubs'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all capitalize ${
                tab === t ? 'bg-white text-black shadow-sm' : 'text-zinc-400'
              }`}
            >
              {t === 'players' ? '👤 Players' : '🏟️ Clubs'}
            </button>
          ))}
        </div>

        {/* Players tab */}
        {tab === 'players' && (
          <div className="flex flex-col gap-2">
            {loading ? (
              [1,2,3,4,5].map(i => (
                <div key={i} className="bg-white rounded-3xl p-4 animate-pulse flex items-center gap-3">
                  <div className="w-8 h-5 bg-zinc-100 rounded" />
                  <div className="w-10 h-10 bg-zinc-100 rounded-2xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-zinc-100 rounded w-1/3" />
                    <div className="h-2 bg-zinc-100 rounded w-1/4" />
                  </div>
                  <div className="w-10 h-5 bg-zinc-100 rounded" />
                </div>
              ))
            ) : players.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-3xl mb-3">🏆</p>
                <p className="text-zinc-900 font-bold">No players yet</p>
                <p className="text-zinc-400 text-sm mt-1">Be the first to earn points!</p>
              </div>
            ) : (
              players.map((player, i) => {
                const rank = i + 1
                const isMe = player.id === currentUser?.id

                return (
                  <div
                    key={player.id}
                    className={`border rounded-3xl p-4 flex items-center gap-3 transition-all ${
                      isMe ? 'bg-black border-black' : getRankBg(rank)
                    }`}
                  >
                    {/* Rank */}
                    <div className={`w-8 text-center font-black text-sm flex-shrink-0 ${
                      isMe ? 'text-zinc-400' : getRankStyle(rank)
                    }`}>
                      {rank <= 3 ? (
                        rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'
                      ) : (
                        `#${rank}`
                      )}
                    </div>

                    {/* Avatar */}
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                      style={{ background: clubColors[player.club_id] || '#000' }}
                    >
                      {(player.full_name || player.email || '?').charAt(0).toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className={`font-bold text-sm truncate ${isMe ? 'text-white' : 'text-zinc-900'}`}>
                        {player.full_name || player.email?.split('@')[0] || 'Fan'}
                        {isMe && <span className="text-zinc-500 font-normal text-xs ml-2">you</span>}
                      </p>
                      <p className={`text-xs truncate ${isMe ? 'text-zinc-500' : 'text-zinc-400'}`}>
                        {player.club_name}
                      </p>
                    </div>

                    {/* Streak */}
                    {player.streak > 0 && (
                      <div className={`flex items-center gap-1 flex-shrink-0 ${isMe ? 'text-orange-400' : 'text-orange-400'}`}>
                        <Flame className="w-3.5 h-3.5" />
                        <span className="text-xs font-bold">{player.streak}</span>
                      </div>
                    )}

                    {/* Points */}
                    <div className="text-right flex-shrink-0">
                      <div className={`font-black text-lg ${isMe ? 'text-white' : 'text-zinc-900'}`}>
                        {player.points}
                      </div>
                      <div className={`text-[10px] font-semibold ${isMe ? 'text-zinc-500' : 'text-zinc-400'}`}>pts</div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* Clubs tab */}
        {tab === 'clubs' && (
          <div className="flex flex-col gap-2">
            {loading ? (
              [1,2,3].map(i => (
                <div key={i} className="bg-white rounded-3xl p-4 animate-pulse flex items-center gap-3">
                  <div className="w-8 h-8 bg-zinc-100 rounded-full" />
                  <div className="flex-1 h-4 bg-zinc-100 rounded" />
                  <div className="w-16 h-4 bg-zinc-100 rounded" />
                </div>
              ))
            ) : clubs.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-3xl mb-3">🏟️</p>
                <p className="text-zinc-900 font-bold">No club data yet</p>
                <p className="text-zinc-400 text-sm mt-1">Earn points to put your club on the map!</p>
              </div>
            ) : (
              clubs.map((club, i) => {
                const rank = i + 1
                const isMyClub = club.club_id === myProfile?.club_id

                return (
                  <div
                    key={club.club_id}
                    className={`border rounded-3xl p-4 flex items-center gap-3 transition-all ${
                      isMyClub ? 'bg-black border-black' : getRankBg(rank)
                    }`}
                  >
                    {/* Rank */}
                    <div className={`w-8 text-center font-black text-sm flex-shrink-0 ${
                      isMyClub ? 'text-zinc-400' : getRankStyle(rank)
                    }`}>
                      {rank <= 3 ? (
                        rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'
                      ) : `#${rank}`}
                    </div>

                    {/* Logo */}
                    <img
                      src={clubLogos[club.club_id] || ''}
                      alt={club.club_name}
                      width={36}
                      height={36}
                      className="object-contain flex-shrink-0"
                      onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0' }}
                    />

                    {/* Name */}
                    <div className="flex-1 min-w-0">
                      <p className={`font-bold text-sm ${isMyClub ? 'text-white' : 'text-zinc-900'}`}>
                        {club.club_name}
                        {isMyClub && <span className="text-zinc-500 font-normal text-xs ml-2">your club</span>}
                      </p>
                      <p className={`text-xs ${isMyClub ? 'text-zinc-500' : 'text-zinc-400'}`}>
                        {club.total_members} members
                      </p>
                    </div>

                    {/* Points */}
                    <div className="text-right flex-shrink-0">
                      <div className={`font-black text-lg ${isMyClub ? 'text-white' : 'text-zinc-900'}`}>
                        {club.total_points}
                      </div>
                      <div className={`text-[10px] font-semibold ${isMyClub ? 'text-zinc-500' : 'text-zinc-400'}`}>pts</div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

      </div>
    </div>
  )
}