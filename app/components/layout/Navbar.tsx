'use client'

import { createClient } from '@/lib/supabase'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const supabase = createClient()
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    // Get current user
    supabase.auth.getUser().then(({ data }) => setUser(data.user))

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setDropdownOpen(false)
  }

  // Get initials from email or name
  const getInitial = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name.charAt(0).toUpperCase()
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase()
    }
    return '?'
  }

  const getDisplayName = () => {
    return user?.user_metadata?.full_name || user?.email || ''
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-xl border-b border-slate-100 shadow-sm'
          : 'bg-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">

        {/* Logo */}
        <span className="text-slate-900 font-extrabold text-xl tracking-tight">
          Terrace
        </span>

        {/* Right side */}
        {user ? (
          <div className="relative">
            {/* Avatar button */}
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 hover:bg-slate-50 rounded-full pl-3 pr-1 py-1 transition-all duration-200 border border-transparent hover:border-slate-200"
            >
              <span className="text-slate-600 text-sm font-medium hidden sm:block max-w-[140px] truncate">
                {getDisplayName()}
              </span>
              {/* Avatar circle */}
              <div className="w-9 h-9 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {getInitial()}
              </div>
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 top-12 z-20 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-100 p-2 w-52 overflow-hidden">
                  {/* User info */}
                  <div className="px-3 py-2 mb-1">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                        {getInitial()}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-slate-900 text-sm font-semibold truncate">
                          {user?.user_metadata?.full_name || 'Fan'}
                        </p>
                        <p className="text-slate-400 text-xs truncate">{user?.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-slate-100 my-1" />

                  {/* Menu items */}
                  <button className="w-full text-left px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-xl transition-colors font-medium">
                    My Profile
                  </button>
                  <button className="w-full text-left px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-xl transition-colors font-medium">
                    My Club
                  </button>

                  <div className="h-px bg-slate-100 my-1" />

                  <button
                    onClick={signOut}
                    className="w-full text-left px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium"
                  >
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <button
            onClick={signInWithGoogle}
            className="flex items-center gap-2.5 bg-slate-900 hover:bg-slate-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>
        )}

      </div>
    </nav>
  )
}