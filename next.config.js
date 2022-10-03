/** @type {import('next').NextConfig} */
const {
	API_URL,
	MONGODB_URI,
	CLOUDINARY_URL,
	SESSION_SECRET,
	CLOUDINARY_API_SECRET,
	CLOUDINARY_NAME,
	CLOUDINARY_API_KEY,
} = process.env

const nextConfig = {
	reactStrictMode: true,
	i18n: {
		locales: ['en'],
		defaultLocale: 'en',
	},
	swcMinify: true,
	env: {
		API_URL,
		MONGODB_URI,
		CLOUDINARY_URL,
		SESSION_SECRET,
		CLOUDINARY_API_SECRET,
		CLOUDINARY_NAME,
		CLOUDINARY_API_KEY,
	},
	images: { domains: ['res.cloudinary.com'] },
}

module.exports = nextConfig
