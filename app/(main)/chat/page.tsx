'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase'
import { MessageSquare, Send } from 'lucide-react'

type Message = {
  id: string
  content: string
  club_id: string
  created_at: string
  user_id: string
  profiles: {
    full_name: string
    email: string
    club_name: string
  }
}

const clubColors: Record<string, string> = {
  t3: '#EF0107', t7: '#95BFE5', t91: '#DA291C', t94: '#e30613',
  t36: '#0057B8', t8: '#034694', t31: '#1B458F', t11: '#003399',
  t54: '#CC0000', t40: '#0044A9', t13: '#003090', t14: '#C8102E',
  t43: '#6CABDD', t1: '#DA291C', t4: '#241F20', t17: '#DD0000',
  t20: '#D71920', t6: '#132257', t21: '#7A263A', t39: '#FDB913',
}

export default function ChatPage() {
  const supabase = createClient()
  const [messages, setMessages] = useState<Message[]>([])
  const [content, setContent] = useState('')
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        setProfile(profile)

        if (profile?.club_id) {
          // Load messages for user's club
          const { data: msgs } = await supabase
            .from('messages')
            .select('*, profiles(full_name, email, club_name)')
            .eq('club_id', profile.club_id)
            .order('created_at', { ascending: true })
            .limit(50)

          setMessages(msgs || [])
        }
      }

      setLoading(false)
    }

    init()
  }, [])

  useEffect(() => {
    if (!profile?.club_id) return

    // Realtime subscription
    const channel = supabase
      .channel(`chat:${profile.club_id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `club_id=eq.${profile.club_id}`,
      }, async (payload) => {
        // Fetch the full message with profile
        const { data } = await supabase
          .from('messages')
          .select('*, profiles(full_name, email, club_name)')
          .eq('id', payload.new.id)
          .single()

        if (data) setMessages(prev => [...prev, data])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [profile?.club_id])

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!content.trim() || !user || !profile || sending) return
    setSending(true)

    await supabase.from('messages').insert({
      user_id: user.id,
      club_id: profile.club_id,
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
    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins}m`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h`
    return `${Math.floor(hrs / 24)}d`
  }

  const isMyMessage = (msg: Message) => msg.user_id === user?.id

  // Group consecutive messages from same user
  const isGrouped = (i: number) => {
    if (i === 0) return false
    return messages[i].user_id === messages[i - 1].user_id
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-zinc-200 border-t-black rounded-full animate-spin" />
          <p className="text-zinc-400 text-sm">Loading chat...</p>
        </div>
      </div>
    )
  }

  if (!profile?.club_id) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-4xl mb-3">🏟️</p>
          <p className="text-zinc-900 font-bold text-lg">Pick a club first</p>
          <p className="text-zinc-400 text-sm mt-1">You need to join a club to access the chat.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-white">

      {/* Header */}
      <div className="px-6 py-4 border-b border-zinc-100 flex items-center gap-3 bg-white">
        <div
          className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: clubColors[profile.club_id] || '#000' }}
        >
          <MessageSquare className="w-4 h-4 text-white" />
        </div>
        <div>
          <h1 className="text-zinc-900 font-bold text-base leading-tight">{profile.club_name} Chat</h1>
          <p className="text-zinc-400 text-xs">Fans only · Real-time</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <p className="text-4xl">💬</p>
            <p className="text-zinc-900 font-bold">No messages yet</p>
            <p className="text-zinc-400 text-sm">Be the first to say something.</p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isMine = isMyMessage(msg)
            const grouped = isGrouped(i)

            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${isMine ? 'flex-row-reverse' : 'flex-row'} ${grouped ? 'mt-0.5' : 'mt-3'}`}
              >
                {/* Avatar */}
                {!grouped ? (
                  <div
                    className="w-8 h-8 rounded-2xl flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                    style={{ background: clubColors[profile.club_id] || '#000' }}
                  >
                    {getInitial(msg)}
                  </div>
                ) : (
                  <div className="w-8 flex-shrink-0" />
                )}

                {/* Bubble */}
                <div className={`max-w-[72%] ${isMine ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                  {!grouped && !isMine && (
                    <span className="text-zinc-400 text-xs font-semibold px-1">
                      {msg.profiles?.full_name || msg.profiles?.email?.split('@')[0] || 'Fan'}
                    </span>
                  )}
                  <div className={`px-4 py-2.5 rounded-3xl text-sm font-normal leading-relaxed ${
                    isMine
                      ? 'bg-black text-white rounded-br-lg'
                      : 'bg-zinc-100 text-zinc-900 rounded-bl-lg'
                  }`}>
                    {msg.content}
                  </div>
                  <span className="text-zinc-300 text-[10px] px-1">{getTimeAgo(msg.created_at)}</span>
                </div>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-4 border-t border-zinc-100 bg-white">
        <div className="flex items-center gap-3 bg-zinc-50 border border-zinc-200 rounded-3xl px-4 py-2">
          <input
            ref={inputRef}
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Say something..."
            maxLength={500}
            className="flex-1 bg-transparent text-zinc-900 placeholder-zinc-300 text-sm outline-none font-normal"
          />
          <button
            onClick={handleSend}
            disabled={!content.trim() || sending}
            className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all flex-shrink-0 ${
              content.trim()
                ? 'bg-black text-white hover:bg-zinc-800 active:scale-95'
                : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-zinc-300 text-[10px] text-center mt-2">Enter to send · Only {profile.club_name} fans can see this</p>
      </div>

    </div>
  )
}