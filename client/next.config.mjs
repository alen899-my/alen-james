/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    instrumentationHook: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-76d29d1e7d984d4bbeb765c60e106b44.r2.dev',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig
