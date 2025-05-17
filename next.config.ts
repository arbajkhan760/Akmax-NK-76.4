
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
       { // Added example.com for mock video/ad URLs used as image sources
        protocol: 'https',
        hostname: 'example.com',
        port: '',
        pathname: '/**',
       },
       {
        protocol: 'https',
        hostname: 'api.qrserver.com',
        port: '',
        pathname: '/**',
       }
      // You might need to add other hostnames if your app uses them
    ],
  },
};

export default nextConfig;
