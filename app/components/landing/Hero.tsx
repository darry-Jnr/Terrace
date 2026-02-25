'use client'

import { createClient } from '@/lib/supabase'
import { useEffect, useState } from 'react'

export default function Hero() {
  const supabase = createClient()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  return (
    <section className="relative min-h-screen bg-white  overflow-hidden">

      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #94a3b8 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />

      {/* Soft glow */}
      <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-emerald-100 rounded-full blur-3xl opacity-30 pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-slate-100 rounded-full blur-3xl opacity-50 pointer-events-none" />

      {/* Main layout */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 min-h-screen flex items-center pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-0 items-center w-full">

          {/* LEFT — Text */}
          <div
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(28px)',
              transition: 'opacity 0.8s ease, transform 0.8s ease',
            }}
          >
          

            {/* Headline */}
            <h1 className="text-slate-900 mt-16 md:mt-8  font-extrabold text-5xl md:text-6xl xl:text-7xl leading-[0.95] tracking-tight mb-6">
              Where<br />
              football<br />
              <span className="text-emerald-500">fans unite.</span>
            </h1>

            <p className="text-slate-400 text-lg font-normal max-w-sm mb-10 leading-relaxed">
              Pick your club. Predict matches. Drop banter.
              Earn points and lift your fanbase up the community table.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 mb-10">
              <button
                onClick={signInWithGoogle}
                className="flex items-center gap-2.5 bg-slate-900 hover:bg-slate-700 text-white font-semibold text-base px-7 py-3.5 rounded-full transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] shadow-lg shadow-slate-200"
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Get Started Free
              </button>
              <button className="text-slate-500 hover:text-slate-900 font-semibold text-base px-7 py-3.5 rounded-full border border-slate-200 hover:border-slate-400 transition-all duration-200">
                Learn more ↓
              </button>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-8">
              {[
                { num: '20', label: 'Clubs' },
                { num: '∞', label: 'Banter' },
                { num: '#1', label: 'Table' },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-slate-900 font-extrabold text-2xl tracking-tight">{s.num}</div>
                  <div className="text-slate-400 text-xs font-semibold uppercase tracking-widest mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Blob image */}
          <div
            className="relative flex items-center justify-center lg:justify-end"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(32px)',
              transition: 'opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s',
            }}
          >
            {/* Blob SVG clip */}
            <svg width="0" height="0" className="absolute">
              <defs>
                <clipPath id="blob1" clipPathUnits="objectBoundingBox">
                  <path d="M0.1,0.05 C0.25,-0.02 0.75,-0.02 0.92,0.1 C1.05,0.25 1.02,0.55 0.9,0.75 C0.78,0.95 0.55,1.02 0.3,0.97 C0.1,0.92 -0.02,0.7 0.02,0.45 C0.04,0.28 0.0,0.1 0.1,0.05 Z" />
                </clipPath>
              </defs>
            </svg>

            {/* Floating accent blob behind */}
            <div
              className="absolute w-[420px] h-[420px] bg-emerald-400 opacity-10"
              style={{
                clipPath: 'path("M200,20 C280,-10 380,40 410,130 C440,220 400,330 320,380 C240,430 120,420 60,340 C0,260 20,150 80,90 C110,60 150,40 200,20 Z")',
              }}
            />

            {/* Main image with blob clip */}
            <div
              className="relative w-[480px] h-[540px]"
              style={{
                clipPath: 'path("M240,10 C330,-15 430,30 460,130 C490,230 460,360 370,420 C280,480 140,470 70,380 C10,300 20,180 70,100 C110,40 160,30 240,10 Z")',
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=900&q=85"
                alt="Football fans"
                className="w-full h-full object-cover"
              />
              {/* Overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(180deg, transparent 50%, rgba(255,255,255,0.15) 100%)',
                }}
              />
            </div>

            {/* Floating pill — top left of image */}
            <div className="absolute top-12 -left-4 bg-white border border-slate-100 rounded-2xl px-4 py-3 shadow-xl shadow-slate-100 flex items-center gap-3">
              <span className="text-2xl">🏆</span>
              <div>
                <div className="text-slate-900 font-bold text-sm">Community Table</div>
                <div className="text-slate-400 text-xs">Liverpool fans #1</div>
              </div>
            </div>

            {/* Floating pill — bottom right of image */}
            <div className="absolute bottom-20 -right-2 bg-slate-900 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3">
              <span className="text-2xl">🔥</span>
              <div>
                <div className="text-white font-bold text-sm">42 day streak</div>
                <div className="text-slate-400 text-xs">Keep it going!</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}