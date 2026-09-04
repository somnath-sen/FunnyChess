/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'googleusercontent.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/progress',
        destination: '/profile',
        permanent: true,
      },
      {
        source: '/achievements',
        destination: '/profile',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
