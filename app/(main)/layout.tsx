'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Target, BarChart3, MessageSquare, Trophy, Table2, Plus, User } from 'lucide-react'

const sidebarLinks = [
  { href: '/predictions', icon: Target, label: 'Predictions' },
  { href: '/polls', icon: BarChart3, label: 'Polls' },
  { href: '/chat', icon: MessageSquare, label: 'Chat' },
  { href: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
  { href: '/table', icon: Table2, label: 'Table' },
]

const bottomLinks = [
  { href: '/feed', icon: Home, label: 'Home' },
  { href: '/feed/new', icon: Plus, label: 'Post', isAction: true },
  { href: '/profile', icon: User, label: 'Profile' },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-white">

      {/* ── FLOATING SIDEBAR ICONS — vertically centered, no bg ── */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-1">
        {sidebarLinks.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              title={label}
              className={`group relative w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                isActive ? 'text-black' : 'text-zinc-300 hover:text-zinc-900'
              }`}
            >
              <Icon className="w-5 h-5" />

              {/* Active indicator — little black pill on right */}
              {isActive && (
                <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-5 bg-black rounded-full" />
              )}

              {/* Tooltip on hover */}
              <div className="absolute left-12 bg-zinc-900 text-white text-xs font-semibold px-2.5 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 whitespace-nowrap z-50 shadow-lg">
                {label}
              </div>
            </Link>
          )
        })}
      </div>

      {/* ── MAIN CONTENT ── pt-20 clears navbar, pb-20 clears bottom nav, pl-16 clears sidebar ── */}
      <main className="pl-16 pt-20 pb-24">
        {children}
      </main>

      {/* ── BOTTOM NAV — full width, frosted ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-t border-zinc-100 h-16 flex items-center justify-around px-8">
        {bottomLinks.map(({ href, icon: Icon, label, isAction }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center gap-1"
            >
              {isAction ? (
                // Plus — big black pill
                <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center shadow-lg shadow-black/20 active:scale-95 transition-all">
                  <Icon className="w-5 h-5 text-white" />
                </div>
              ) : (
                <>
                  <Icon className={`w-5 h-5 transition-colors duration-200 ${isActive ? 'text-black' : 'text-zinc-300'}`} />
                  <span className={`text-[10px] font-bold tracking-wide transition-colors duration-200 ${isActive ? 'text-black' : 'text-zinc-300'}`}>
                    {label}
                  </span>
                </>
              )}
            </Link>
          )
        })}
      </nav>

    </div>
  )
}