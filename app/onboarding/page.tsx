'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const clubs = [
  { id: 't3', name: 'Arsenal', logo: 'https://resources.premierleague.com/premierleague/badges/t3.png', color: '#EF0107' },
  { id: 't7', name: 'Aston Villa', logo: 'https://resources.premierleague.com/premierleague/badges/t7.png', color: '#95BFE5' },
  { id: 't91', name: 'Bournemouth', logo: 'https://resources.premierleague.com/premierleague/badges/t91.png', color: '#DA291C' },
  { id: 't94', name: 'Brentford', logo: 'https://resources.premierleague.com/premierleague/badges/t94.png', color: '#e30613' },
  { id: 't36', name: 'Brighton', logo: 'https://resources.premierleague.com/premierleague/badges/t36.png', color: '#0057B8' },
  { id: 't8', name: 'Chelsea', logo: 'https://resources.premierleague.com/premierleague/badges/t8.png', color: '#034694' },
  { id: 't31', name: 'Crystal Palace', logo: 'https://resources.premierleague.com/premierleague/badges/t31.png', color: '#1B458F' },
  { id: 't11', name: 'Everton', logo: 'https://resources.premierleague.com/premierleague/badges/t11.png', color: '#003399' },
  { id: 't54', name: 'Fulham', logo: 'https://resources.premierleague.com/premierleague/badges/t54.png', color: '#CC0000' },
  { id: 't40', name: 'Ipswich', logo: 'https://resources.premierleague.com/premierleague/badges/t40.png', color: '#0044A9' },
  { id: 't13', name: 'Leicester', logo: 'https://resources.premierleague.com/premierleague/badges/t13.png', color: '#003090' },
  { id: 't14', name: 'Liverpool', logo: 'https://resources.premierleague.com/premierleague/badges/t14.png', color: '#C8102E' },
  { id: 't43', name: 'Man City', logo: 'https://resources.premierleague.com/premierleague/badges/t43.png', color: '#6CABDD' },
  { id: 't1', name: 'Man Utd', logo: 'https://resources.premierleague.com/premierleague/badges/t1.png', color: '#DA291C' },
  { id: 't4', name: 'Newcastle', logo: 'https://resources.premierleague.com/premierleague/badges/t4.png', color: '#241F20' },
  { id: 't17', name: 'Nottm Forest', logo: 'https://resources.premierleague.com/premierleague/badges/t17.png', color: '#DD0000' },
  { id: 't20', name: 'Southampton', logo: 'https://resources.premierleague.com/premierleague/badges/t20.png', color: '#D71920' },
  { id: 't6', name: 'Spurs', logo: 'https://resources.premierleague.com/premierleague/badges/t6.png', color: '#132257' },
  { id: 't21', name: 'West Ham', logo: 'https://resources.premierleague.com/premierleague/badges/t21.png', color: '#7A263A' },
  { id: 't39', name: 'Wolves', logo: 'https://resources.premierleague.com/premierleague/badges/t39.png', color: '#FDB913' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [selected, setSelected] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const selectedClub = clubs.find(c => c.id === selected)

  const handleConfirm = async () => {
    if (!selected) return
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('profiles').upsert({
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name,
      club_id: selected,
      club_name: selectedClub?.name,
      updated_at: new Date().toISOString(),
    })

    router.push('/feed')
  }

  return (
    <main className="min-h-screen bg-white px-6 py-24">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            <span className="text-slate-500 text-xs font-semibold tracking-widest uppercase">
              Step 1 of 1
            </span>
          </div>
          <h1 className="text-slate-900 font-extrabold text-4xl md:text-5xl tracking-tight mb-4">
            Pick your club.
          </h1>
          <p className="text-slate-400 text-lg max-w-sm mx-auto leading-relaxed">
            Choose wisely. Your activity earns points for your entire fanbase.
          </p>
        </div>

        {/* Club grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-12">
          {clubs.map((club) => {
            const isSelected = selected === club.id
            return (
              <button
                key={club.id}
                onClick={() => setSelected(club.id)}
                className={`relative flex flex-col items-center gap-3 p-5 rounded-3xl border-2 transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] ${
                  isSelected
                    ? 'border-slate-900 bg-slate-900 shadow-xl shadow-slate-200'
                    : 'border-slate-100 bg-slate-50 hover:border-slate-300 hover:bg-white hover:shadow-md'
                }`}
              >
                {/* Selected checkmark */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}

                {/* Club logo */}
                <img
                  src={club.logo}
                  alt={club.name}
                  width={44}
                  height={44}
                  className="object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0' }}
                />

                {/* Club name */}
                <span className={`text-xs font-bold text-center leading-tight transition-colors ${
                  isSelected ? 'text-white' : 'text-slate-700'
                }`}>
                  {club.name}
                </span>

                {/* Club color bar at bottom */}
                <div
                  className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full opacity-60"
                  style={{ background: isSelected ? club.color : 'transparent' }}
                />
              </button>
            )
          })}
        </div>

        {/* Confirm button */}
        <div className="flex justify-center">
          <div className="flex flex-col items-center gap-4">
            {selectedClub && (
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3">
                <img src={selectedClub.logo} alt={selectedClub.name} width={28} height={28} className="object-contain" />
                <span className="text-slate-700 font-semibold text-sm">
                  You're joining <span className="text-slate-900 font-bold">{selectedClub.name}</span>
                </span>
              </div>
            )}

            <button
              onClick={handleConfirm}
              disabled={!selected || loading}
              className={`flex items-center gap-2 font-semibold text-base px-10 py-4 rounded-full transition-all duration-200 ${
                selected && !loading
                  ? 'bg-slate-900 hover:bg-slate-700 text-white hover:scale-[1.03] active:scale-[0.97] shadow-lg shadow-slate-200'
                  : 'bg-slate-100 text-slate-300 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Joining...
                </>
              ) : (
                <>
                  Confirm my club →
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </main>
  )
}