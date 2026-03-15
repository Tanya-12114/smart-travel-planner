/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
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