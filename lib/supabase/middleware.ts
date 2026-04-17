import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const ADMIN_HOST = 'admin.mdntech.org'

function isAdminHost(host: string): boolean {
  return host === ADMIN_HOST || host.startsWith(`${ADMIN_HOST}:`)
}

export async function updateSession(request: NextRequest) {
  const host = request.headers.get('host') || ''
  const { pathname } = request.nextUrl

  // --- Host branching ---

  // 1. Redirect old /command-center/* URLs on marketing site to admin subdomain
  if (!isAdminHost(host) && pathname.startsWith('/command-center')) {
    const newPath = pathname.replace(/^\/command-center/, '') || '/'
    const url = new URL(`https://${ADMIN_HOST}${newPath}`)
    url.search = request.nextUrl.search
    return NextResponse.redirect(url, 301)
  }

  // 2. On admin host, rewrite paths to /command-center/* internally
  if (isAdminHost(host)) {
    // Skip rewrite if already targeting /command-center (internal rewrites)
    if (!pathname.startsWith('/command-center')) {
      // Public chat API passthrough
      if (pathname.startsWith('/api/chat/')) {
        return NextResponse.next()
      }

      // Map admin root to dashboard
      const internalPath = pathname === '/'
        ? '/command-center/dashboard'
        : `/command-center${pathname}`

      const url = request.nextUrl.clone()
      url.pathname = internalPath
      return NextResponse.rewrite(url)
    }
  }

  // --- Public route passthrough ---
  if (pathname.startsWith('/api/chat/')) {
    return NextResponse.next()
  }

  // --- Supabase session refresh ---
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isCommandCenter = pathname.startsWith('/command-center')
  const isLoginPage = pathname === '/command-center/login'

  // Auth redirects -- use admin host URLs when on admin subdomain
  if (isCommandCenter && !isLoginPage && !user) {
    if (isAdminHost(host)) {
      const url = new URL(`https://${ADMIN_HOST}/login`)
      return NextResponse.redirect(url)
    }
    const url = request.nextUrl.clone()
    url.pathname = '/command-center/login'
    return NextResponse.redirect(url)
  }

  if (isLoginPage && user) {
    if (isAdminHost(host)) {
      const url = new URL(`https://${ADMIN_HOST}/`)
      return NextResponse.redirect(url)
    }
    const url = request.nextUrl.clone()
    url.pathname = '/command-center/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
