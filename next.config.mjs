/** @type {import('next').NextConfig} */
const securityHeaders = [
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
    value: "SAMEORIGIN",
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
    value: "camera=(), microphone=(), geolocation=(self)",
  },
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
  {
    key: "Cross-Origin-Resource-Policy",
    value: "same-origin",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      process.env.NODE_ENV === "production"
        ? "script-src 'self' 'unsafe-inline' https://apis.google.com https://www.googletagmanager.com https://connect.facebook.net https://js.stripe.com"
        : "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://www.googletagmanager.com https://connect.facebook.net https://js.stripe.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https://images.unsplash.com https://res.cloudinary.com https://*.googleusercontent.com https://*.fbcdn.net https://www.googletagmanager.com https://*.google-analytics.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "connect-src 'self' https://*.neon.tech https://*.cloudinary.com https://api.stripe.com https://accounts.google.com https://*.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com",
      "frame-src 'self' https://accounts.google.com https://www.facebook.com https://js.stripe.com https://www.googletagmanager.com",
      "frame-ancestors 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self' https://accounts.google.com https://www.facebook.com",
    ].join("; "),
  },
];

const nextConfig = {
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  // Use standalone output only during containerized Docker builds, never on Vercel
  ...(process.env.DOCKER_BUILD === "standalone" ? { output: "standalone" } : {}),
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "pakistantravel.agency",
          },
        ],
        destination: "https://www.pakistantravel.agency/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "pakistantravel-agency.vercel.app",
          },
        ],
        destination: "https://www.pakistantravel.agency/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "pakistan-travel-agency.vercel.app",
          },
        ],
        destination: "https://www.pakistantravel.agency/:path*",
        permanent: true,
      },
      {
        source: "/how-we-verify-partners",
        destination: "/partner-info",
        permanent: true,
      },
      {
        source: "/vendor/onboarding",
        destination: "/list-your-tour",
        permanent: true,
      },
      {
        source: "/vendor-onboarding",
        destination: "/list-your-tour",
        permanent: true,
      },
      {
        source: "/ur",
        destination: "/",
        permanent: true,
      },
      {
        source: "/ur/:path*",
        destination: "/:path*",
        permanent: true,
      },
      {
        source: "/hotels",
        destination: "/tours",
        permanent: true,
      },
      {
        source: "/hotels/:path*",
        destination: "/tours",
        permanent: true,
      },
      {
        source: "/rentals",
        destination: "/tours",
        permanent: true,
      },
      {
        source: "/rentals/:path*",
        destination: "/tours",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/:prefix(partner-hub|secure-admin|account|dashboard|api)/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive",
          },
        ],
      },
      {
        source: "/:page(login|register|forgot-password|search)",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
