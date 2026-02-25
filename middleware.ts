import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const protectedRoutes = ['/feed', '/predictions', '/polls', '/chat', '/leaderboard', '/table', '/profile']
  const isProtected = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))

  // Not logged in + trying to access protected route → back to landing
  if (!user && isProtected) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Logged in + on landing page → go to feed
  if (user && request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/feed', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|auth).*)'],
}