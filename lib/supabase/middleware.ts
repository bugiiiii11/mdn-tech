import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const ADMIN_HOST = 'admin.mdntech.org'
const PORTAL_HOST = 'app.mdntech.org'

function isAdminHost(host: string): boolean {
  return host === ADMIN_HOST || host.startsWith(`${ADMIN_HOST}:`)
}

function isPortalHost(host: string): boolean {
  return host === PORTAL_HOST || host.startsWith(`${PORTAL_HOST}:`)
}

function isLocalDev(host: string): boolean {
  return host.startsWith('localhost') || host.startsWith('127.0.0.1')
}

// Public portal paths (no auth required). ToolKit is the install destination
// linked from social posts; signup-before-install would kill the funnel.
function isPublicPortalPath(pathname: string): boolean {
  return (
    pathname === '/' ||
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname === '/toolkit' ||
    pathname.startsWith('/toolkit/')
  )
}

export async function updateSession(request: NextRequest) {
  const host = request.headers.get('host') || ''
  const { pathname } = request.nextUrl

  // --- External redirects (old URLs on wrong hosts; skipped on localhost so
  // dev can hit /portal/* and /command-center/* without bouncing to prod). ---

  if (!isLocalDev(host) && !isAdminHost(host) && pathname.startsWith('/command-center')) {
    const newPath = pathname.replace(/^\/command-center/, '') || '/'
    const url = new URL(`https://${ADMIN_HOST}${newPath}`)
    url.search = request.nextUrl.search
    return NextResponse.redirect(url, 301)
  }

  if (!isLocalDev(host) && !isPortalHost(host) && !isAdminHost(host) && pathname.startsWith('/portal')) {
    const newPath = pathname.replace(/^\/portal/, '') || '/'
    const url = new URL(`https://${PORTAL_HOST}${newPath}`)
    url.search = request.nextUrl.search
    return NextResponse.redirect(url, 301)
  }

  // --- Clean URL redirects (strip prefixes on matching hosts) ---

  if (isAdminHost(host) && pathname.startsWith('/command-center')) {
    const cleanPath = pathname.replace(/^\/command-center/, '') || '/'
    const url = new URL(`https://${ADMIN_HOST}${cleanPath}`)
    url.search = request.nextUrl.search
    return NextResponse.redirect(url)
  }

  if (isPortalHost(host) && pathname.startsWith('/portal')) {
    const cleanPath = pathname.replace(/^\/portal/, '') || '/'
    const url = new URL(`https://${PORTAL_HOST}${cleanPath}`)
    url.search = request.nextUrl.search
    return NextResponse.redirect(url)
  }

  // --- Session refresh (BEFORE auth checks so role-type checks can access user metadata) ---
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

  // --- Admin host: auth + role checks ---
  if (isAdminHost(host)) {
    const accountType = user?.user_metadata?.account_type

    // Customer trying to access admin portal → redirect to admin login
    if (user && accountType === 'customer') {
      return NextResponse.redirect(new URL(`https://${ADMIN_HOST}/login?error=unauthorized`))
    }

    // Require login for protected paths
    if (pathname !== '/login' && !user) {
      return NextResponse.redirect(new URL(`https://${ADMIN_HOST}/login`))
    }

    // Redirect logged-in users away from login page
    if (pathname === '/login' && user) {
      return NextResponse.redirect(new URL(`https://${ADMIN_HOST}/`))
    }

    // Public chat API passthrough
    if (pathname.startsWith('/api/chat/')) {
      return NextResponse.next()
    }

    // Rewrite clean paths to /command-center/* internally
    const internalPath = pathname === '/'
      ? '/command-center/dashboard'
      : `/command-center${pathname}`
    const url = request.nextUrl.clone()
    url.pathname = internalPath
    return NextResponse.rewrite(url)
  }

  // --- Portal host: auth + role checks ---
  if (isPortalHost(host)) {
    const accountType = user?.user_metadata?.account_type

    // Admin trying to access portal → redirect to portal login
    if (user && accountType !== 'customer') {
      return NextResponse.redirect(new URL(`https://${PORTAL_HOST}/login?error=unauthorized`))
    }

    // Require login for non-public paths
    if (!isPublicPortalPath(pathname) && !user) {
      return NextResponse.redirect(new URL(`https://${PORTAL_HOST}/login`))
    }

    // Redirect logged-in users away from login page → ChatKit (default working surface)
    if (pathname === '/login' && user) {
      return NextResponse.redirect(new URL(`https://${PORTAL_HOST}/chatkit`))
    }

    // API passthrough
    if (pathname.startsWith('/api/')) {
      return NextResponse.next()
    }

    // Rewrite clean paths to /portal/* internally. Default landing → /chatkit.
    const internalPath = pathname === '/'
      ? '/portal/chatkit'
      : `/portal${pathname}`
    const url = request.nextUrl.clone()
    url.pathname = internalPath
    return NextResponse.rewrite(url)
  }

  // --- Marketing host: existing auth guard logic ---

  if (pathname.startsWith('/api/chat/')) {
    return NextResponse.next()
  }

  const isCommandCenter = pathname.startsWith('/command-center')
  const isCCLogin = pathname === '/command-center/login'
  const isPortal = pathname.startsWith('/portal')
  const isPortalLogin = pathname === '/portal/login'
  const isPortalSignup = pathname === '/portal/signup'
  const isPortalToolkit = pathname === '/portal/toolkit' || pathname.startsWith('/portal/toolkit/')

  if (isCommandCenter && !isCCLogin && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/command-center/login'
    return NextResponse.redirect(url)
  }

  if (isCCLogin && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/command-center/dashboard'
    return NextResponse.redirect(url)
  }

  if (isPortal && !isPortalLogin && !isPortalSignup && !isPortalToolkit && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/portal/login'
    return NextResponse.redirect(url)
  }

  if (isPortalLogin && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/portal/chatkit'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
