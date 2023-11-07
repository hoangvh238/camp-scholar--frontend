/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['res.cloudinary.com', 'images.unsplash.com', 'unsplash.com'], // Thêm các tên miền khác nếu cần
  },
}

module.exports = nextConfig
