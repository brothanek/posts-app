import nc from 'next-connect'
import formidable from 'formidable'
import { v2 as cloudinary } from 'cloudinary'
import type { NextApiRequest, NextApiResponse } from 'next'

const CLOUDINARY_URL = process.env.CLOUDINARY_URL
const form = formidable({})

// upload to Cloudinary
const upload = async (imagePath: string, cloudinaryUrl: string) => {
	const { hostname: cloud_name, username: api_key, password: api_secret } = new URL(cloudinaryUrl)
	cloudinary.config({
		cloud_name,
		api_key,
		api_secret,
	})
	const image = await cloudinary.uploader.upload(imagePath)
	return image.secure_url
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
				const url = await upload(imagePath, CLOUDINARY_URL)
				return res.status(200).json({ success: true, message: 'Image uploaded', url })
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
