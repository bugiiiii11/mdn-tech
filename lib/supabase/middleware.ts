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

  // 2. On admin host, strip /command-center prefix from URLs (redirect to clean path)
  if (isAdminHost(host) && pathname.startsWith('/command-center')) {
    const cleanPath = pathname.replace(/^\/command-center/, '') || '/'
    const url = new URL(`https://${ADMIN_HOST}${cleanPath}`)
    url.search = request.nextUrl.search
    return NextResponse.redirect(url)
  }

  // 3. On admin host, rewrite clean paths to /command-center/* internally
  if (isAdminHost(host)) {
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

  // --- Portal host branching (app.mdntech.org) ---

  // Redirect /portal/* on marketing site to portal subdomain
  if (!isPortalHost(host) && !isAdminHost(host) && pathname.startsWith('/portal')) {
    const newPath = pathname.replace(/^\/portal/, '') || '/'
    const url = new URL(`https://${PORTAL_HOST}${newPath}`)
    url.search = request.nextUrl.search
    return NextResponse.redirect(url, 301)
  }

  // On portal host, strip /portal prefix (clean URLs)
  if (isPortalHost(host) && pathname.startsWith('/portal')) {
    const cleanPath = pathname.replace(/^\/portal/, '') || '/'
    const url = new URL(`https://${PORTAL_HOST}${cleanPath}`)
    url.search = request.nextUrl.search
    return NextResponse.redirect(url)
  }

  // On portal host, rewrite clean paths to /portal/* internally
  if (isPortalHost(host)) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.next()
    }

    const internalPath = pathname === '/'
      ? '/portal/dashboard'
      : `/portal${pathname}`

    const url = request.nextUrl.clone()
    url.pathname = internalPath
    return NextResponse.rewrite(url)
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
  const isCCLogin = pathname === '/command-center/login'
  const isPortal = pathname.startsWith('/portal')
  const isPortalLogin = pathname === '/portal/login'
  const isPortalSignup = pathname === '/portal/signup'

  // --- CC auth redirects ---
  if (isCommandCenter && !isCCLogin && !user) {
    if (isAdminHost(host)) {
      return NextResponse.redirect(new URL(`https://${ADMIN_HOST}/login`))
    }
    const url = request.nextUrl.clone()
    url.pathname = '/command-center/login'
    return NextResponse.redirect(url)
  }

  if (isCCLogin && user) {
    if (isAdminHost(host)) {
      return NextResponse.redirect(new URL(`https://${ADMIN_HOST}/`))
    }
    const url = request.nextUrl.clone()
    url.pathname = '/command-center/dashboard'
    return NextResponse.redirect(url)
  }

  // --- Portal auth redirects ---
  if (isPortal && !isPortalLogin && !isPortalSignup && !user) {
    if (isPortalHost(host)) {
      return NextResponse.redirect(new URL(`https://${PORTAL_HOST}/login`))
    }
    const url = request.nextUrl.clone()
    url.pathname = '/portal/login'
    return NextResponse.redirect(url)
  }

  if (isPortalLogin && user) {
    if (isPortalHost(host)) {
      return NextResponse.redirect(new URL(`https://${PORTAL_HOST}/`))
    }
    const url = request.nextUrl.clone()
    url.pathname = '/portal/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
