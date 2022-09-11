/** @type {import('next').NextConfig} */
const { API_URL, MONGODB_URI, CLOUDINARY_URL, SESSION_SECRET } = process.env

const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	env: { API_URL, MONGODB_URI, CLOUDINARY_URL, SESSION_SECRET },
	images: { domains: ['res.cloudinary.com'] },
}

module.exports = nextConfig
