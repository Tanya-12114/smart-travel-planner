/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // This proxy is only for local dev, where the Express server runs on
    // localhost:5000. In production (Vercel), lib/api.js and lib/auth.js
    // call NEXT_PUBLIC_API_URL directly, so no rewrite is needed there —
    // Vercel can't proxy to "localhost" anyway.
    if (process.env.NODE_ENV === "production") return [];

    return {
      // "afterFiles" runs AFTER Next.js checks its own pages/api routes
      // so /api/destinations will be handled by Next.js first,
      // and everything else proxies to Express
      afterFiles: [
        {
          source: "/api/:path*",
          destination: "http://localhost:5000/api/:path*",
        },
      ],
    };
  },
};

module.exports = nextConfig;