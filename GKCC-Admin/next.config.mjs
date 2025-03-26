/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'api.gkcc.world','localhost:5001/'], // Add all allowed external domains here
  },
};

export default nextConfig;
