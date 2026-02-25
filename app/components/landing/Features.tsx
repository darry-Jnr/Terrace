import { Zap, Target, BarChart3, MessageSquare, Trophy, Flame } from 'lucide-react'

export default function Features() {
  return (
    <section className="py-28 px-6 bg-white">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-bold tracking-widest uppercase text-slate-300 mb-4">Why Terrace</p>
          <h2 className="text-slate-900 font-extrabold text-4xl md:text-6xl tracking-tight leading-tight">
            Built for real fans.
          </h2>
          <p className="text-slate-400 text-lg mt-4 max-w-md mx-auto leading-relaxed">
            Every feature designed to keep the banter flowing and your club climbing.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-12 grid-rows-auto gap-4">

          {/* Row 1: Big left card + tall right card */}

          {/* 1. Daily Streak — wide */}
          <div className="col-span-12 md:col-span-7 bg-slate-900 rounded-[2.5rem] p-10 flex flex-col justify-between min-h-[220px] relative overflow-hidden group">
            {/* background circle decoration */}
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/5 rounded-full" />
            <div className="absolute -bottom-4 -right-4 w-28 h-28 bg-emerald-500/10 rounded-full" />
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-emerald-400 mb-6">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-white font-bold text-2xl mb-2 tracking-tight">Daily Streak</h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                Log in every day to keep your streak alive. Miss a day and you start from zero. Your club needs you.
              </p>
            </div>
          </div>

          {/* 2. Community Table — tall right */}
          <div className="col-span-12 md:col-span-5 bg-emerald-500 rounded-[2.5rem] p-10 flex flex-col justify-between min-h-[220px] relative overflow-hidden group">
            <div className="absolute -top-8 -left-8 w-40 h-40 bg-white/10 rounded-full" />
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white mb-6">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-white font-bold text-2xl mb-2 tracking-tight">Community Table</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Every action earns your club points. Can your fanbase top the table?
              </p>
            </div>
          </div>

          {/* Row 2: Three equal cards */}

          {/* 3. Predictions */}
          <div className="col-span-12 md:col-span-4 bg-slate-50 border border-slate-100 rounded-[2.5rem] p-8 flex flex-col justify-between min-h-[200px] hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-100 transition-all duration-300">
            <div className="w-11 h-11 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-700 mb-6 shadow-sm">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-slate-900 font-bold text-lg mb-1.5 tracking-tight">Match Predictions</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Call the exact scoreline before kickoff. Earn precision points.
              </p>
            </div>
          </div>

          {/* 4. Daily Polls */}
          <div className="col-span-12 md:col-span-4 bg-slate-50 border border-slate-100 rounded-[2.5rem] p-8 flex flex-col justify-between min-h-[200px] hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-100 transition-all duration-300">
            <div className="w-11 h-11 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-700 mb-6 shadow-sm">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-slate-900 font-bold text-lg mb-1.5 tracking-tight">Daily Polls</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                One spicy question drops every morning. Vote before midnight.
              </p>
            </div>
          </div>

          {/* 5. Flash Prompts */}
          <div className="col-span-12 md:col-span-4 bg-slate-50 border border-slate-100 rounded-[2.5rem] p-8 flex flex-col justify-between min-h-[200px] hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-100 transition-all duration-300">
            <div className="w-11 h-11 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-700 mb-6 shadow-sm">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-slate-900 font-bold text-lg mb-1.5 tracking-tight">Flash Prompts</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Daily banter prompts. React fast or get left behind.
              </p>
            </div>
          </div>

          {/* Row 3: Small left + wide right */}

          {/* 6. Club Chat — small */}
          <div className="col-span-12 md:col-span-5 bg-slate-900 rounded-[2.5rem] p-8 flex flex-col justify-between min-h-[180px] relative overflow-hidden">
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/5 rounded-full" />
            <div className="w-11 h-11 bg-white/10 rounded-2xl flex items-center justify-center text-emerald-400 mb-6">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-1.5 tracking-tight">Club Chat</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Real-time banter rooms exclusive to your club. No outsiders.
              </p>
            </div>
          </div>

          {/* CTA card — wide */}
          <div className="col-span-12 md:col-span-7 bg-emerald-50 border-2 border-emerald-100 rounded-[2.5rem] p-10 flex flex-col justify-center min-h-[180px] relative overflow-hidden">
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-emerald-100 rounded-full" />
            <p className="text-xs font-bold tracking-widest uppercase text-emerald-400 mb-3">Ready?</p>
            <h3 className="text-slate-900 font-extrabold text-2xl md:text-3xl tracking-tight mb-6 leading-tight">
              Pick your club.<br />Start earning points today.
            </h3>
            <div>
              <button className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white font-semibold text-sm px-6 py-3 rounded-full transition-all duration-200 hover:scale-[1.03]">
                Get Started Free →
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}