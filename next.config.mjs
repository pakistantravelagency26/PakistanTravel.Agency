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
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://connect.facebook.net https://js.stripe.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https://images.unsplash.com https://res.cloudinary.com https://*.googleusercontent.com https://*.fbcdn.net",
      "font-src 'self' https://fonts.gstatic.com data:",
      "connect-src 'self' https://*.neon.tech https://*.cloudinary.com https://api.stripe.com https://accounts.google.com",
      "frame-src 'self' https://accounts.google.com https://www.facebook.com https://js.stripe.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig = {
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
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
