'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Table2, TrendingUp, TrendingDown, Minus } from 'lucide-react'

type ClubRow = {
  club_id: string
  club_name: string
  total_points: number
  total_members: number
  updated_at: string
}

const clubLogos: Record<string, string> = {
  t3: 'https://resources.premierleague.com/premierleague/badges/t3.png',
  t7: 'https://resources.premierleague.com/premierleague/badges/t7.png',
  t91: 'https://resources.premierleague.com/premierleague/badges/t91.png',
  t94: 'https://resources.premierleague.com/premierleague/badges/t94.png',
  t36: 'https://resources.premierleague.com/premierleague/badges/t36.png',
  t8: 'https://resources.premierleague.com/premierleague/badges/t8.png',
  t31: 'https://resources.premierleague.com/premierleague/badges/t31.png',
  t11: 'https://resources.premierleague.com/premierleague/badges/t11.png',
  t54: 'https://resources.premierleague.com/premierleague/badges/t54.png',
  t40: 'https://resources.premierleague.com/premierleague/badges/t40.png',
  t13: 'https://resources.premierleague.com/premierleague/badges/t13.png',
  t14: 'https://resources.premierleague.com/premierleague/badges/t14.png',
  t43: 'https://resources.premierleague.com/premierleague/badges/t43.png',
  t1: 'https://resources.premierleague.com/premierleague/badges/t1.png',
  t4: 'https://resources.premierleague.com/premierleague/badges/t4.png',
  t17: 'https://resources.premierleague.com/premierleague/badges/t17.png',
  t20: 'https://resources.premierleague.com/premierleague/badges/t20.png',
  t6: 'https://resources.premierleague.com/premierleague/badges/t6.png',
  t21: 'https://resources.premierleague.com/premierleague/badges/t21.png',
  t39: 'https://resources.premierleague.com/premierleague/badges/t39.png',
}

const clubColors: Record<string, string> = {
  t3: '#EF0107', t7: '#95BFE5', t91: '#DA291C', t94: '#e30613',
  t36: '#0057B8', t8: '#034694', t31: '#1B458F', t11: '#003399',
  t54: '#CC0000', t40: '#0044A9', t13: '#003090', t14: '#C8102E',
  t43: '#6CABDD', t1: '#DA291C', t4: '#241F20', t17: '#DD0000',
  t20: '#D71920', t6: '#132257', t21: '#7A263A', t39: '#FDB913',
}

// Mock trend — later compute from historical data
const mockTrend: Record<string, 'up' | 'down' | 'same'> = {
  t14: 'up', t3: 'up', t43: 'down', t8: 'same',
  t1: 'down', t6: 'up', t4: 'same', t7: 'up',
}

