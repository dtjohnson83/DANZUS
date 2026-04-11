/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { source: '/context', destination: '/context/index.html' },
      { source: '/context/', destination: '/context/index.html' },
    ]
  },
}

module.exports = nextConfig
