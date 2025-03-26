/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**', // Allow all paths from Cloudinary
      },
      {
        protocol: 'https',
        hostname: 'api.gkcc.world',
        pathname: '/**', // Allow all paths from your backend
      },
    ],
    formats: ['image/avif', 'image/webp'], // Optional: Enable modern formats
    deviceSizes: [640, 768, 1024, 1280, 1600], // Optional: Optimize for common screen sizes
    minimumCacheTTL: 60 * 60 * 24, // Cache images for 24 hours
  },
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