export default function TablePage() {
  const supabase = createClient()
  const [clubs, setClubs] = useState<ClubRow[]>([])
  const [myProfile, setMyProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        setMyProfile(profile)
      }

      const { data } = await supabase
        .from('club_points')
        .select('*')
        .order('total_points', { ascending: false })

      setClubs(data || [])
      setLoading(false)
    }
    init()
  }, [])

  const topClub = clubs[0]
  const myClubRank = clubs.findIndex(c => c.club_id === myProfile?.club_id) + 1
  const myClub = clubs.find(c => c.club_id === myProfile?.club_id)

  const TrendIcon = ({ clubId }: { clubId: string }) => {
    const trend = mockTrend[clubId] || 'same'
    if (trend === 'up') return <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
    if (trend === 'down') return <TrendingDown className="w-3.5 h-3.5 text-red-400" />
    return <Minus className="w-3.5 h-3.5 text-zinc-300" />
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Table2 className="w-5 h-5 text-black" />
            <h1 className="text-black font-extrabold text-2xl tracking-tight">Community Table</h1>
          </div>
          <p className="text-zinc-400 text-sm">Fan engagement points. Updated in real time.</p>
        </div>

        {/* Top club hero */}
        {!loading && topClub && (
          <div
            className="rounded-3xl p-6 mb-6 relative overflow-hidden"
            style={{ background: clubColors[topClub.club_id] || '#000' }}
          >
            <div className="absolute -top-8 -right-8 w-36 h-36 bg-white/10 rounded-full" />
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-black/10 rounded-full" />

            <div className="relative flex items-center gap-4">
              <img
                src={clubLogos[topClub.club_id]}
                alt={topClub.club_name}
                width={56}
                height={56}
                className="object-contain flex-shrink-0"
              />
              <div className="flex-1">
                <p className="text-white/70 text-xs font-bold tracking-widest uppercase mb-1">🏆 Top of the table</p>
                <p className="text-white font-black text-2xl leading-tight">{topClub.club_name}</p>
                <p className="text-white/60 text-sm">{topClub.total_members} active fans</p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-white font-black text-4xl">{topClub.total_points}</div>
                <div className="text-white/50 text-xs font-semibold">PTS</div>
              </div>
            </div>
          </div>
        )}

        {/* My club card */}
        {myClub && myClubRank > 1 && (
          <div className="bg-black rounded-3xl p-4 mb-4 flex items-center gap-3">
            <div className="text-zinc-500 font-black text-sm w-7 text-center flex-shrink-0">
              #{myClubRank}
            </div>
            <img
              src={clubLogos[myClub.club_id]}
              alt={myClub.club_name}
              width={36}
              height={36}
              className="object-contain flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm">
                {myClub.club_name}
                <span className="text-zinc-500 font-normal text-xs ml-2">your club</span>
              </p>
              <p className="text-zinc-500 text-xs">{myClub.total_members} members</p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-white font-black text-xl">{myClub.total_points}</div>
              <div className="text-zinc-600 text-[10px] font-semibold">PTS</div>
            </div>
          </div>
        )}

        {/* Table header */}
        <div className="grid grid-cols-12 px-4 mb-2">
          <div className="col-span-1 text-zinc-300 text-xs font-bold">#</div>
          <div className="col-span-6 text-zinc-300 text-xs font-bold">Club</div>
          <div className="col-span-2 text-zinc-300 text-xs font-bold text-center">Members</div>
          <div className="col-span-2 text-zinc-300 text-xs font-bold text-center">Trend</div>
          <div className="col-span-1 text-zinc-300 text-xs font-bold text-right">Pts</div>
        </div>

        {/* Table rows */}
        <div className="flex flex-col gap-2">
          {loading ? (
            [1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="bg-white rounded-2xl p-4 animate-pulse flex items-center gap-3">
                <div className="w-6 h-4 bg-zinc-100 rounded" />
                <div className="w-8 h-8 bg-zinc-100 rounded-full" />
                <div className="flex-1 h-4 bg-zinc-100 rounded" />
                <div className="w-12 h-4 bg-zinc-100 rounded" />
              </div>
            ))
          ) : clubs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-4xl mb-3">🏟️</p>
              <p className="text-zinc-900 font-bold text-lg">Table is empty</p>
              <p className="text-zinc-400 text-sm mt-1">Start earning points to put your club on the table!</p>
            </div>
          ) : (
            clubs.map((club, i) => {
              const rank = i + 1
              const isMyClub = club.club_id === myProfile?.club_id
              const isTop3 = rank <= 3

              return (
                <div
                  key={club.club_id}
                  className={`grid grid-cols-12 items-center px-4 py-3 rounded-2xl border transition-all ${
                    isMyClub
                      ? 'bg-zinc-900 border-zinc-800'
                      : isTop3
                        ? 'bg-white border-zinc-100 shadow-sm'
                        : 'bg-white border-zinc-100 hover:border-zinc-200'
                  }`}
                >
                  {/* Rank */}
                  <div className={`col-span-1 font-black text-sm ${
                    isMyClub ? 'text-zinc-500' :
                    rank === 1 ? 'text-yellow-500' :
                    rank === 2 ? 'text-zinc-400' :
                    rank === 3 ? 'text-amber-600' :
                    'text-zinc-300'
                  }`}>
                    {rank <= 3
                      ? rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'
                      : rank}
                  </div>

                  {/* Club */}
                  <div className="col-span-6 flex items-center gap-2.5">
                    <img
                      src={clubLogos[club.club_id]}
                      alt={club.club_name}
                      width={28}
                      height={28}
                      className="object-contain flex-shrink-0"
                      onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0' }}
                    />
                    <span className={`font-bold text-sm truncate ${isMyClub ? 'text-white' : 'text-zinc-900'}`}>
                      {club.club_name}
                    </span>
                  </div>

                  {/* Members */}
                  <div className={`col-span-2 text-center text-xs font-semibold ${isMyClub ? 'text-zinc-500' : 'text-zinc-400'}`}>
                    {club.total_members}
                  </div>

                  {/* Trend */}
                  <div className="col-span-2 flex justify-center">
                    <TrendIcon clubId={club.club_id} />
                  </div>

                  {/* Points */}
                  <div className={`col-span-1 text-right font-black text-sm ${isMyClub ? 'text-white' : 'text-zinc-900'}`}>
                    {club.total_points}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer note */}
        <p className="text-center text-zinc-300 text-xs mt-8">
          Points earned from predictions, polls, streaks & daily prompts.
        </p>

      </div>
    </div>
  )
}