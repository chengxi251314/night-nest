/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: false
  },
  // Proxy API requests to the backend so login works even when nginx isn't routing /v1/
  async rewrites() {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:3100";
    return [
      { source: "/health", destination: `${apiBase}/health` },
      { source: "/v1/:path*", destination: `${apiBase}/v1/:path*` },
    ];
  }
};

module.exports = nextConfig;
