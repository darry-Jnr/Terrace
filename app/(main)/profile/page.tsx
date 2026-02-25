'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Check, Pencil, X, LogOut, MapPin, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

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

const RankIcons = {
  Newbie: ({ color }: { color: string }) => (
    <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="12" stroke={color} strokeWidth="2" />
      <circle cx="14" cy="14" r="5" fill={color} opacity="0.3" />
      <circle cx="14" cy="14" r="2.5" fill={color} />
    </svg>
  ),
  Rookie: ({ color }: { color: string }) => (
    <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
      <path d="M14 3L17.5 10.5H25L19 15.5L21.5 23L14 18.5L6.5 23L9 15.5L3 10.5H10.5L14 3Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  ),
  Pro: ({ color }: { color: string }) => (
    <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
      <path d="M14 3L17.5 10.5H25L19 15.5L21.5 23L14 18.5L6.5 23L9 15.5L3 10.5H10.5L14 3Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" fill={color} fillOpacity="0.15" />
      <path d="M14 7L16.5 12H21.5L17.5 15L19 20L14 17L9 20L10.5 15L6.5 12H11.5L14 7Z" fill={color} />
    </svg>
  ),
  Elite: ({ color }: { color: string }) => (
    <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
      <path d="M5 8L14 4L23 8V16C23 20.4 18.9 23.7 14 25C9.1 23.7 5 20.4 5 16V8Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" fill={color} fillOpacity="0.1" />
      <path d="M10 14L13 17L18 11" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Master: ({ color }: { color: string }) => (
    <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
      <path d="M5 8L14 4L23 8V16C23 20.4 18.9 23.7 14 25C9.1 23.7 5 20.4 5 16V8Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" fill={color} fillOpacity="0.15" />
      <path d="M14 9L15.8 12.6L20 13.2L17 16.1L17.6 20.3L14 18.4L10.4 20.3L11 16.1L8 13.2L12.2 12.6L14 9Z" fill={color} />
    </svg>
  ),
  Legend: ({ color }: { color: string }) => (
    <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
      <path d="M4 20H24L22 10L17 15L14 8L11 15L6 10L4 20Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" fill={color} fillOpacity="0.15" />
      <circle cx="4" cy="10" r="2" fill={color} />
      <circle cx="14" cy="8" r="2" fill={color} />
      <circle cx="24" cy="10" r="2" fill={color} />
      <path d="M4 22H24" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  Icon: ({ color }: { color: string }) => (
    <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
      <path d="M4 18H24L22 10L17 14L14 6L11 14L6 10L4 18Z" fill={color} fillOpacity="0.9" />
      <path d="M4 20H24L22 12L17 16L14 8L11 16L6 12L4 20Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M6 22H22" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="14" cy="4" r="2" fill={color} />
    </svg>
  ),
}

const RANKS = [
  { id: 'Newbie', label: 'Newbie', minPoints: 0, minStreak: 0, color: '#94a3b8', bg: '#f8fafc', border: '#e2e8f0', desc: 'Just getting started' },
  { id: 'Rookie', label: 'Rookie', minPoints: 75, minStreak: 3, color: '#16a34a', bg: '#f0fdf4', border: '#86efac', desc: 'Making your mark' },
  { id: 'Pro', label: 'Pro', minPoints: 200, minStreak: 10, color: '#2563eb', bg: '#eff6ff', border: '#93c5fd', desc: 'Consistent and accurate' },
  { id: 'Elite', label: 'Elite', minPoints: 500, minStreak: 21, color: '#7c3aed', bg: '#f5f3ff', border: '#c4b5fd', desc: 'Among the best' },
  { id: 'Master', label: 'Master', minPoints: 1000, minStreak: 45, color: '#b45309', bg: '#fffbeb', border: '#fcd34d', desc: 'Commanding the table' },
  { id: 'Legend', label: 'Legend', minPoints: 2000, minStreak: 90, color: '#dc2626', bg: '#fff1f2', border: '#fca5a5', desc: 'The stuff of folklore' },
  { id: 'Icon', label: 'Icon', minPoints: 4000, minStreak: 180, color: '#000000', bg: '#fafafa', border: '#18181b', desc: 'Untouchable. Absolute.' },
]

function getCurrentRank(points: number, streak: number) {
  let rank = RANKS[0]
  for (const r of RANKS) {
    if (points >= r.minPoints && streak >= r.minStreak) rank = r
  }
  return rank
}

function getNextRank(points: number, streak: number) {
  for (const r of RANKS) {
    if (points < r.minPoints || streak < r.minStreak) return r
  }
  return null
}

function getProgress(points: number, streak: number, next: typeof RANKS[0] | null) {
  if (!next) return 100
  const pProg = Math.min((points / next.minPoints) * 100, 100)
  const sProg = next.minStreak > 0 ? Math.min((streak / next.minStreak) * 100, 100) : 100
  return Math.floor(Math.min(pProg, sProg))
}

// Convert country code to flag emoji
function getFlagEmoji(countryCode: string) {
  return countryCode
    .toUpperCase()
    .replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt(0)))
}

export default function ProfilePage() {
  const supabase = createClient()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [stats, setStats] = useState({ total: 0, correct: 0 })
  const [location, setLocation] = useState<{ city: string; country: string; countryCode: string } | null>(null)
  const [locLoading, setLocLoading] = useState(false)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return setLoading(false)

      const { data: p } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (p) {
        setProfile(p)
        setNameInput(p.full_name || '')
        // Load saved location if exists
        if (p.city && p.country) {
          setLocation({ city: p.city, country: p.country, countryCode: p.country_code || '' })
        }

        const { data: preds } = await supabase
          .from('predictions')
          .select('is_correct')
          .eq('user_id', user.id)

        setStats({
          total: preds?.length || 0,
          correct: preds?.filter((p: any) => p.is_correct === true).length || 0,
        })
      }

      setLoading(false)
    }
    load()
  }, [])

  const handleDetectLocation = () => {
    if (!navigator.geolocation) return
    setLocLoading(true)

    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const { latitude, longitude } = pos.coords
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
        const data = await res.json()

        const city = data.address?.city || data.address?.town || data.address?.village || data.address?.county || ''
        const country = data.address?.country || ''
        const countryCode = data.address?.country_code?.toUpperCase() || ''

        setLocation({ city, country, countryCode })

        // Save to profile
        if (profile) {
          await supabase.from('profiles').update({
            city,
            country,
            country_code: countryCode,
            updated_at: new Date().toISOString(),
          }).eq('id', profile.id)
        }
      } catch (e) {
        console.error(e)
      }
      setLocLoading(false)
    }, () => setLocLoading(false))
  }

  const handleSaveName = async () => {
    if (!nameInput.trim() || !profile) return
    setSaving(true)
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: nameInput.trim(), updated_at: new Date().toISOString() })
      .eq('id', profile.id)
    if (!error) {
      setProfile((prev: any) => ({ ...prev, full_name: nameInput.trim() }))
      setEditing(false)
    }
    setSaving(false)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-zinc-200 border-t-black rounded-full animate-spin" />
      </div>
    )
  }

  if (!profile) return null

  const points = profile.points || 0
  const streak = profile.streak || 0
  const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0
  const rank = getCurrentRank(points, streak)
  const nextRank = getNextRank(points, streak)
  const progress = getProgress(points, streak, nextRank)
  const clubColor = clubColors[profile.club_id] || '#000'
  const RankIcon = RankIcons[rank.id as keyof typeof RankIcons]
  const initials = (profile.full_name || profile.email || '?')
    .split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
  const joinedDate = new Date(profile.created_at).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })

  return (
    <div className="min-h-screen bg-zinc-50 overflow-y-auto pb-20">

      {/* ── HEADER ── */}
      <div className="bg-white px-5 pt-6 pb-4 border-b border-zinc-100">
        <div className="flex items-start justify-between mb-4">

          {/* Avatar */}
          <div className="relative">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-md"
              style={{ background: clubColor }}
            >
              {initials}
            </div>
            <div
              className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full flex items-center justify-center border-2 border-white shadow"
              style={{ background: rank.bg }}
            >
              <RankIcon color={rank.color} />
            </div>
          </div>

          {/* Club */}
          {profile.club_name && (
            <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-100 rounded-xl px-2.5 py-1.5">
              <img
                src={clubLogos[profile.club_id]}
                alt={profile.club_name}
                width={18} height={18}
                className="object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0' }}
              />
              <span className="text-xs font-bold text-zinc-700">{profile.club_name}</span>
            </div>
          )}
        </div>

        {/* Name */}
        {editing ? (
          <div className="flex items-center gap-2 mb-0.5">
            <input
              autoFocus
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSaveName()}
              maxLength={40}
              className="flex-1 text-lg font-black text-zinc-900 bg-zinc-100 rounded-xl px-3 py-1.5 outline-none border border-zinc-200"
            />
            <button onClick={handleSaveName} disabled={saving} className="w-8 h-8 bg-black text-white rounded-xl flex items-center justify-center active:scale-95">
              <Check className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => { setEditing(false); setNameInput(profile.full_name || '') }} className="w-8 h-8 bg-zinc-100 text-zinc-400 rounded-xl flex items-center justify-center">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 mb-0.5">
            <h1 className="text-lg font-black text-zinc-900">{profile.full_name || 'No name set'}</h1>
            <button onClick={() => setEditing(true)} className="w-6 h-6 bg-zinc-100 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-700 transition-colors">
              <Pencil className="w-3 h-3" />
            </button>
          </div>
        )}

        <p className="text-zinc-400 text-xs">{profile.email}</p>

        {/* Location row */}
        <div className="flex items-center gap-2 mt-2">
          {location ? (
            <div className="flex items-center gap-1.5">
              <span className="text-base">{getFlagEmoji(location.countryCode)}</span>
              <span className="text-xs font-semibold text-zinc-500">
                {location.city}{location.city && location.country ? ', ' : ''}{location.country}
              </span>
              <button
                onClick={handleDetectLocation}
                className="text-[10px] text-zinc-300 hover:text-zinc-500 transition-colors ml-1"
              >
                update
              </button>
            </div>
          ) : (
            <button
              onClick={handleDetectLocation}
              disabled={locLoading}
              className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-zinc-700 transition-colors"
            >
              {locLoading ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <MapPin className="w-3 h-3" />
              )}
              {locLoading ? 'Detecting...' : 'Add location'}
            </button>
          )}
        </div>

        <p className="text-zinc-300 text-[10px] mt-0.5">Joined {joinedDate}</p>
      </div>

      {/* ── RANK CARD ── */}
      <div className="mx-3 mt-3">
        <div className="rounded-2xl p-4 border-2" style={{ background: rank.bg, borderColor: rank.border }}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: rank.color }}>Current Rank</p>
              <div className="flex items-center gap-2.5 mb-0.5">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center border bg-white" style={{ borderColor: rank.border }}>
                  <RankIcon color={rank.color} />
                </div>
                <span className="text-xl font-black" style={{ color: rank.color }}>{rank.label}</span>
              </div>
              <p className="text-[10px] pl-0.5" style={{ color: rank.color, opacity: 0.6 }}>{rank.desc}</p>
            </div>

            {nextRank && (() => {
              const NextIcon = RankIcons[nextRank.id as keyof typeof RankIcons]
              return (
                <div className="text-right flex flex-col items-end gap-1">
                  <p className="text-[10px] text-zinc-400 font-semibold">Next</p>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center border border-zinc-200 bg-white opacity-50">
                    <NextIcon color={nextRank.color} />
                  </div>
                  <p className="text-[10px] font-bold text-zinc-400">{nextRank.label}</p>
                </div>
              )
            })()}
          </div>

          {nextRank && (
            <>
              <div className="flex justify-between text-[10px] mb-1.5" style={{ color: rank.color, opacity: 0.6 }}>
                <span>{progress}% to {nextRank.label}</span>
                <span>{nextRank.minPoints}pts · {nextRank.minStreak}d</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden bg-black/10">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${progress}%`, background: rank.color }} />
              </div>
            </>
          )}
          {!nextRank && (
            <p className="text-[10px] font-bold text-center mt-1" style={{ color: rank.color }}>
              Maximum rank achieved. You are an Icon.
            </p>
          )}
        </div>
      </div>

      {/* ── STATS ── */}
      <div className="mx-3 mt-2 grid grid-cols-4 gap-1.5">
        {[
          { val: points, label: 'Points' },
          { val: streak, label: 'Streak', suffix: 'd' },
          { val: `${stats.correct}/${stats.total}`, label: 'Correct' },
          { val: accuracy, label: 'Accuracy', suffix: '%' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-2.5 border border-zinc-100 text-center">
            <p className="text-base font-black text-zinc-900 leading-tight">
              {s.val}{s.suffix && <span className="text-[10px] text-zinc-300">{s.suffix}</span>}
            </p>
            <p className="text-zinc-400 text-[9px] font-semibold mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── ALL RANKS ── */}
      <div className="mx-3 mt-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2 px-1">All Ranks</p>
        <div className="grid grid-cols-4 gap-1.5">
          {RANKS.map(r => {
            const unlocked = points >= r.minPoints && streak >= r.minStreak
            const isCurrent = r.id === rank.id
            const Icon = RankIcons[r.id as keyof typeof RankIcons]
            return (
              <div
                key={r.id}
                className={`rounded-xl p-2.5 border text-center flex flex-col items-center gap-1 transition-all ${isCurrent ? 'border-2' : ''}`}
                style={{
                  background: unlocked ? r.bg : '#fafafa',
                  borderColor: isCurrent ? r.color : unlocked ? r.border : '#f0f0f0',
                  opacity: unlocked ? 1 : 0.35,
                }}
              >
                <Icon color={unlocked ? r.color : '#d1d5db'} />
                <p className="text-[9px] font-black leading-tight" style={{ color: unlocked ? r.color : '#9ca3af' }}>
                  {r.label}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── SIGN OUT ── */}
      <div className="mx-3 mt-3 mb-2">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 bg-white border border-zinc-200 text-zinc-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 font-semibold text-sm py-3 rounded-2xl transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>

    </div>
  )
}