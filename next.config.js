/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { source: '/contextkit', destination: '/contextkit/index.html' },
      { source: '/contextkit/', destination: '/contextkit/index.html' },
    ]
  },
  async redirects() {
    return [
      // Legacy path — ContextKit originally lived at /context. The URL was
      // renamed to match the product name for SEO/brand alignment. 301 to
      // preserve any existing backlinks, shares, or indexed URLs.
      { source: '/context', destination: '/contextkit', permanent: true },
      { source: '/context/', destination: '/contextkit', permanent: true },
      { source: '/context/:path*', destination: '/contextkit/:path*', permanent: true },
    ]
  },
}

module.exports = nextConfig
