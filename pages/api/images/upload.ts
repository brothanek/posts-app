import nc from 'next-connect'
import formidable from 'formidable'
import { v2 as cloudinary } from 'cloudinary'
import type { NextApiRequest, NextApiResponse } from 'next'

const CLOUDINARY_URL = process.env.CLOUDINARY_URL
const form = formidable({})

// upload to Cloudinary
const upload = async (imagePath: string) => {
	cloudinary.config({
		cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
		api_key: process.env.CLOUDINARY_API_KEY,
		api_secret: process.env.CLOUDINARY_API_SECRET,
	})
	const image = await cloudinary.uploader.upload(imagePath, {
		quality: '20',
	})
	return { url: image.secure_url, id: image.public_id }
}

const handler = nc<NextApiRequest, NextApiResponse>().post(async (req, res) => {
	if (!CLOUDINARY_URL) return res.json({ success: false, message: 'No Cloudinary URL provided' })
	form.parse(req, async (err, fields, files) => {
		if (err) {
			console.log(err)
			return res.json({ success: false, message: err })
		} else {
			try {
				const imagePath = (files.image as formidable.File).toJSON().filepath
				if (!imagePath) return res.json({ success: false, message: 'No image path found' })
				const { url, id } = await upload(imagePath)
				return res.status(200).json({ success: true, message: 'Image uploaded', url, id })
			} catch (e) {
				console.log(e)
				return res.status(401).json({ message: e })
			}
		}
	})
})

export default handler

export const config = {
	api: {
		bodyParser: false,
	},
}
