/** @type {import('next').NextConfig} */
const { X_API_KEY, API_URL, MONGO_URI } = process.env

const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	env: { X_API_KEY, API_URL, MONGO_URI },
}

module.exports = nextConfig
