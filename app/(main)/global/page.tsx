'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase'
import { Send, Globe } from 'lucide-react'

type Message = {
  id: string
  content: string
  club_id: string
  club_name: string
  created_at: string
  user_id: string
  profiles: {
    full_name: string
    email: string
    club_name: string
    club_id: string
  }
}

const clubColors: Record<string, string> = {
  t3: '#EF0107', t7: '#95BFE5', t91: '#DA291C', t94: '#e30613',
  t36: '#0057B8', t8: '#034694', t31: '#1B458F', t11: '#003399',
  t54: '#CC0000', t40: '#0044A9', t13: '#003090', t14: '#C8102E',
  t43: '#6CABDD', t1: '#DA291C', t4: '#241F20', t17: '#DD0000',
  t20: '#D71920', t6: '#132257', t21: '#7A263A', t39: '#FDB913',
}

export default function GlobalChatPage() {
  const supabase = createClient()
  const [messages, setMessages] = useState<Message[]>([])
  const [content, setContent] = useState('')
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [onlineCount, setOnlineCount] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data: p } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        setProfile(p)
      }

      // Load global messages — club_id = 'global'
      const { data: msgs } = await supabase
        .from('messages')
        .select('*, profiles(full_name, email, club_name, club_id)')
        .eq('club_id', 'global')
        .order('created_at', { ascending: true })
        .limit(80)

      setMessages(msgs || [])
      setLoading(false)
    }

    init()
  }, [])

  useEffect(() => {
    // Realtime subscription for global chat
    const channel = supabase
      .channel('global-chat')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `club_id=eq.global`,
      }, async (payload) => {
        const { data } = await supabase
          .from('messages')
          .select('*, profiles(full_name, email, club_name, club_id)')
          .eq('id', payload.new.id)
          .single()
        if (data) setMessages(prev => [...prev, data])
      })
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        setOnlineCount(Object.keys(state).length)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED' && user) {
          await channel.track({ user_id: user.id })
        }
      })

    return () => { supabase.removeChannel(channel) }
  }, [user])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!content.trim() || !user || !profile || sending) return
    setSending(true)

    await supabase.from('messages').insert({
      user_id: user.id,
      club_id: 'global',
      club_name: profile.club_name || 'Fan',
      content: content.trim(),
    })

    setContent('')
    setSending(false)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const getInitial = (msg: Message) => {
    const name = msg.profiles?.full_name || msg.profiles?.email || '?'
    return name.charAt(0).toUpperCase()
  }

  const getTimeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'now'
    if (mins < 60) return `${mins}m`
    return `${Math.floor(mins / 60)}h`
  }

  const isMe = (msg: Message) => msg.user_id === user?.id
  const isGrouped = (i: number) => i > 0 && messages[i].user_id === messages[i - 1].user_id

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-zinc-200 border-t-black rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col bg-white" style={{ height: 'calc(100vh - 4rem)' }}>

      {/* Header */}
      <div className="px-5 py-3.5 border-b border-zinc-100 flex items-center justify-between bg-white flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-black rounded-2xl flex items-center justify-center">
            <Globe className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-zinc-900 font-bold text-sm leading-tight">Global Banter</h1>
            <p className="text-zinc-400 text-xs">All clubs · Everyone welcome</p>
          </div>
        </div>

        {/* Online count */}
        {onlineCount > 0 && (
          <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-100 rounded-full px-3 py-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-zinc-500 text-xs font-semibold">{onlineCount} online</span>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-0.5">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
            <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center">
              <Globe className="w-5 h-5 text-zinc-400" />
            </div>
            <p className="text-zinc-900 font-bold text-sm">No messages yet</p>
            <p className="text-zinc-400 text-xs">Start the global banter 🌍</p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const mine = isMe(msg)
            const grouped = isGrouped(i)
            const clubColor = clubColors[msg.profiles?.club_id] || '#000'

            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${mine ? 'flex-row-reverse' : 'flex-row'} ${grouped ? 'mt-0.5' : 'mt-3'}`}
              >
                {/* Avatar */}
                {!grouped ? (
                  <div
                    className="w-7 h-7 rounded-xl flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                    style={{ background: clubColor }}
                  >
                    {getInitial(msg)}
                  </div>
                ) : (
                  <div className="w-7 flex-shrink-0" />
                )}

                <div className={`max-w-[70%] flex flex-col gap-0.5 ${mine ? 'items-end' : 'items-start'}`}>
                  {/* Name + club tag */}
                  {!grouped && !mine && (
                    <div className="flex items-center gap-1.5 px-1">
                      <span className="text-zinc-700 text-xs font-bold">
                        {msg.profiles?.full_name || msg.profiles?.email?.split('@')[0] || 'Fan'}
                      </span>
                      {msg.profiles?.club_name && (
                        <span
                          className="text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white"
                          style={{ background: clubColor }}
                        >
                          {msg.profiles.club_name}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Bubble */}
                  <div className={`px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${
                    mine
                      ? 'bg-black text-white rounded-br-sm'
                      : 'bg-zinc-100 text-zinc-900 rounded-bl-sm'
                  }`}>
                    {msg.content}
                  </div>

                  <span className="text-zinc-300 text-[9px] px-1">{getTimeAgo(msg.created_at)}</span>
                </div>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-zinc-100 bg-white flex-shrink-0">
        <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-2">
          {/* Club color dot */}
          {profile?.club_id && (
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: clubColors[profile.club_id] || '#000' }}
            />
          )}
          <input
            ref={inputRef}
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Drop your take to the world..."
            maxLength={500}
            className="flex-1 bg-transparent text-zinc-900 placeholder-zinc-300 text-sm outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!content.trim() || sending}
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${
              content.trim()
                ? 'bg-black text-white hover:bg-zinc-800 active:scale-95'
                : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-zinc-300 text-[9px] text-center mt-1.5">
          Visible to all fans across all clubs 🌍
        </p>
      </div>

    </div>
  )
}