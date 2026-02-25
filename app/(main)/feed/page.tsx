'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Heart, MessageCircle, Flame } from 'lucide-react'

type Post = {
  id: string
  content: string
  club_name: string
  club_id: string
  likes: number
  created_at: string
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

export default function FeedPage() {
  const supabase = createClient()
  const [posts, setPosts] = useState<Post[]>([])
  const [content, setContent] = useState('')
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [posting, setPosting] = useState(false)

  const dailyPrompt = "🗣️ Hot take: Who's the most overrated player in the EPL right now?"

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
      }

      const { data: posts } = await supabase
        .from('posts')
        .select('*, profiles(full_name, email, club_name)')
        .order('created_at', { ascending: false })
        .limit(30)

      setPosts(posts || [])
      setLoading(false)
    }

    init()

    // Realtime
    const channel = supabase
      .channel('posts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, (payload) => {
        setPosts(prev => [payload.new as Post, ...prev])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const handlePost = async () => {
    if (!content.trim() || !user || !profile) return
    setPosting(true)

    await supabase.from('posts').insert({
      user_id: user.id,
      club_id: profile.club_id,
      club_name: profile.club_name,
      content: content.trim(),
    })

    setContent('')
    setPosting(false)
  }

  const handleLike = async (postId: string, currentLikes: number) => {
    await supabase.from('posts').update({ likes: currentLikes + 1 }).eq('id', postId)
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: currentLikes + 1 } : p))
  }

  const getInitial = (post: Post) => {
    const name = post.profiles?.full_name || post.profiles?.email || '?'
    return name.charAt(0).toUpperCase()
  }

  const getTimeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Daily Prompt */}
        <div className="bg-black rounded-3xl p-6 mb-6 relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/5 rounded-full" />
          <div className="flex items-center gap-2 mb-3">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-white/50 text-xs font-bold tracking-widest uppercase">Daily Prompt</span>
          </div>
          <p className="text-white font-bold text-lg leading-snug">{dailyPrompt}</p>
          <p className="text-white/30 text-xs mt-2">Expires at midnight · Drop your take below 👇</p>
        </div>

        {/* Compose box */}
        {profile && (
          <div className="bg-white border border-zinc-100 rounded-3xl p-5 mb-6 shadow-sm">
            <div className="flex gap-3">
              {/* Avatar */}
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                style={{ background: clubColors[profile.club_id] || '#000' }}
              >
                {profile.full_name?.charAt(0).toUpperCase() || profile.email?.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Drop your take..."
                  rows={3}
                  maxLength={280}
                  className="w-full resize-none bg-transparent text-zinc-900 placeholder-zinc-300 text-base font-normal outline-none leading-relaxed"
                />

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-100">
                  <div className="flex items-center gap-2">
                    {profile.club_name && (
                      <span className="text-xs font-semibold text-zinc-400 bg-zinc-50 border border-zinc-100 px-3 py-1 rounded-full">
                        {profile.club_name}
                      </span>
                    )}
                    <span className="text-xs text-zinc-300">{content.length}/280</span>
                  </div>

                  <button
                    onClick={handlePost}
                    disabled={!content.trim() || posting}
                    className={`text-sm font-bold px-5 py-2 rounded-full transition-all ${
                      content.trim()
                        ? 'bg-black text-white hover:bg-zinc-800 hover:scale-[1.02]'
                        : 'bg-zinc-100 text-zinc-300 cursor-not-allowed'
                    }`}
                  >
                    {posting ? 'Posting...' : 'Post'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Posts */}
        {loading ? (
          <div className="flex flex-col gap-4">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white rounded-3xl p-5 animate-pulse">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-zinc-100 rounded-2xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-zinc-100 rounded w-1/3" />
                    <div className="h-4 bg-zinc-100 rounded w-3/4" />
                    <div className="h-4 bg-zinc-100 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🏟️</p>
            <p className="text-zinc-900 font-bold text-lg">No posts yet.</p>
            <p className="text-zinc-400 text-sm mt-1">Be the first to drop a take.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {posts.map((post) => (
              <div key={post.id} className="bg-white border border-zinc-100 rounded-3xl p-5 hover:border-zinc-200 transition-all">
                <div className="flex gap-3">
                  {/* Avatar */}
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{ background: clubColors[post.club_id] || '#000' }}
                  >
                    {getInitial(post)}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-zinc-900 font-bold text-sm">
                        {post.profiles?.full_name || post.profiles?.email?.split('@')[0] || 'Fan'}
                      </span>
                      {post.club_name && (
                        <span className="text-xs font-semibold text-zinc-400 bg-zinc-50 border border-zinc-100 px-2 py-0.5 rounded-full">
                          {post.club_name}
                        </span>
                      )}
                      <span className="text-zinc-300 text-xs ml-auto">{getTimeAgo(post.created_at)}</span>
                    </div>

                    {/* Content */}
                    <p className="text-zinc-700 text-sm leading-relaxed mb-3">{post.content}</p>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLike(post.id, post.likes)}
                        className="flex items-center gap-1.5 text-zinc-400 hover:text-red-500 transition-colors group"
                      >
                        <Heart className="w-4 h-4 group-hover:fill-red-500 transition-all" />
                        <span className="text-xs font-semibold">{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-700 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-xs font-semibold">Reply</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}