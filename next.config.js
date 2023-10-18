/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['images.unsplash.com'],
    domains: ['res.cloudinary.com'],
    domains: ['unsplash.com'] // Add any other domains you need here
  },
}

module.exports = nextConfig
