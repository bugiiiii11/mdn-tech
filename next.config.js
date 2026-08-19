const isDev = process.env.NODE_ENV !== "production";

// Content-Security-Policy for our own pages (mdntech.org, app., admin.).
//
// It does NOT apply to the embeddable widget: public/widget.js executes inside
// the customer's page under the customer's CSP.
//
// 'unsafe-inline' + 'unsafe-eval' in script-src are Next.js requirements --
// the framework ships inline bootstrap scripts, and dev mode needs eval for
// React Fast Refresh. Tightening those needs nonce-based CSP via middleware,
// which is a separate piece of work; everything else is locked down now.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "media-src 'self' blob:",
  "font-src 'self' data:",
  // Supabase (auth, data, realtime) + EmailJS (contact forms, browser SDK).
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.emailjs.com",
  "worker-src 'self' blob:",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  // Prod only: on http://localhost this rewrites navigations to https and the
  // dev server (plain http) drops them.
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

// mdntech.sk is a redirect-only domain: it exists so Slovak prospects can be
// handed a .sk address, and it lands them on the Slovak page rather than the
// English homepage. Vercel's own "Redirect to" domain setting cannot do that
// -- it only maps a host to the SAME path on another host -- so the mapping
// lives here instead, and both .sk hosts are added to the project as normal
// domains. Redirects run before middleware, so .sk traffic never pays for a
// Supabase session refresh.
//
// Query strings are forwarded automatically, which is what keeps campaign UTMs
// (lib/marketing/attribution.ts) alive across the hop.
const SK_DOMAIN_HOSTS = ["mdntech.sk", "www.mdntech.sk"];

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Two Next processes cannot share a build directory: a `npm run build` run
  // while `npm run dev` is up overwrites `.next/` under the dev server and it
  // starts serving 500s. Set NEXT_DIST_DIR to verify a build without touching
  // a running dev server (e.g. `NEXT_DIST_DIR=.next-verify npm run build`).
  // Unset everywhere that matters, including Vercel, so the default holds.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    formats: ["image/avif", "image/webp"],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  experimental: {
    outputFileTracingIncludes: {
      "/command-center/knowledge": ["./command-center/knowledge/**/*.md"],
      "/command-center/knowledge/*": ["./command-center/knowledge/**/*.md"],
    },
  },
  async redirects() {
    // Order matters: "/" is also matched by "/:path*" (zero segments), so the
    // root rule has to come first for each host or the bare domain would land
    // on the English homepage. Every SK page lives under mdntech.org/sk/...,
    // so deep .sk paths get the /sk prefix ADDED (mdntech.sk/referencie/x ->
    // mdntech.org/sk/referencie/x); forwarding the raw path 404'd every deep
    // link. Paths already starting with /sk pass through un-doubled.
    return SK_DOMAIN_HOSTS.flatMap((host) => [
      {
        source: "/",
        has: [{ type: "host", value: host }],
        destination: "https://mdntech.org/sk",
        permanent: true,
      },
      {
        source: "/sk/:path*",
        has: [{ type: "host", value: host }],
        destination: "https://mdntech.org/sk/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: host }],
        destination: "https://mdntech.org/sk/:path*",
        permanent: true,
      },
    ]);
  },
  async headers() {
    return [
      // NOTE: the /api/chat/* CORS block that used to live here is gone. It
      // pinned Access-Control-Allow-Origin to "*" for every widget request and
      // would now emit a second, conflicting value alongside the per-chatbot
      // header the route handlers set (lib/chat/cors.ts), which browsers reject
      // outright. CORS for the widget API is owned by the routes.
      {
        source: "/videos/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: csp,
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
