import nc from 'next-connect'
import { v2 as cloudinary } from 'cloudinary'
import type { NextApiRequest, NextApiResponse } from 'next'

const CLOUDINARY_URL = process.env.CLOUDINARY_URL

// delete image from Cloudinary
const deleteImage = async (id: string, cloudinaryUrl: string) => {
	const { hostname: cloud_name, username: api_key, password: api_secret } = new URL(cloudinaryUrl)
	cloudinary.config({
		cloud_name,
		api_key,
		api_secret,
	})
	return await cloudinary.uploader.destroy(id)
}

const handler = nc<NextApiRequest, NextApiResponse>().delete(async (req, res) => {
	const { id } = req.query

	if (!CLOUDINARY_URL) return res.json({ success: false, message: 'No Cloudinary URL provided' })

	try {
		const response = await deleteImage(id + '', CLOUDINARY_URL)
		return res.status(200).json({ success: true, message: 'Image deleted' })
	} catch (e) {
		console.log(e)
		return res.status(401).json({ message: e })
	}
})

export default handler
