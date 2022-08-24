/** @type {import('next').NextConfig} */
const { X_API_KEY, API_URL, MONGODB_URI, CLOUDINARY_URL } = process.env

const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	env: { X_API_KEY, API_URL, MONGODB_URI, CLOUDINARY_URL },
	images: { domains: ['res.cloudinary.com'] },
}

module.exports = nextConfig
